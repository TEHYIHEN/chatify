import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";

export const signup = async (req, res) =>{

    const {fullName, email, password} = req.body;
    //res.send("Signup endpoint");

    //3 line added after CR
    const name = typeof fullName === "string" ? fullName.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const pass = typeof password === "string" ? password : "";


    try {

        //After CR
        if (!name || !normalizedEmail || !pass) {
         return res.status(400).json({ message: "All fields are required" });
        }
        if (pass.length < 6) {
         return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
        }




        //before CR
        /*if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }*/
        
        /*if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }*/


        //check if email valid:regex
        /*const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({message:"Invalid email format"});
        }*/

        //const user = await User.findOne({email});
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        //if(user) return res.status(400).json({message:"Email already exists"});


        //example we need password 123456 turn to $23h$rfojr$qd in database, more secure
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName: name,
            email: normalizedEmail,
            password: hashedPassword,
        });
        
        /*const newUser = new User({

            fullName,
            email,
            password: hashedPassword
        });*/

        if(newUser){


            //before CodeRabbit
            //generateToken(newUser._id, res);
            //await newUser.save();


            //Afrer codeRabbit
            //Persist user first, then issue auth cookie
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({

                _id: savedUser._id,
                fullName: savedUser.fullName,
                eamil: savedUser.email,
                profilePic: savedUser.profilePic,

            });
          
            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch (error) {
                console.error("Failed to send welcome email:", error);
            }

        } else{
            res.status(400).json({message:"Invalid user data"});
        };

    } catch (error) {

        console.log("Error in signup controller",error);

        //handle race-condition: unique email contraint violation
        // 1. By CR
        //if (error?.code === 11000 && (error.keyPattern?.email || error.keyValue?.email)) {
        //return res.status(409).json({ message: "Email already exists" });
        //}

        //2. By GPT
        if(isUniqueEmailError(error)){return res.status(409).json({message:"Email already exists"})};
        
        return res.status(500).json({message: "Internal server error"});
        
    }
};

export const login = async (req, res) => {
    
    const {email, password} = req.body;

    try {

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"});
        //never tell client which one [password or email] is incorrect

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"});

        generateToken(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        
        console.error("Error in login controller:",error);
        res.status(500).json({message:"Internal server error"});
    }

};

export const logout = (_, res) => {
    
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged out successfully"});
};