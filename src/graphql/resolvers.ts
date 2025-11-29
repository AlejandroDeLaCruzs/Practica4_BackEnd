import { ObjectId } from "mongodb";
import { getDB } from "../db/db"
import { IResolvers } from "@graphql-tools/utils";
import { login, registerUser } from "../collections/userspost";
import { signToken } from "../auth";
import { requireAuth, checkOwnership } from "../utils/utils"
import { get } from "http";


const nameCollection = "Posts";

export const resolvers: IResolvers = {
  Query: {
    posts: async (_, __, { user }) => {
      requireAuth(user);
      return getDB().collection(nameCollection).find().toArray();
    },

    myPosts: async (_, __, { user }) => {
      requireAuth(user);
      const myPosts = await getDB().collection(nameCollection).find({
        autor: user._id.toString(),
      }).toArray();
      if (!myPosts) return "No tienes post publicados";
      return myPosts;
    },

    postById: async (_, { id }, { user }) => {
      requireAuth(user);
      return getDB().collection(nameCollection).findOne({ _id: new ObjectId(id) });
    },

    me: async (_, __, { user }) => {
      if (!user) return null;

      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
      };
    },
  },

  Mutation: {
    addPost: async (_, { titulo, contenido, date }, { user }) => {
      requireAuth(user);
      const db = getDB();
      const result = await db.collection(nameCollection).insertOne({
        titulo,
        contenido,
        date,
        autor: user._id.toString()
      });
      return {
        _id: result.insertedId,
        titulo,
        contenido,
        date,
      };
    },

    deletePost: async (_, { id }, { user }) => {
      requireAuth(user);
      const db = getDB();
      await checkOwnership(id, user._id);
      return db.collection(nameCollection).deleteOne({ _id: new ObjectId(id) });
    },


    modifyPost: async (_, { id, titulo, contenido, date }, { user }) => {
      requireAuth(user);
      await checkOwnership(id, user._id);
      const db = getDB();
      await db.collection(nameCollection).updateOne(
        { _id: new ObjectId(id) },
        { $set: { titulo, contenido, date } }

      )
     return getDB().collection(nameCollection).findOne({ _id: new ObjectId(id) });

    },

    register: async (
      _,
      { email, name, password }: { email: string; name: string; password: string }
    ) => {
      const userId = await registerUser(email, name, password);
      if (!userId) throw new Error("Este correo ya está registrado");
      return signToken(userId as string);
    },

    login: async (
      _,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await login(email, password);
      if (!user) throw new Error("Invalid credentials");
      return signToken(user._id.toString());
    },
  },
};


