import User from "../Models/user.js";
import Class from "../Models/class.js";
import Booking from "../Models/booking.js";
import Feedback from "../Models/feedback.js";


// =====================================================
// ADMIN DASHBOARD
// =====================================================

export const getAdminDashboard = async (req, res) => {
  try {

    // =================================================
    // TOTAL USERS
    // =================================================

    const totalUsers = await User.countDocuments({
      role: "user",
    });


    // =================================================
    // TOTAL TRAINERS
    // =================================================

    const totalTrainers = await User.countDocuments({
      role: "trainer",
    });


    // =================================================
    // TOTAL CLASSES
    // =================================================

    const totalClasses = await Class.countDocuments();


    // =================================================
    // TOTAL BOOKINGS
    // =================================================

    const totalBookings = await Booking.countDocuments();


    // =================================================
    // PAID BOOKINGS
    // =================================================

    const paidBookings = await Booking.countDocuments({
      paymentStatus: "Paid",
    });


    // =================================================
    // TOTAL FEEDBACK
    // =================================================

    const totalFeedback = await Feedback.countDocuments();


    // =================================================
    // RECENT BOOKINGS
    // =================================================

    const recentBookings = await Booking.find()
      .populate(
        "user",
        "name email profileImage"
      )
      .populate(
        "trainer",
        "name profileImage"
      )
      .populate(
        "class",
        "title category date time price"
      )
      .sort({
        createdAt: -1,
      })
      .limit(5);


    // =================================================
    // REVENUE
    // =================================================

    const revenueData = await Booking.find({
      paymentStatus: "Paid",
    }).populate(
      "class",
      "price"
    );


    let totalRevenue = 0;


    revenueData.forEach((booking) => {

      if (booking.class?.price) {
        totalRevenue += Number(
          booking.class.price
        );
      }

    });


    // =================================================
    // TODAY'S BOOKINGS
    // =================================================

    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const endOfDay = new Date(today);
    endOfDay.setHours(
      23,
      59,
      59,
      999
    );


    const todayBookings =
      await Booking.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });


    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({

      success: true,

      stats: {

        totalUsers,

        totalTrainers,

        totalClasses,

        totalBookings,

        paidBookings,

        totalFeedback,

        totalRevenue,

        todayBookings,

      },

      recentBookings,

    });


  } catch (error) {

    console.log(
      "Admin Dashboard Error:",
      error
    );

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};

// =====================================================
// GET ALL USERS - ADMIN
// =====================================================

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    console.log("Admin Users Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL TRAINERS - ADMIN
// =====================================================

export const getAdminTrainers = async (req, res) => {
  try {
    const trainers = await User.find({
      role: "trainer",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trainers.length,
      trainers,
    });

  } catch (error) {
    console.log("Admin Trainers Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL CLASSES - ADMIN
// =====================================================

export const getAdminClasses = async (req, res) => {
  try {

    const classes = await Class.find()
      .populate(
        "trainer",
        "name email profileImage specialization"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: classes.length,
      classes,
    });

  } catch (error) {

    console.log(
      "Admin Classes Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================================
// GET ALL BOOKINGS - ADMIN
// =====================================================

export const getAdminBookings = async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate(
        "user",
        "name email phone profileImage"
      )
      .populate(
        "trainer",
        "name email profileImage specialization"
      )
      .populate(
        "class",
        "title category date time duration price seats"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {

    console.log(
      "Admin Bookings Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};