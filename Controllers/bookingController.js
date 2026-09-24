import Booking from "../Models/booking.js";
import Class from "../Models/class.js";
import Feedback from "../Models/feedback.js";

// Create Booking
// export const createBooking = async (req, res) => {
//   try {
//     const {
//       user,
//       classId,
//       trainer,
//       selectedSlot,
//     } = req.body;

//     const fitnessClass = await Class.findById(classId);

//     if (!fitnessClass) {
//       return res.status(404).json({
//         message: "Class not found",
//       });
//     }

//     if (fitnessClass.seats <= 0) 
//       {
//       return res.status(400).json({
//         message: "No seats available",
//       });
//     }

//     const booking = await Booking.create({
//       user,
//       class: classId,
//       trainer,
//       selectedSlot,
//       paymentStatus: "Paid",
//       bookingStatus: "Confirmed",
//     });

//     // Reduce available seats
//     fitnessClass.seats -= 1;
//     await fitnessClass.save();

//     res.status(201).json({
//       success: true,
//       message: "Booking Successful",
//       booking,
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// Create Booking
export const createBooking = async (req, res) => {
  try {
    const {
      user,
      classId,
      trainer,
      selectedSlot,
    } = req.body;

    // 1. Check whether this user already booked this class
    const existingBooking = await Booking.findOne({
      user,
      class: classId,
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this class.",
      });
    }

    // 2. Find class
    const fitnessClass = await Class.findById(classId);

    if (!fitnessClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // 3. Check available seats
    if (Number(fitnessClass.seats) <= 0) {
      return res.status(400).json({
        success: false,
        message: "No seats available",
      });
    }

    // 4. Create booking
    const booking = await Booking.create({
      user,
      class: classId,
      trainer,
      selectedSlot,
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    });

    // 5. Reduce available seats
    fitnessClass.seats = Number(fitnessClass.seats) - 1;
    await fitnessClass.save();

    return res.status(201).json({
      success: true,
      message: "Booking Successful",
      booking,
    });

  } catch (error) {
    console.error("Create Booking Error:", error);

    res.status(500).json({
      success: false,
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



export const getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const totalBookings = await Booking.countDocuments({
      user: userId,
    });

    const upcomingBookings = await Booking.countDocuments({
      user: userId,
      bookingStatus: {
        $in: ["Pending", "Confirmed"],
      },
    });

    const completedBookings = await Booking.countDocuments({
      user: userId,
      bookingStatus: "Completed",
    });

    const feedbackGiven = await Feedback.countDocuments({
      user: userId,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        upcomingBookings,
        completedBookings,
        feedbackGiven,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
