import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookie?.jwt;
        if(!token) return res.status(401).json({message:"Unauthorized - No token provided"});

        //const decoded = jwt.verify(token, ENV.JWT_SECRET);
        //if(!decoded) return res.status(401).json({message:"Unauthorized - Invalid token"});

        //After codeRabbit
        const { JWT_SECRET } = ENV;

        if (!JWT_SECRET) {
         console.error("JWT_SECRET is not configured");
         return res.status(500).json({ message: "Server misconfiguration" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
        const msg = err.name === "TokenExpiredError"
        ? "Unauthorized - Token expired"
        : "Unauthorized - Invalid token";

        return res.status(401).json({ message: msg });
        };



        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json({message:"User not found"});

        req.user = user
        next();

    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(500).json({message:"Internal server error"});
    }
};