import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { getProfile, updateProfile ,getUserDashboard} from "../Controllers/userController.js";
import User from "../Models/user.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log("GET USER ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
// =====================================================
// USER DASHBOARD
// =====================================================

router.get(
  "/dashboard/:id",
  getUserDashboard
);


export default router;