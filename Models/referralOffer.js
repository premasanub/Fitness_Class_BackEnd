import mongoose from "mongoose";

const referralOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Refer & Earn",
    },

    description: {
      type: String,
      required: true,
      default:
        "Refer your friends and family and enjoy a special offer.",
    },

    discount: {
      type: Number,
      default: 10,
      min: 0,
    },

    emailSubject: {
      type: String,
      required: true,
      default: "Refer Your Friends & Family 🎁",
    },

    emailMessage: {
      type: String,
      required: true,
      default:
        "Invite your friends and family to join our fitness classes and enjoy a special offer!",
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    weeklyEmailEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReferralOffer =
  mongoose.models.ReferralOffer ||
  mongoose.model("ReferralOffer", referralOfferSchema);

export default ReferralOffer;