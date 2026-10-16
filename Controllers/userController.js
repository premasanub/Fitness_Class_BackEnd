

import User from "../Models/user.js";
import Booking from "../Models/booking.js";
import Feedback from "../Models/feedback.js";


// =====================================================
// USER PROFILE VALIDATION
// =====================================================

const validateUserProfile = (data) => {
  const errors = {};

  // Full Name
  if (data.name !== undefined) {
    const name = String(data.name).trim();

    if (!name) {
      errors.name = "Full name is required";
    } else if (
      !/^[A-Za-z][A-Za-z .'-]{0,48}[A-Za-z.]$|^[A-Za-z]{2}$/.test(name)
    ) {
      errors.name =
        "Name must contain letters and valid spaces only";
    }
  }

  // Email
  if (data.email !== undefined) {
    const email = String(data.email).trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }
  }

  // Indian mobile number
  if (data.phone !== undefined) {
    const phone = String(data.phone).trim();

    if (!/^[6-9]\d{9}$/.test(phone)) {
      errors.phone =
        "Enter a valid 10-digit mobile number";
    }
  }

  // Age
  if (data.age !== undefined && data.age !== "") {
    const age = Number(data.age);

    if (!Number.isInteger(age) || age < 18 || age > 100) {
      errors.age = "Age must be between 18 and 100";
    }
  }

  // Gender
  if (
    data.gender !== undefined &&
    data.gender !== "" &&
    !["Male", "Female", "Other"].includes(data.gender)
  ) {
    errors.gender = "Please select a valid gender";
  }

  // Height
  if (data.height !== undefined && data.height !== "") {
    const height = Number(data.height);

    if (!Number.isFinite(height) || height < 50 || height > 300) {
      errors.height = "Height must be between 50 and 300 cm";
    }
  }

  // Weight
  if (data.weight !== undefined && data.weight !== "") {
    const weight = Number(data.weight);

    if (!Number.isFinite(weight) || weight < 10 || weight > 500) {
      errors.weight = "Weight must be between 10 and 500 kg";
    }
  }

  // Fitness Goal
  if (data.goal !== undefined && data.goal !== "") {
    const validGoals = [
      "Weight Loss",
      "Weight Gain",
      "Muscle Building",
      "General Fitness",
    ];

    if (!validGoals.includes(data.goal)) {
      errors.goal = "Please select a valid fitness goal";
    }
  }

  // Address
  if (data.address !== undefined) {
    const address = String(data.address).trim();

    if (address.length > 300) {
      errors.address = "Address cannot exceed 300 characters";
    }
  }

  return errors;
};

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
// UPDATE USER PROFILE WITH BACKEND VALIDATION
// =====================================================

export const updateProfile = async (req, res) => {
  try {
    const errors = validateUserProfile(req.body);

    // Return field-specific validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please correct the errors",
        errors,
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check duplicate email
    if (req.body.email !== undefined) {
      const email = String(req.body.email).trim().toLowerCase();

      const existingUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
          errors: {
            email: "This email is already in use",
          },
        });
      }

      user.email = email;
    }

    // Update allowed fields only
    const { name, phone, age, gender, height, weight, goal, address } =
      req.body;

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    if (age !== undefined) {
      user.age = age === "" ? undefined : Number(age);
    }

    if (gender !== undefined) user.gender = gender;

    if (height !== undefined) {
      user.height = height === "" ? undefined : Number(height);
    }

    if (weight !== undefined) {
      user.weight = weight === "" ? undefined : Number(weight);
    }

    if (goal !== undefined) user.goal = goal;
    if (address !== undefined) user.address = address.trim();

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};

      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }

      return res.status(400).json({
        success: false,
        message: "Please correct the errors",
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
        errors: {
          email: "This email is already in use",
        },
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
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
