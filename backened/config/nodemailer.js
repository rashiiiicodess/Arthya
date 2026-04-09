import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
console.log("User:", process.env.SMTP_USER);
console.log("Pass:", process.env.SMTP_PASS);
  const transporter=nodemailer.createTransport({
        host:'smtp-relay.brevo.com',
        port: 587, // Standard for modern secure submission
    auth: {
        user: process.env.SMTP_USER, // Your Brevo email/login
        pass: process.env.SMTP_PASS  // Your Brevo SMTP Master Key
    }

  })
  export default transporter