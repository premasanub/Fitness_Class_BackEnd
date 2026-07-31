import Booking from "../Models/Booking.js";
import Class from "../Models/Class.js";

// Create Booking
export const createBooking = async (req, res) => {
  try {
    const {
      user,
      classId,
      trainer,
      selectedSlot,
    } = req.body;

    const fitnessClass = await Class.findById(classId);

    if (!fitnessClass) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    if (fitnessClass.seats <= 0) {
      return res.status(400).json({
        message: "No seats available",
      });
    }

    const booking = await Booking.create({
      user,
      class: classId,
      trainer,
      selectedSlot,
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    });

    // Reduce available seats
    fitnessClass.seats -= 1;
    await fitnessClass.save();

    res.status(201).json({
      success: true,
      message: "Booking Successful",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Bookings
export const getMyBookings = async (req, res) => {
  try {

    const { userId } = req.params;

    const bookings = await Booking.find({ user: userId })
      .populate("class")
      .populate("trainer", "name email");

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Cancel Booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.bookingStatus = "Cancelled";
    await booking.save();

    // Increase available seats
    const fitnessClass = await Class.findById(booking.class);

    if (fitnessClass) {
      fitnessClass.seats += 1;
      await fitnessClass.save();
    }

    res.status(200).json({
      message: "Booking Cancelled Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};