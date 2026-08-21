import express from "express";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  changeSlot,
   getUserDashboard,
} from "../Controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);


router.get("/user/:userId", getMyBookings);

router.get("/:id", getBookingById);
router.put("/change-slot/:id", changeSlot);
router.get("/dashboard/:userId", getUserDashboard);

export default router;