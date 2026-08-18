import express from "express";

import {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  uploadTrainerProfileImage,
  deleteTrainer,

  getTrainerDashboard,
  getTrainerBookings,
  getTrainerStudents,
  getTrainerReviews,

  getTrainerSchedule,
  addTrainerSchedule,
  deleteTrainerSchedule,
} from "../Controllers/trainerController.js";

import upload from "../Config/Multer.js";

const router = express.Router();


// =====================================================
// TRAINER DASHBOARD
// =====================================================

router.get(
  "/dashboard/:id",
  getTrainerDashboard
);


// =====================================================
// TRAINER BOOKINGS
// =====================================================

router.get(
  "/bookings/:id",
  getTrainerBookings
);


// =====================================================
// TRAINER STUDENTS
// =====================================================

router.get(
  "/students/:id",
  getTrainerStudents
);


// =====================================================
// TRAINER REVIEWS
// =====================================================

router.get(
  "/reviews/:id",
  getTrainerReviews
);


// =====================================================
// TRAINER SCHEDULE
// IMPORTANT: MUST COME BEFORE /:id
// =====================================================

router.get(
  "/schedule/:id",
  getTrainerSchedule
);

router.post(
  "/schedule/:id",
  addTrainerSchedule
);

router.delete(
  "/schedule/:trainerId/:scheduleId",
  deleteTrainerSchedule
);


// =====================================================
// ALL TRAINERS
// =====================================================

router.get(
  "/",
  getAllTrainers
);


// =====================================================
// CREATE TRAINER
// =====================================================

router.post(
  "/",
  createTrainer
);


// =====================================================
// TRAINER PROFILE IMAGE
// =====================================================

router.post(
  "/:id/profile-image",
  upload.single("profileImage"),
  uploadTrainerProfileImage
);


// =====================================================
// UPDATE TRAINER
// =====================================================

router.put(
  "/:id",
  updateTrainer
);


// =====================================================
// DELETE TRAINER
// =====================================================

router.delete(
  "/:id",
  deleteTrainer
);


// =====================================================
// GET TRAINER BY ID
// IMPORTANT: KEEP THIS LAST
// =====================================================

router.get(
  "/:id",
  getTrainerById
);


export default router;