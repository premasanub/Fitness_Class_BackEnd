import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "trainer", "admin"],
      default: "user",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    age: {
  type: Number,
  default: null,
},

 gender: {
  type: String,
  default: "",
},

    height: {
  type: String,
  default: "",
},

weight: {
  type: String,
  default: "",
},

goal: {
  type: String,
  default: "",
},

    profileImage: {
  type: String,
  default: "",

},

qualification: {
  type: String,
  default: "",
},

specialization: {
  type: String,
  default: "",
},

experience: {
  type: Number,
  default: 0,
},

bio: {
  type: String,
  default: "",
},



availableSlots: {
  type: [
    {
      day: String,
      startTime: String,
      endTime: String,
    },
  ],
  default: [],
},

rating: {
  type: Number,
  default: 0,
},

totalReviews: {
  type: Number,
  default: 0,
},
availableDays: {
  type: [String],
  default: [],
},
meetingLink: {
  type: String,
  default: "",
},
isActive: {
  type: Boolean,
  default: true,
},

  },
  {
    timestamps: true,
  }
);

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;