import express from "express";

import {
  getAdminDashboard,
  getAdminUsers,
  getAdminTrainers,
  getAdminClasses,
  getAdminBookings,
} from "../Controllers/adminController.js";

const router = express.Router();


// =====================================================
// DASHBOARD
// =====================================================

router.get(
  "/dashboard",
  getAdminDashboard
);


// =====================================================
// USERS
// =====================================================

router.get(
  "/users",
  getAdminUsers
);


// =====================================================
// TRAINERS
// =====================================================

router.get(
  "/trainers",
  getAdminTrainers
);


// =====================================================
// CLASSES
// =====================================================

router.get(
  "/classes",
  getAdminClasses
);


// =====================================================
// BOOKINGS
// =====================================================

router.get(
  "/bookings",
  getAdminBookings
);


export default router;