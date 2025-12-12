//const express = require('express');

import express from "express"; //after change type: module
//import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path"; //no need install due to in package of node
import { fileURLToPath } from "url";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from"./routes/message.route.js";
import { connectDB } from "./lib/db.js";  //if use export default connectDB in db,js, then no need {};
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js"; //added after create socket in last section


//dotenv.config();

//const app = express();  //move to socket.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = ENV.PORT || 3000;

// Parse JSON and urlencoded bodies so POST /api/auth/signup works
app.use(express.json({limit:"1mb"})); //req body  //limit the picture size
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  ENV.CLIENT_URL
].filter(Boolean); // removes undefined
app.use(cors({origin:allowedOrigins, credentials:true})); //CORS is a browser security feature that controls which websites are allowed to access your server.

//Parse Cookie
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//make ready for deployment
if(ENV.NODE_ENV === "production"){

    app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

    app.get(/.*/, (_,res) => {
        res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
    })
};

/*app.listen(PORT, () => {

    console.log("Server running on port:" + PORT);
    connectDB();

});*/

connectDB().then(()=>{
    server.listen(PORT,()=>{  //app change to server after added the socket.js
        console.log(`Server running on port: ${PORT}`);
    });
}).catch((error)=>{
    console.error("Failed to connect to MongoDB:" , err);
    process.exit(1);
});