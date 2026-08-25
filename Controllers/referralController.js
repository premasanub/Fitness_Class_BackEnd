import User from "../Models/user.js";
import ReferralOffer from "../Models/referralOffer.js";

// =====================================================
// GET REFERRAL DETAILS - USER
// =====================================================

export const getReferralDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email referralCode referralCount"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const offer = await ReferralOffer.findOne({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    const frontendUrl =
      process.env.FRONTEND_URL;

    const referralLink =
      `${frontendUrl}/register?ref=${user.referralCode}`;

    res.status(200).json({
      success: true,

      referral: {
        referralCode: user.referralCode,
        referralLink,
        referralCount: user.referralCount,
      },

      offer,
    });
  } catch (error) {
    console.log("Referral Details Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};