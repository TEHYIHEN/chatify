import mongoose from "mongoose";
import { ENV } from "./env.js";


//before CR
/*export const connectDB = async () => {

    try {

        //await mongoose.connect(process.env.MONGO_URI);
        //console.log("MONGODB CONNECTED");
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGODB CONNECTED:",conn.connection.host);

    } catch (error) {
        
        console.error("Error connect to MONGDB:", error);
        process.exit(1);//1 status code means fail, 0 mean success

    }
};*/

//After CR
export const connectDB = async () => {

    try {

        const {MONGO_URI} = ENV;
        if(!MONGO_URI) throw new Error("MONGO_URI is not set");
        const conn = await mongoose.connect(MONGO_URI, {serverSelectionTimeoutMS: 10000});
        console.log("MONGODB CONNECTED:",conn.connection.host);

    } catch (error) {
        
        console.error("Error connect to MONGDB:", error);
        throw error;

    }
};