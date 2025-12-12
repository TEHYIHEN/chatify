import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import { io } from "../lib/socket.js";

export const getAllContacts = async(req, res) => {

    try {
        
        const loggedInUserId = new mongoose.Types.ObjectId(req.user._id); 
        //👆 using req.user._id is enough, but we should have a best practice using mongoose.Types.ObjectId to search the user. becos of mongDB was indicate ObjectId("xxxx")
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId } }).select("-password");
        
        res.status(200).json(filteredUsers);

    } catch (error) {
        
        console.error("Error in getAllContacts:", error);
        res.status(500).json({message:"Server error"});
    }
};

export const getMessagesByUserId = async (req, res) => {

    try {
        
        const myId = req.user._id;
        const {id:userToChatId} = req.params;

        const message = await Message.find({

            $or: [
                {senderId:myId, receiverId: userToChatId},
                {senderId:userToChatId, receiverId:myId},
            ],
        });

        res.status(200).json(message);

    } catch (error) {

        console.error("Error in getMessages controller:", error.message);
        res.status(500).json({error:"Internal server error"});
        
    }

};

export const sendMessage = async (req, res) => {
    
    try {
        
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

/*--------------------------------------------------------------------------------------------------------------*/

        //Added from codeRabbit
        //Block empty message, self-DMs(if disallowed), and non-existing targets
        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        };
        
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        };
        
        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        };
/*-----------------------------------------------------------------------------------------------------------*/ 

        let imageUrl;
        if(image) {

            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({

            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        //send message in real-time if user is online -socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);


    } catch (error) {
        
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getChatPartners = async (req, res) => {
    
    try {
        
        const loggedInUserId = req.user._id;

        // find all message where the logged-in user is either sender or receiver

        const messages= await Message.find({

            $or: [{senderId: loggedInUserId}, {receiverId: loggedInUserId}],

        });

        const chatPartnerIds = [ 
            ...new Set(messages.map((msg) => msg.senderId.toString() === loggedInUserId ? msg.receiverId.toString() : msg.senderId.toString())
        )];

        const chatPartner = await User.find({_id: {$in:chatPartnerIds}}).select("-password");

        res.status(200).json(chatPartner);

    } catch (error) {
        
        console.error("Error in getChatPartners: ", error.message);
        res.status(500).json({error:"Interval server error"});

    }
}