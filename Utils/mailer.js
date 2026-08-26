

// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const sendMail = async (to, subject, text) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_KEY,
//     },
//   });

//   await transporter.verify();

//   const mailData = {
//     from: process.env.MAIL_USER,
//     to: to,
//     subject: subject,
//     text: text,
//   };

//   await new Promise((resolve, reject) => {
//     transporter.sendMail(mailData, (err, info) => {
//       if (err) {
//         reject(err);
//       } else {
//         console.log("Mail Send Successfully")
//         resolve(info);
//       }
//     });
//   });
// };

// export default sendMail;



import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendMail = async (to, subject, text) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.MAIL_FROM_NAME,
        email: process.env.MAIL_FROM_EMAIL,
      },

      to: [
        {
          email: to,
        },
      ],

      subject: subject,
      textContent: text,
    });

    console.log("Mail Send Successfully");
    console.log("Brevo Message ID:", result.messageId);

    return result;
  } catch (error) {
    console.error(
      "Brevo Mail Error:",
      error?.response?.body || error?.message || error
    );

    throw error;
  }
};

export default sendMail;import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (to, subject, text) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        textContent: text,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );

    console.log("Mail sent:", response.data);
  } catch (error) {
    console.log("Brevo Error:", error.response?.status);
    console.log("Brevo Body:", error.response?.data);
  }
};

export default sendMail;