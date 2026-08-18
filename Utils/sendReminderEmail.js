import sendMail from "./mailer.js";

const sendReminderEmail = async ({
  email,
  userName,
  className,
  trainerName,
  date,
  time,
  meetingLink,
}) => {

  const subject =
    `🔔 Reminder: Your ${className} class starts soon`;

  const text = `
Hi ${userName},

Your fitness class starts in 30 minutes.

Class: ${className}
Trainer: ${trainerName}
Date: ${date}
Time: ${time}

Join Class:
${meetingLink}

Please join a few minutes early.

Thank you,
Fitness Platform Team
`;

  await sendMail(
    email,
    subject,
    text
  );
};

export default sendReminderEmail;