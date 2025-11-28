import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import { getDB } from "./db/db";
import { ObjectId } from "mongodb";


dotenv.config()
const SECRET = process.env.SECRET as string

type TokenPayload = {
    userId: string;
}

export const signToken = (userId: string) => {
    try {
        return jwt.sign({ userId }, SECRET, { expiresIn: "1h" });
    } catch (error) {
        return null;
    }
}

export const validateToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
}

export const getUserFromToken = async (token: string) => {
    const payload = validateToken(token);
    if (!payload) return null;
    return await getDB().collection("userPost").findOne({
        _id: new ObjectId(payload.userId)
    })
}