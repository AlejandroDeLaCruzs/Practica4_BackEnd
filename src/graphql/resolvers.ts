import { ObjectId } from "mongodb";
import { getDB } from "../db/db"
import { IResolvers } from "@graphql-tools/utils";
import { login, registerUser } from "../collections/userspost";
import { signToken } from "../auth";


const nameCollection = "Posts";

export const resolvers: IResolvers = {
  Query: {
    posts: async () => {
      const db = getDB();
      return db.collection(nameCollection).find().toArray();
    },

    myPosts: async (_, __, { user }) => {
      if (!user) return null;

      const db = getDB();
      console.log(user._id.toString())
      const myPosts = await db.collection(nameCollection).find({
        autor: user._id.toString(),
      }).toArray();
      if(!myPosts) return "No tines post publicados";
      return myPosts;
    },

    postById: async (_, { id }, { user }) => {
      if (!user) return null;

      const db = getDB();
      return db.collection(nameCollection).findOne({ _id: new ObjectId(id) });
    },

    me: async (_, __, { user }) => {
      if (!user) return null;

      return {
        _id: user._id.toString(),
        email: user.email,
      };
    },
  },

  Mutation: {
    addPost: async (_, { name, contenido, date }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const db = getDB();
      const result = await db.collection(nameCollection).insertOne({
        name,
        contenido,
        date,
        autor: user._id.toString()
      });
      return {
        _id: result.insertedId,
        name,
        contenido,
        date,
      };
    },

    register: async (
      _,
      { email, name, password }: { email: string; name: string; password: string }
    ) => {
      const userId = await registerUser(email, name, password);
      if(!userId) throw new Error("Este correo ya está registrado");
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