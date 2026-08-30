

import User from "../Models/user.js";
import Booking from "../Models/booking.js";
import Feedback from "../Models/feedback.js";

// =====================================================
// GET LOGGED-IN USER PROFILE
// =====================================================

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE LOGGED-IN USER PROFILE
// =====================================================

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      age,
      gender,
      profileImage,
      height,
      weight,
      goal,
      address,
      qualification,
      specialization,
      experience,
      bio,
      meetingLink,
      availableDays,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Don't use || because 0 can be a valid value
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (profileImage !== undefined)
      user.profileImage = profileImage;

    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (goal !== undefined) user.goal = goal;
    if (address !== undefined) user.address = address;

    if (qualification !== undefined)
      user.qualification = qualification;

    if (specialization !== undefined)
      user.specialization = specialization;

    if (experience !== undefined)
      user.experience = experience;

    if (bio !== undefined)
      user.bio = bio;

    if (meetingLink !== undefined)
      user.meetingLink = meetingLink;

    if (availableDays !== undefined)
      user.availableDays = availableDays;

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// USER DASHBOARD
// =====================================================

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.params.id;

    // -------------------------------------------------
    // CHECK USER
    // -------------------------------------------------

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

    // -------------------------------------------------
    // GET BOOKINGS
    // -------------------------------------------------

    const bookings = await Booking.find({
      user: userId,
    })
      .populate(
        "class",
        "title category description date time duration meetingLink"
      )
      .populate(
        "trainer",
        "name email"
      );

    // -------------------------------------------------
    // CURRENT DATE
    // -------------------------------------------------

    const now = new Date();

    // -------------------------------------------------
    // CONVERT BOOKING DATE + TIME
    // -------------------------------------------------

    const getBookingDateTime = (booking) => {

      if (!booking?.class?.date) {
        return null;
      }

      let time =
        booking.selectedSlot ||
        booking.class.time;

      if (!time) {
        return null;
      }

      time = String(time).trim();

      
      if (time.includes("-")) {
        time = time
          .split("-")[0]
          .trim();
      }

      // -----------------------------------------------
      // Convert AM / PM
      // -----------------------------------------------

      const upperTime = time.toUpperCase();

      if (
        upperTime.includes("AM") ||
        upperTime.includes("PM")
      ) {

        const parts = upperTime.split(/\s+/);

        let clock = parts[0];
        const period = parts[1];

        let [hours, minutes] =
          clock.split(":").map(Number);

        minutes = minutes || 0;

        if (period === "PM" && hours !== 12) {
          hours += 12;
        }

        if (period === "AM" && hours === 12) {
          hours = 0;
        }

        time =
          String(hours).padStart(2, "0") +
          ":" +
          String(minutes).padStart(2, "0");
      }

      // -----------------------------------------------
      // Create Date
      // -----------------------------------------------

      const dateTime = new Date(
        `${booking.class.date}T${time}`
      );

      if (isNaN(dateTime.getTime())) {
        return null;
      }

      return dateTime;
    };

    // -------------------------------------------------
    // VALID BOOKINGS
    // -------------------------------------------------

    const validBookings = bookings.filter(
      (booking) => {

        // Cancelled bookings should not count
        if (
          booking.bookingStatus === "Cancelled"
        ) {
          return false;
        }

        // Paid / Confirmed / Completed only
        return (
          booking.paymentStatus === "Paid" ||
          booking.bookingStatus === "Confirmed" ||
          booking.bookingStatus === "Completed"
        );
      }
    );

    // -------------------------------------------------
    // UPCOMING
    // -------------------------------------------------

    const upcomingBookings =
      validBookings.filter((booking) => {

        const dateTime =
          getBookingDateTime(booking);

        return (
          dateTime &&
          dateTime > now
        );
      });

    // -------------------------------------------------
    // COMPLETED
    // -------------------------------------------------

    const completedBookings =
      validBookings.filter((booking) => {

        const dateTime =
          getBookingDateTime(booking);

        return (
          dateTime &&
          dateTime <= now
        );
      });

    // -------------------------------------------------
    // FEEDBACK
    // -------------------------------------------------

    const feedbacks = await Feedback.find({
      user: userId,
    });

    const feedbackGiven = feedbacks.length;

    // -------------------------------------------------
    // TOTAL
    // -------------------------------------------------

    const totalBookings =
      upcomingBookings.length +
      completedBookings.length;

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },

      stats: {
        totalBookings,
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
