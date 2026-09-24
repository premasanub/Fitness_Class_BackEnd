// // Create Booking
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