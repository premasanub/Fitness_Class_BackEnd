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

dotenv.config();

const sendMail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_KEY,
    },
  });

  await transporter.verify();

  const mailData = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  const info = await transporter.sendMail(mailData);

  console.log("Mail sent successfully:", info.messageId);

  return info;
};

export default sendMail;