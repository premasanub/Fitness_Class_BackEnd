import express from "express";

// import {
//   getAdminDashboard,
//   getAdminUsers,
//   getAdminTrainers,
//   getAdminClasses,
//   getAdminBookings,
// } from "../Controllers/adminController.js";

import {
  getAdminDashboard,
  getAdminUsers,
  getAdminTrainers,
  getAdminClasses,
  getAdminBookings,
  getReferralOffer,
  updateReferralOffer,
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


// =====================================================
// REFERRAL OFFER
// =====================================================

router.get(
  "/referral-offer",
  getReferralOffer
);

router.put(
  "/referral-offer",
  updateReferralOffer
);

export default router;