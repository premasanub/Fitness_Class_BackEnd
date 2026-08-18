import Feedback from "../Models/feedback.js";
import Booking from "../Models/booking.js";

export const createFeedback = async (req, res) => {
  try {
    const {
      booking,
      classRating,
      trainerRating,
      comment,
    } = req.body;

    // 1. Check booking
    const existingBooking = await Booking.findById(booking)
      .populate("user")
      .populate("class")
      .populate("trainer");

    if (!existingBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // 2. Only completed class can give feedback
    if (existingBooking.bookingStatus !== "Completed") {
      return res.status(400).json({
        message: "Feedback available only after class completion",
      });
    }

    // 3. Check duplicate feedback
    const alreadyGiven = await Feedback.findOne({
      booking: booking,
    });

    if (alreadyGiven) {
      return res.status(400).json({
        message: "Feedback already submitted",
      });
    }

    // 4. Create feedback
    const feedback = await Feedback.create({
      user: existingBooking.user._id,
      booking: existingBooking._id,
      class: existingBooking.class._id,
      trainer: existingBooking.trainer._id,
      classRating,
      trainerRating,
      comment,
    });

    // 5. Update booking
    existingBooking.feedbackGiven = true;

    await existingBooking.save();

    // 6. Response
    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });

  } catch (error) {
    console.log("CREATE FEEDBACK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};