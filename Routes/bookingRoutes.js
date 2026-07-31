import express from "express";

import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../Controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);

router.get("/:userId", getMyBookings);

router.put("/cancel/:id", cancelBooking);

export default router;