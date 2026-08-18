import Booking from "../Models/booking.js";
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

// Booking: change slot
export const changeSlot = async (req, res) => {
  try {

    const { selectedSlot } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { selectedSlot },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Time Slot Updated Successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id)
      .populate("class")
      .populate("trainer", "name email");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};