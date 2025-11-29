import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client: MongoClient;
let dB: Db;
const dbName = "Practica_4";

export const connectToMongoDB = async () => {
    try{
        const mongoUrl = process.env.MONGO_URL;
        client = new MongoClient(mongoUrl!);
        await client.connect();
        dB = client.db(dbName);
        console.log("Conectado a Mongo en la BD", dbName);
    }
    catch(err){
        console.log("Error al conector a Mongo: ", err)
    }
};

export const getDB = ():Db => dB;