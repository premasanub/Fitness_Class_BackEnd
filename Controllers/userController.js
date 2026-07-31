import User from "../Models/user.js";

// ===============================
// Get Logged-in User Profile
// ===============================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

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
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Logged-in User Profile
// ===============================
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, age, gender, profileImage, height,weight,goal,qualification,specialization,experience,bio,meetingLink,availableDays } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    
    user.profileImage = profileImage || user.profileImage;
    user.height =height || user.height;
    user.weight = weight || user.weight;
    user.goal = goal || user.goal;


user.qualification =qualification || user.qualification;
user.specialization = specialization || user.specialization;
user.experience = experience || user.experience;
user.bio = bio || user.bio;
user.meetingLink = meetingLink || user.meetingLink;

user.availableDays = availableDays || user.availableDays;   


  await user.save();

const updatedUser = await User.findById(user._id).select("-password");

res.status(200).json({
  success: true,
  message: "Profile updated successfully",
  user: updatedUser,
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};