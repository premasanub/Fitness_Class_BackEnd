// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();


//  const sendMail = async (to, subject, text) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//    tls: {
//      rejectUnauthorized: false
//    },
//     port: 465,
//     secure: true,
//     logger: true,
//     debug: true,
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_KEY
//     }
//   });

//   const mailData = {
//     from: process.env.PASS_MAIL,
//     to,
//     subject,
//     text,
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



import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Prefer IPv4
dns.setDefaultResultOrder("ipv4first");

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
    console.log("📧 Sending email to:", to);

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
    });

    console.log("✅ Mail sent successfully");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Mail sending failed:", error);
    throw error;
  }
};

export default sendMail;