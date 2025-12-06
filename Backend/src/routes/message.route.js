import express from "express";
import { getAllContacts, getMessagesByUserId, sendMessage, getChatPartners } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

//middleware execute in order - request will get rate-limited first(arcjetprotection), then authenticated(protectRoute).
//more efficient since unauthenticated request get blocked by rate limiting before hitting auth middleware.
router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);

router.get("/chats", getChatPartners);

router.get("/:id", getMessagesByUserId);

router.post("/send/:id", sendMessage);


/*router.get("/contacts", protectRoute, getAllContacts);

router.get("/chats", protectRoute, getChatPartners);

router.get("/:id", protectRoute, getMessagesByUserId);

router.post("/send/:id", protectRoute, sendMessage);*/

export default router;