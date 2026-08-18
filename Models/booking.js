import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    selectedSlot: {
      type: String,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    bookingStatus: {
  type: String,
  enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
  default: "Pending",
},
    paymentId: {
  type: String,
},

orderId: {
  type: String,
},

signature: {
  type: String,
},

feedbackGiven: {
  type: Boolean,
  default: false,
},

reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;


