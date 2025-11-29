import { getDB } from "../db/db"
import bcrypt from "bcryptjs";

const getCollection = () => getDB().collection("userPost");


export const registerUser = async (email: string, name: string, password: string) => {
    try {
        const user = await getCollection().findOne({ email });
        if (user) return null;

        const passwordEncriptada = await bcrypt.hash(password, 10);

       const userID= await getCollection().insertOne({
            email,
            name,
            password: passwordEncriptada
        })
        return userID.insertedId.toString();
    } catch (error) {
        console.log("Error al registrarse");
    }
}

export const login = async (email: string, password: string) => {
    try {
        const user = await getCollection().findOne({email});
        if(!user) return null;

        const validpassword = await bcrypt.compare(password, user.password);
        if(!validpassword) return null;

        return user;

    } catch (error) {
        return null;
    }
}