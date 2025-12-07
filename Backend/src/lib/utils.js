import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId,res) =>{

    /*--------------------------*/
    //After CR
    const{ JWT_SECRET, NODE_ENV } = ENV;
    if(!JWT_SECRET){
        throw new Error("JWT_SECREt is not configured");
    }
    /*--------------------------*/

    const token = jwt.sign({userId}, JWT_SECRET,{
        
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {

        maxAge: 7*24*60*60*1000,  //millieseconds
        httpOnly: true, // prevent XSS attacks: cross-site scripting
        sameSite: ENV.NODE_ENV === "development" ? "lax" : "strict", //CSRF attacks
        //secure: process.env.NODE_ENV === "development" ? false : true,
        secure: ENV.NODE_ENV !== "development",
        path: "/",
     });

     return token;
};