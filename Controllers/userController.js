import User from "../Models/user.js";
import Booking from "../Models/booking.js";
import Feedback from "../Models/feedback.js";
// ===============================
// Get Logged-in User Profile
// ===============================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Logged-in User Profile
// ===============================
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, age, gender, profileImage, height,weight,goal,qualification,specialization,experience,bio,meetingLink,availableDays } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    
    user.profileImage = profileImage || user.profileImage;
    user.height =height || user.height;
    user.weight = weight || user.weight;
    user.goal = goal || user.goal;


user.qualification =qualification || user.qualification;
user.specialization = specialization || user.specialization;
user.experience = experience || user.experience;
user.bio = bio || user.bio;
user.meetingLink = meetingLink || user.meetingLink;

user.availableDays = availableDays || user.availableDays;   


  await user.save();

const updatedUser = await User.findById(user._id).select("-password");

res.status(200).json({
  success: true,
  message: "Profile updated successfully",
  user: updatedUser,
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// // =====================================================
// // USER DASHBOARD
// // =====================================================

// export const getUserDashboard = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     // Check user
//     const user = await User.findOne({
//       _id: userId,
//       role: "user",
//     }).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Get all bookings of this user
//     const bookings = await Booking.find({
//       user: userId,
//     }).populate(
//       "class",
//       "title category description date time duration meetingLink"
//     );

//     // Total bookings
//     const totalBookings = bookings.length;

//     // Upcoming bookings
//     const upcomingBookings = bookings.filter(
//       (booking) =>
//         booking.bookingStatus === "Confirmed" ||
//         booking.bookingStatus === "Pending"
//     );

//     // Completed bookings
//     const completedBookings = bookings.filter(
//       (booking) =>
//         booking.bookingStatus === "Completed"
//     );

//     // Feedback given by user
//     const feedbacks = await Feedback.find({
//       user: userId,
//     });

//     const feedbackGiven = feedbacks.length;

//     res.status(200).json({
//       success: true,

//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         profileImage: user.profileImage,
//       },

//       stats: {
//         totalBookings,
//         upcoming: upcomingBookings.length,
//         completed: completedBookings.length,
//         feedbackGiven,
//       },

//       upcomingBookings,

//     });

//   } catch (error) {
//     console.log(
//       "User Dashboard Error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// =====================================================
// USER DASHBOARD
// =====================================================

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.params.id;

    // ==========================================
    // CHECK USER
    // ==========================================

    const user = await User.findOne({
      _id: userId,
      role: "user",
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // GET USER BOOKINGS
    // ==========================================

    const bookings = await Booking.find({
      user: userId,
    }).populate(
      "class",
      "title category description date time duration meetingLink"
    );

    const now = new Date();

    // ==========================================
    // CONVERT BOOKING DATE + TIME
    // ==========================================

    const getClassDateTime = (booking) => {
      if (!booking?.class?.date) {
        return null;
      }

      const date = booking.class.date;

      let time =
        booking.selectedSlot ||
        booking.class.time;

      if (!time) {
        return null;
      }

      // Example:
      // 10:00 AM - 11:00 AM
      // 5:00 PM - 6:00 PM
      // 16:30

      if (time.includes("-")) {
        time = time.split("-")[0].trim();
      }

      // ==========================================
      // CONVERT 12 HOUR FORMAT
      // ==========================================

      if (
        time.toUpperCase().includes("AM") ||
        time.toUpperCase().includes("PM")
      ) {
        const parts = time.trim().split(/\s+/);

        let clock = parts[0];
        const period = parts[1]?.toUpperCase();

        let [hours, minutes] =
          clock.split(":").map(Number);

        if (period === "PM" && hours !== 12) {
          hours += 12;
        }

        if (period === "AM" && hours === 12) {
          hours = 0;
        }

        time =
          String(hours).padStart(2, "0") +
          ":" +
          String(minutes || 0).padStart(2, "0");
      }

      const classDateTime = new Date(
        `${date}T${time}`
      );

      if (isNaN(classDateTime.getTime())) {
        return null;
      }

      return classDateTime;
    };

    // ==========================================
    // VALID BOOKINGS
    // ==========================================

    const validBookings = bookings.filter(
      (booking) =>
        booking.bookingStatus === "Confirmed" ||
        booking.bookingStatus === "Pending" ||
        booking.bookingStatus === "Completed"
    );

    // ==========================================
    // UPCOMING BOOKINGS
    // ==========================================

    const upcomingBookings = validBookings.filter(
      (booking) => {
        const classDateTime =
          getClassDateTime(booking);

        return (
          classDateTime &&
          classDateTime > now
        );
      }
    );

    // ==========================================
    // COMPLETED BOOKINGS
    // ==========================================

    const completedBookings = validBookings.filter(
      (booking) => {
        const classDateTime =
          getClassDateTime(booking);

        return (
          classDateTime &&
          classDateTime <= now
        );
      }
    );

    // ==========================================
    // FEEDBACK
    // ==========================================

    const feedbacks = await Feedback.find({
      user: userId,
    });

    const feedbackGiven = feedbacks.length;

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },

      stats: {
        totalBookings: validBookings.length,

        upcomingBookings:
          upcomingBookings.length,

        completedBookings:
          completedBookings.length,

        feedbackGiven,
      },

      upcomingBookings,

      completedBookings,
    });

  } catch (error) {
    console.log(
      "User Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};