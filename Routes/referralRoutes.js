import express from "express";
import {
  getReferralDetails,
} from "../Controllers/referralController.js";

import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getReferralDetails
);

export default router;