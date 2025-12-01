//const express = require('express');

import express from "express"; //after change type: module
import dotenv from "dotenv";
import path from "path"; //no need install due to in package of node
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from"./routes/message.route.js";
import { connectDB } from "./lib/db.js";  //if use export default connectDB in db,js, then no need {};
import { error } from "console";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Parse JSON and urlencoded bodies so POST /api/auth/signup works
app.use(express.json()); //req body
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//make ready for deployment
if(process.env.NODE_ENV === "production"){

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
    app.listen(PORT,()=>{
        console.log(`Server running on port: ${PORT}`);
    });
}).catch((error)=>{
    console.error("Failed to connect to MongoDB:" , err);
    process.exit(1);
});