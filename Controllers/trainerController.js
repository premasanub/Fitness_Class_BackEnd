import User from "../Models/user.js";
import bcrypt from "bcrypt";

import Booking from "../Models/booking.js";
import Class from "../Models/class.js";
import Feedback from "../Models/feedback.js";

// =====================================================
// GET ALL TRAINERS
// =====================================================

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({
      role: "trainer",
    }).select("-password");

    res.status(200).json({
      success: true,
      trainers,
    });
  } catch (error) {
    console.log("Get All Trainers Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET TRAINER BY ID
// =====================================================

export const getTrainerById = async (req, res) => {
  try {
    const trainer = await User.findOne({
      _id: req.params.id,
      role: "trainer",
    }).select("-password");

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      success: true,
      trainer,
    });
  } catch (error) {
    console.log("Get Trainer By ID Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// CREATE TRAINER - ADMIN
// =====================================================

export const createTrainer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      qualification,
      specialization,
      experience,
      bio,
      meetingLink,
    } = req.body;

    // Check email
    const existingTrainer = await User.findOne({
      email,
    });

    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        message: "Trainer already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create trainer
    const trainer = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "trainer",
      phone: phone || "",
      address: address || "",
      qualification: qualification || "",
      specialization: specialization || "",
      experience: experience || 0,
      bio: bio || "",
      meetingLink: meetingLink || "",
      profileImage: "",
    });

    const trainerData = await User.findById(
      trainer._id
    ).select("-password");

    res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      trainer: trainerData,
    });
  } catch (error) {
    console.log("Create Trainer Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE TRAINER PROFILE
// =====================================================

export const updateTrainer = async (req, res) => {
  try {
    const trainer = await User.findOne({
      _id: req.params.id,
      role: "trainer",
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // BASIC DETAILS

    if (req.body.name !== undefined) {
      trainer.name = req.body.name;
    }

    if (req.body.email !== undefined) {
      trainer.email = req.body.email;
    }

    if (req.body.phone !== undefined) {
      trainer.phone = req.body.phone;
    }

    if (req.body.address !== undefined) {
      trainer.address = req.body.address;
    }

    if (req.body.age !== undefined) {
      trainer.age = req.body.age;
    }

    if (req.body.gender !== undefined) {
      trainer.gender = req.body.gender;
    }

    // TRAINER DETAILS

    if (req.body.qualification !== undefined) {
      trainer.qualification =
        req.body.qualification;
    }

    if (req.body.experience !== undefined) {
      trainer.experience =
        req.body.experience;
    }

    if (req.body.specialization !== undefined) {
      trainer.specialization =
        req.body.specialization;
    }

    if (req.body.bio !== undefined) {
      trainer.bio = req.body.bio;
    }

    if (req.body.meetingLink !== undefined) {
      trainer.meetingLink =
        req.body.meetingLink;
    }

    // AVAILABILITY

    if (req.body.availableDays !== undefined) {
      trainer.availableDays =
        req.body.availableDays;
    }

    if (req.body.availableSlots !== undefined) {
      trainer.availableSlots =
        req.body.availableSlots;
    }

    // FITNESS DETAILS

    if (req.body.height !== undefined) {
      trainer.height = req.body.height;
    }

    if (req.body.weight !== undefined) {
      trainer.weight = req.body.weight;
    }

    if (req.body.goal !== undefined) {
      trainer.goal = req.body.goal;
    }

    await trainer.save();

    const updatedTrainer =
      await User.findById(
        trainer._id
      ).select("-password");

    res.status(200).json({
      success: true,
      message: "Trainer profile updated successfully",
      trainer: updatedTrainer,
    });
  } catch (error) {
    console.log("Update Trainer Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPLOAD TRAINER PROFILE IMAGE
// =====================================================

export const uploadTrainerProfileImage = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const trainer = await User.findOne({
      _id: req.params.id,
      role: "trainer",
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    trainer.profileImage = req.file.path;

    await trainer.save();

    const updatedTrainer =
      await User.findById(
        trainer._id
      ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      trainer: updatedTrainer,
    });
  } catch (error) {
    console.log(
      "Trainer Image Upload Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE TRAINER
// =====================================================

export const deleteTrainer = async (req, res) => {
  try {
    const trainer =
      await User.findOneAndDelete({
        _id: req.params.id,
        role: "trainer",
      });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trainer deleted successfully",
    });
  } catch (error) {
    console.log(
      "Delete Trainer Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// TRAINER DASHBOARD
// =====================================================

export const getTrainerDashboard = async (req, res) => {
  try {
    const trainerId = req.params.id;

    // =========================================
    // CHECK TRAINER
    // =========================================

    const trainer = await User.findOne({
      _id: trainerId,
      role: "trainer",
    }).select("-password");

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // =========================================
    // GET TRAINER CLASSES
    // =========================================

    const classes = await Class.find({
      trainer: trainerId,
    }).sort({
      createdAt: -1,
    });

    // =========================================
    // GET TRAINER BOOKINGS
    // =========================================

    const bookings = await Booking.find({
      trainer: trainerId,
    })
      .populate(
        "user",
        "name email phone profileImage"
      )
      .populate(
        "class",
        "title category date time duration seats meetingLink"
      )
      .sort({
        createdAt: -1,
      });

    // =========================================
    // GET FEEDBACK
    // =========================================

    const feedbacks = await Feedback.find({
      trainer: trainerId,
    });

    // =========================================
    // UNIQUE STUDENTS
    // =========================================

    const studentIds = [
      ...new Set(
        bookings
          .map((booking) =>
            booking.user
              ? booking.user._id.toString()
              : null
          )
          .filter(Boolean)
      ),
    ];

    // =========================================
    // CALCULATE RATING
    // =========================================

    let rating = 0;

    if (feedbacks.length > 0) {
      const totalRating =
        feedbacks.reduce(
          (sum, feedback) =>
            sum +
            Number(
              feedback.trainerRating || 0
            ),
          0
        );

      rating = Number(
        (
          totalRating /
          feedbacks.length
        ).toFixed(1)
      );
    }

    // =========================================
    // TODAY DATE
    // =========================================

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    const todayString =
      `${year}-${month}-${day}`;

    // =========================================
    // TODAY'S BOOKINGS
    // =========================================

    const todayBookings =
      bookings.filter((booking) => {

        if (!booking.class?.date) {
          return false;
        }

        return (
          booking.class.date ===
          todayString
        );
      });

    // =========================================
    // GROUP TODAY'S BOOKINGS BY CLASS
    // =========================================

    const todayClassMap = new Map();

    todayBookings.forEach((booking) => {

      if (!booking.class) {
        return;
      }

      const classId =
        booking.class._id.toString();

      if (!todayClassMap.has(classId)) {

        todayClassMap.set(classId, {
          id: classId,

          className:
            booking.class.title,

          time:
            booking.selectedSlot ||
            booking.class.time,

          students: 0,

          status:
            booking.bookingStatus ||
            "Pending",

          date:
            booking.class.date,

          duration:
            booking.class.duration,
        });
      }

      const currentClass =
        todayClassMap.get(classId);

      currentClass.students += 1;

      // If any booking is confirmed,
      // show Confirmed
      if (
        booking.bookingStatus ===
        "Confirmed"
      ) {
        currentClass.status =
          "Confirmed";
      }

      // If booking completed,
      // show Completed
      if (
        booking.bookingStatus ===
        "Completed"
      ) {
        currentClass.status =
          "Completed";
      }
    });

    const todayClasses =
      Array.from(
        todayClassMap.values()
      );

    // =========================================
    // UPCOMING CLASSES
    // =========================================

    const upcomingClasses =
      classes
        .filter((item) => {

          if (!item.date) {
            return false;
          }

          return (
            item.date >=
            todayString
          );
        })
        .slice(0, 10)
        .map((item) => {

          const classBookings =
            bookings.filter(
              (booking) =>
                booking.class &&
                booking.class._id.toString() ===
                  item._id.toString()
            );

          return {
            id: item._id,

            className:
              item.title,

            date:
              item.date,

            time:
              item.time,

            students:
              classBookings.length,

            duration:
              item.duration,

            seats:
              item.seats,

            meetingLink:
              item.meetingLink,
          };
        });

    // =========================================
    // RESPONSE
    // =========================================

    res.status(200).json({
      success: true,

      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        profileImage:
          trainer.profileImage,
      },

      stats: {
        totalStudents:
          studentIds.length,

        totalClasses:
          classes.length,

        totalBookings:
          bookings.length,

        todaySessions:
          todayClasses.length,

        rating,
      },

      todayClasses,

      upcomingClasses,
    });

  } catch (error) {

    console.log(
      "Trainer Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// TRAINER BOOKINGS
// =====================================================

export const getTrainerBookings = async (
  req,
  res
) => {
  try {
    const trainerId = req.params.id;

    const bookings =
      await Booking.find({
        trainer: trainerId,
      })
        .populate(
          "user",
          "name email phone profileImage"
        )
        .populate(
          "class",
          "title category date time duration seats meetingLink"
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
      "Trainer Bookings Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// TRAINER STUDENTS
// =====================================================

export const getTrainerStudents = async (
  req,
  res
) => {
  try {
    const trainerId = req.params.id;

    const bookings =
      await Booking.find({
        trainer: trainerId,
      })
        .populate(
          "user",
          "name email phone profileImage"
        )
        .populate(
          "class",
          "title category date time duration"
        );

    // =========================================
    // REMOVE DUPLICATE STUDENTS
    // =========================================

    const studentsMap = new Map();

    bookings.forEach((booking) => {

      if (!booking.user) {
        return;
      }

      const studentId =
        booking.user._id.toString();

      if (!studentsMap.has(studentId)) {

        studentsMap.set(
          studentId,
          {
            _id:
              booking.user._id,

            name:
              booking.user.name,

            email:
              booking.user.email,

            phone:
              booking.user.phone,

            profileImage:
              booking.user.profileImage,

            totalClasses: 0,

            bookings: [],
          }
        );
      }

      const student =
        studentsMap.get(
          studentId
        );

      student.totalClasses += 1;

      student.bookings.push({
        bookingId:
          booking._id,

        class:
          booking.class,

        date:
          booking.class?.date || "",

        time:
          booking.selectedSlot ||
          booking.class?.time ||
          "",

        status:
          booking.bookingStatus ||
          "Pending",
      });
    });

    const students =
      Array.from(
        studentsMap.values()
      );

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });

  } catch (error) {

    console.log(
      "Trainer Students Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// TRAINER REVIEWS
// =====================================================

export const getTrainerReviews = async (
  req,
  res
) => {
  try {
    const trainerId = req.params.id;

    const reviews =
      await Feedback.find({
        trainer: trainerId,
      })
        .populate(
          "user",
          "name profileImage"
        )
        .populate(
          "class",
          "title category date time"
        )
        .sort({
          createdAt: -1,
        });

    let averageRating = 0;

    if (reviews.length > 0) {

      const totalRating =
        reviews.reduce(
          (sum, review) =>
            sum +
            Number(
              review.trainerRating || 0
            ),
          0
        );

      averageRating = Number(
        (
          totalRating /
          reviews.length
        ).toFixed(1)
      );
    }

    res.status(200).json({
      success: true,

      count:
        reviews.length,

      averageRating,

      reviews,
    });

  } catch (error) {

    console.log(
      "Trainer Reviews Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET TRAINER SCHEDULE
// =====================================================

export const getTrainerSchedule = async (
  req,
  res
) => {
  try {
    const trainerId = req.params.id;

    const schedules =
      await Class.find({
        trainer: trainerId,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: schedules.length,
      schedules,
    });

  } catch (error) {

    console.log(
      "Get Trainer Schedule Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// ADD TRAINER SCHEDULE
// =====================================================

export const addTrainerSchedule = async (
  req,
  res
) => {
  try {

    const trainerId =
      req.params.id;

    const {
      className,
      day,
      time,
      duration,
      seats,
    } = req.body;

    if (
      !className ||
      !day ||
      !time ||
      !duration ||
      !seats
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all schedule details",
      });
    }

    // =========================================
    // CHECK TRAINER
    // =========================================

    const trainer =
      await User.findOne({
        _id: trainerId,
        role: "trainer",
      });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // =========================================
    // CREATE CLASS
    // =========================================

    const newClass =
      await Class.create({

        title:
          className,

        category:
          "Fitness",

        description:
          `${className} fitness session`,

        trainer:
          trainerId,

        date:
          day,

        time,

        duration,

        price:
          0,

        seats:
          Number(seats),

        image:
          "",

        meetingLink:
          trainer.meetingLink || "",

        timeSlots:
          [time],
      });

    res.status(201).json({
      success: true,

      message:
        "Schedule added successfully",

      schedule:
        newClass,
    });

  } catch (error) {

    console.log(
      "Add Trainer Schedule Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE TRAINER SCHEDULE
// =====================================================

export const deleteTrainerSchedule = async (
  req,
  res
) => {
  try {

    const trainerId =
      req.params.trainerId;

    const scheduleId =
      req.params.scheduleId;

    const schedule =
      await Class.findOneAndDelete({
        _id: scheduleId,
        trainer: trainerId,
      });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Schedule deleted successfully",
    });

  } catch (error) {

    console.log(
      "Delete Trainer Schedule Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};