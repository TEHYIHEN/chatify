import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplate.js";
import nodemailer from "nodemailer";
import "dotenv/config";

export const sendWelcomeEmail = async (email,name,clientURL) =>{

  try{
    const {data,error} = await resendClient.emails.send({
        
        from:`${sender.name} <${sender.email}>`,
        to: email,
        subject:"Welcome to ChatTeh!",
        html: createWelcomeEmailTemplate(name,clientURL)
    });

    if(error){
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }

    console.log("Welcome Email sent successfully", data);
  }catch (err){

   console.error("Failed to send welcome email:", err);
   throw err;
}
};


/*export const sendWelcomeEmail = async (email, name, clientURL) => {
  try {

    console.log("SMTP username:", process.env.RESEND_SMTP_USERNAME);
    console.log("SMTP password exists:", !!process.env.RESEND_SMTP_PASSWORD);
    console.log("Email from:", `"${sender.name}" <${sender.email}>`);

    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true, // TLS
      auth: {
        user: process.env.RESEND_SMTP_USERNAME,
        pass: process.env.RESEND_SMTP_PASSWORD
      }
    });

    await transporter.verify();
    console.log("SMTP connection is ready");

    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Welcome to ChatTeh!",
      html: createWelcomeEmailTemplate(name, clientURL)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome Email sent successfully:", info.messageId);
  } catch (error) {
    // Log the full error
    console.error("Full SMTP error:", error);
    throw error; // Re-throw the original error for more detail
  }
};
*/




