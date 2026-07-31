import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.PASS_MAIL,
//     pass: process.env.PASS_KEY,
//   },
// });

// const sendEmail = async (to, subject, text) => {
//   const mailOptions = {
//     from: process.env.PASS_MAIL,
//     to,
//     subject,
//     text,
//   };
//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully");
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// export default sendEmail;

 const sendMail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
   tls: {
     rejectUnauthorized: false
   },
    port: 465,
    secure: true,
    logger: true,
    debug: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_KEY
    }
  });

  const mailData = {
    from: process.env.PASS_MAIL,
    to,
    subject,
    text,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        reject(err);
      } else {
        console.log("Mail Send Successfully")
        resolve(info);
      }
    });
  });
};
export default sendMail;