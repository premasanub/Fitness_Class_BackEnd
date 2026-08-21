import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_KEY,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

const sendMail = async (to, subject, text) => {
  try {
    console.log("Sending email to:", to);

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
    });

    console.log("Mail sent successfully");

  } catch (error) {
    console.error("Mail sending error:", error);
    throw error;
  }
};

export default sendMail;