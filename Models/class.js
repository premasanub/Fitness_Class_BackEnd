import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },




    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
  type: String,
  default: "",
},

    seats: {
      type: Number,
      default: 20,
    },


    meetingLink: {
    type: String,
    default: "",
  },
// ⭐ Trainer provided slots
    timeSlots: {
      type: [String],
      default: [],
    },

  },
  {
    timestamps: true,
  }
);

const Class = mongoose.models.Class || mongoose.model("Class", classSchema);
export default Class;