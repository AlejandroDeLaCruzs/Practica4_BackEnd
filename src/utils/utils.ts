import { ObjectId } from "mongodb";
import { getDB } from "../db/db";


const nameCollection = "Posts";


export const requireAuth = (user: any) => {
  if (!user) throw new Error("Debes autentificarte para usar esta API");
};


export const checkOwnership = async (postId: string, userId: string) => {
  const db = getDB();
  const post = await db.collection(nameCollection).findOne({
    _id: new ObjectId(postId),
  });

  if (!post) throw new Error("No existe Post con ese ID");
  if (post.autor.toString() !== userId.toString()) {
    throw new Error("No tienes permiso para realizar esta acción");
  }
};