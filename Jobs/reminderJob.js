// import cron from "node-cron";
// import Booking from "../Models/booking.js";
// import sendReminderEmail from "../Utils/sendReminderEmail.js";

// const reminderJob = () => {

//   // Runs every minute
//   cron.schedule("* * * * *", async () => {

//     try {

//       const now = new Date();

//       console.log(
//         "⏰ Reminder job running:",
//         now.toLocaleString()
//       );

//       // Get confirmed + paid bookings
//       const bookings = await Booking.find({
//         bookingStatus: "Confirmed",
//         paymentStatus: "Paid",
//       })
//         .populate("user", "name email")
//         .populate("class")
//         .populate("trainer", "name");


//       for (const booking of bookings) {

//         if (!booking.class) {
//           continue;
//         }

//         if (!booking.selectedSlot) {
//           continue;
//         }


//         // ==========================================
//         // GET START TIME FROM SELECTED SLOT
//         // ==========================================

//         let startTimeString = booking.selectedSlot;

//         /*
//           Supported formats:

//           15:30
//           10:00
//           10:00 AM - 11:00 AM
//           15:30 - 16:30
//         */

//         if (booking.selectedSlot.includes(" - ")) {

//           startTimeString =
//             booking.selectedSlot.split(" - ")[0].trim();

//         }


//         // ==========================================
//         // CREATE CLASS START DATETIME
//         // ==========================================

//         const classDate = booking.class.date;

//         let classStart;


//         // 24-hour format
//         if (/^\d{2}:\d{2}$/.test(startTimeString)) {

//           classStart = new Date(
//             `${classDate}T${startTimeString}:00`
//           );

//         }

//         // 12-hour format
//         else {

//           classStart = parse12HourTime(
//             classDate,
//             startTimeString
//           );

//         }


//         // Invalid date/time
//         if (isNaN(classStart.getTime())) {

//           console.log(
//             "❌ Invalid class start time:",
//             booking.selectedSlot
//           );

//           continue;
//         }


//         // ==========================================
//         // CLASS END TIME
//         // ==========================================

//         const duration =
//           Number(booking.class.duration) || 60;

//         const classEnd = new Date(
//           classStart.getTime() +
//           duration * 60 * 1000
//         );


//         // ==========================================
//         // CLASS COMPLETED
//         // ==========================================

//         if (now >= classEnd) {

//           if (booking.bookingStatus !== "Completed") {

//             booking.bookingStatus = "Completed";

//             await booking.save();

//             console.log(
//               `✅ Class completed: ${booking.class.title}`
//             );
//           }

//           continue;
//         }


//         // ==========================================
//         // REMINDER ALREADY SENT
//         // ==========================================

//         if (booking.reminderSent) {
//           continue;
//         }


//         // ==========================================
//         // REMINDER TIME = 30 MIN BEFORE CLASS
//         // ==========================================

//         const reminderTime = new Date(
//           classStart.getTime() -
//           30 * 60 * 1000
//         );


//         const difference =
//           now.getTime() -
//           reminderTime.getTime();


//         // ==========================================
//         // SEND REMINDER
//         // ==========================================

//         if (
//           difference >= 0 &&
//           difference < 60 * 1000
//         ) {

//           if (!booking.user?.email) {

//             console.log(
//               "⚠️ User email not found"
//             );

//             continue;
//           }


//           console.log(
//             `📧 Sending reminder to ${booking.user.email}`
//           );


//           try {

//             await sendReminderEmail({

//               email: booking.user.email,

//               userName:
//                 booking.user.name || "User",

//               className:
//                 booking.class.title,

//               trainerName:
//                 booking.trainer?.name ||
//                 "Your Trainer",

//               date:
//                 booking.class.date,

//               time:
//                 booking.selectedSlot,

//               meetingLink:
//                 booking.class.meetingLink,

//             });


//             // Mark reminder as sent
//             booking.reminderSent = true;

//             await booking.save();


//             console.log(
//               `✅ Reminder sent successfully to ${booking.user.email}`
//             );

//           } catch (mailError) {

