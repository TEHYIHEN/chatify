import express from "express";

const router = express.Router();

router.get("/api/auth/signup", (req,res) =>{
    res.send("Signup endpoint");
});

router.get("/api/auth/login", (req,res) =>{
    res.send("Login endpoint");
});

router.get("/api/auth/logout", (req,res) =>{
    res.send("Logout endpoint");
});

export default router;