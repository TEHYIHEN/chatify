import {Resend} from "resend";
import { ENV } from "./env.js";

/*Same As
import dotenv from 'dotenv';
dotenv.config();
 */

export const resendClient = new Resend(ENV.RESEND_API_KEY);

export const sender = {
    
    email: ENV.EMAIL_FROM,
    name: ENV.EMAIL_FROM_NAME,
};

console.log("RESEND_API_KEY:", ENV.RESEND_API_KEY ? "loaded" : "Missing");
console.log("Email from:", sender.email);
console.log("Email FROM_Nmae:", sender.name);