//             console.log(
//               "❌ Email sending failed:",
//               mailError.message
//             );

//           }
//         }

//       }

//     } catch (error) {

//       console.log(
//         "❌ Reminder Job Error:",
//         error.message
//       );

//     }

//   });


//   console.log("✅ Reminder job started");

// };


// // ==================================================
// // 12 HOUR TIME CONVERTER
// // ==================================================

// const parse12HourTime = (date, timeString) => {

//   try {

//     const parts = timeString.trim().split(" ");

//     if (parts.length !== 2) {
//       return new Date("Invalid");
//     }

//     const time = parts[0];
//     const modifier = parts[1].toUpperCase();

//     let [hours, minutes] =
//       time.split(":").map(Number);


//     if (
//       isNaN(hours) ||
//       isNaN(minutes)
//     ) {
//       return new Date("Invalid");
//     }


//     if (modifier === "PM" && hours !== 12) {
//       hours += 12;
//     }

//     if (modifier === "AM" && hours === 12) {
//       hours = 0;
//     }


//     const formattedHours =
//       String(hours).padStart(2, "0");

//     const formattedMinutes =
//       String(minutes).padStart(2, "0");


//     return new Date(
//       `${date}T${formattedHours}:${formattedMinutes}:00`
//     );

//   } catch (error) {

//     return new Date("Invalid");

//   }

// };


// export default reminderJob;



import cron from "node-cron";
import Booking from "../Models/booking.js";
import sendReminderEmail from "../Utils/sendReminderEmail.js";

const reminderJob = () => {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      console.log(
        "⏰ Reminder job running:",
        now.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })
      );

      // Get confirmed + paid bookings
      const bookings = await Booking.find({
        bookingStatus: "Confirmed",
        paymentStatus: "Paid",
      })
        .populate("user", "name email")
        .populate("class")
        .populate("trainer", "name");

      for (const booking of bookings) {
        try {
          if (!booking.class) {
            continue;
          }

          if (!booking.selectedSlot) {
            continue;
          }

          if (!booking.class.date) {
            console.log(
              "⚠️ Class date not found:",
              booking.class.title
            );
            continue;
          }

          // ==========================================
          // GET START TIME FROM SELECTED SLOT
          // ==========================================

          let startTimeString = String(
            booking.selectedSlot
          ).trim();

          /*
            Supported:

            15:30
            10:00
            7:00 AM
            7:00 AM - 8:00 AM
            15:30 - 16:30
          */

          if (startTimeString.includes(" - ")) {
            startTimeString = startTimeString
              .split(" - ")[0]
              .trim();
          }

          console.log(
            "🕐 Selected slot:",
            booking.selectedSlot,
            "→ Start:",
            startTimeString
          );

          // ==========================================
          // GET CLASS DATE
          // ==========================================

          const classDate = getDateOnly(
            booking.class.date
          );

          if (!classDate) {
            console.log(
              "❌ Invalid class date:",
              booking.class.date
            );
            continue;
          }

          // ==========================================
          // CREATE CLASS START DATETIME
          // ==========================================

          const classStart = parseClassDateTime(
            classDate,
            startTimeString
          );

          if (!classStart) {
            console.log(
              "❌ Invalid class start time:",
              booking.selectedSlot
            );

            console.log(
              "📅 Class date:",
              booking.class.date
            );

            continue;
          }

          console.log(
            "✅ Class start:",
            classStart.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
          );

          // ==========================================
          // CLASS END TIME
          // ==========================================

          const duration =
            Number(booking.class.duration) || 60;

          const classEnd = new Date(
            classStart.getTime() +
              duration * 60 * 1000
          );

          // ==========================================
          // CLASS COMPLETED
          // ==========================================

          if (now >= classEnd) {
            if (
              booking.bookingStatus !== "Completed"
            ) {
              booking.bookingStatus = "Completed";

              await booking.save();

              console.log(
                `✅ Class completed: ${booking.class.title}`
              );
            }

            continue;
          }

          // ==========================================
          // REMINDER ALREADY SENT
          // ==========================================

          if (booking.reminderSent) {
            continue;
          }

          // ==========================================
          // REMINDER = 30 MIN BEFORE CLASS
          // ==========================================

          const reminderTime = new Date(
            classStart.getTime() -
              30 * 60 * 1000
          );

          const difference =
            now.getTime() -
            reminderTime.getTime();

          // ==========================================
          // SEND REMINDER
          // ==========================================

          if (
            difference >= 0 &&
            difference < 60 * 1000
          ) {
            if (!booking.user?.email) {
              console.log(
                "⚠️ User email not found"
              );

              continue;
            }

            console.log(
              `📧 Sending reminder to ${booking.user.email}`
            );

            try {
              await sendReminderEmail({
                email: booking.user.email,

                userName:
                  booking.user.name || "User",

                className:
                  booking.class.title,

                trainerName:
                  booking.trainer?.name ||
                  "Your Trainer",

                date:
                  booking.class.date,

                time:
                  booking.selectedSlot,

                meetingLink:
                  booking.class.meetingLink,
              });

              // Mark reminder as sent
              booking.reminderSent = true;

              await booking.save();

              console.log(
                `✅ Reminder sent successfully to ${booking.user.email}`
              );
            } catch (mailError) {
              console.log(
                "❌ Email sending failed:",
                mailError.message
              );
            }
          }
        } catch (bookingError) {
          console.log(
            "❌ Booking reminder processing error:",
            bookingError.message
          );
        }
      }
    } catch (error) {
      console.log(
        "❌ Reminder Job Error:",
        error.message
      );
    }
  });

  console.log("✅ Reminder job started");
};

// ==================================================
// GET DATE ONLY
// ==================================================

const getDateOnly = (dateValue) => {
  try {
    // MongoDB Date object
    if (dateValue instanceof Date) {
      if (isNaN(dateValue.getTime())) {
        return null;
      }

      const year = dateValue.getFullYear();
      const month = String(
        dateValue.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        dateValue.getDate()
      ).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    const value = String(dateValue).trim();

    // YYYY-MM-DD
    if (
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      return value;
    }

    // Try normal Date conversion
    const parsedDate = new Date(value);

    if (isNaN(parsedDate.getTime())) {
      return null;
    }

    const year = parsedDate.getFullYear();

    const month = String(
      parsedDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      parsedDate.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    return null;
  }
};

// ==================================================
// PARSE CLASS DATE + TIME
// ==================================================

const parseClassDateTime = (
  date,
  timeString
) => {
  try {
    const value = String(
      timeString
    )
      .trim()
      .toUpperCase();

    // ==========================================
    // 24 HOUR FORMAT
    // ==========================================

    if (
      /^\d{1,2}:\d{2}$/.test(value)
    ) {
      let [hours, minutes] =
        value.split(":").map(Number);

      if (
        hours > 23 ||
        minutes > 59
      ) {
        return null;
      }

      const formattedHours =
        String(hours).padStart(2, "0");

      const formattedMinutes =
        String(minutes).padStart(2, "0");

      const result = new Date(
        `${date}T${formattedHours}:${formattedMinutes}:00`
      );

      return isNaN(result.getTime())
        ? null
        : result;
    }

    // ==========================================
    // 12 HOUR FORMAT
    // Example: 7:00 AM
    // ==========================================

    const match = value.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
    );

    if (!match) {
      return null;
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const modifier = match[3];

    if (
      hours < 1 ||
      hours > 12 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null;
    }

    if (
      modifier === "PM" &&
      hours !== 12
    ) {
      hours += 12;
    }

    if (
      modifier === "AM" &&
      hours === 12
    ) {
      hours = 0;
    }

    const formattedHours =
      String(hours).padStart(2, "0");

    const formattedMinutes =
      String(minutes).padStart(2, "0");

    const result = new Date(
      `${date}T${formattedHours}:${formattedMinutes}:00`
    );

    return isNaN(result.getTime())
      ? null
      : result;
  } catch (error) {
    return null;
  }
};

export default reminderJob;