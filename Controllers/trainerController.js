import User from "../Models/user.js";
import bcrypt from "bcrypt";

import Booking from "../Models/booking.js";
import Class from "../Models/class.js";
import Feedback from "../Models/feedback.js";

// =====================================================
// GET ALL TRAINERS
// =====================================================

export const getAllTrainers = async (req, res) => {
  try {

    const trainers = await User.find({
      role: "trainer",
    }).select("-password");

    res.status(200).json({
      success: true,
      trainers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET TRAINER BY ID
// =====================================================

export const getTrainerById = async (req, res) => {
  try {
    const trainer = await User.findOne({
      _id: req.params.id,
      role: "trainer",
    }).select("-password");

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      success: true,
      trainer,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// CREATE TRAINER - ADMIN
// =====================================================

export const createTrainer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      qualification,
      specialization,
      experience,
      bio,
      meetingLink,
    } = req.body;

    // Check email
    const existingTrainer = await User.findOne({
      email,
    });

    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        message: "Trainer already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create trainer
    const trainer = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "trainer",
      phone: phone || "",
      address: address || "",
      qualification: qualification || "",
      specialization: specialization || "",
      experience: experience || 0,
      bio: bio || "",
      meetingLink: meetingLink || "",
      profileImage: "",
    });

    const trainerData = await User.findById(
      trainer._id
    ).select("-password");

    res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      trainer: trainerData,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE TRAINER PROFILE
// =====================================================

export const updateTrainer = async (req, res) => {
  try {
    const trainer = await User.findOne({
      _id: req.params.id,
      role: "trainer",
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // BASIC DETAILS

    if (req.body.name !== undefined) {
      trainer.name = req.body.name;
    }

    if (req.body.email !== undefined) {
      trainer.email = req.body.email;
    }

    if (req.body.phone !== undefined) {
      trainer.phone = req.body.phone;
    }

    if (req.body.address !== undefined) {
      trainer.address = req.body.address;
    }

    if (req.body.age !== undefined) {
      trainer.age = req.body.age;
    }

    if (req.body.gender !== undefined) {
      trainer.gender = req.body.gender;
    }

    // TRAINER DETAILS

    if (req.body.qualification !== undefined) {
      trainer.qualification =
        req.body.qualification;
    }

    if (req.body.experience !== undefined) {
      trainer.experience =
        req.body.experience;
    }

    if (req.body.specialization !== undefined) {
      trainer.specialization =
        req.body.specialization;
    }

    if (req.body.bio !== undefined) {
      trainer.bio = req.body.bio;
    }

    if (req.body.meetingLink !== undefined) {
      trainer.meetingLink =
        req.body.meetingLink;
    }

    // AVAILABILITY

    if (req.body.availableDays !== undefined) {
      trainer.availableDays =
        req.body.availableDays;
    }

    if (req.body.availableSlots !== undefined) {
      trainer.availableSlots =
        req.body.availableSlots;
    }

    // FITNESS DETAILS

    if (req.body.height !== undefined) {
      trainer.height = req.body.height;
    }

    if (req.body.weight !== undefined) {
      trainer.weight = req.body.weight;
    }

    if (req.body.goal !== undefined) {
      trainer.goal = req.body.goal;
    }

    await trainer.save();

    const updatedTrainer =
      await User.findById(
        trainer._id
      ).select("-password");

    res.status(200).json({
      success: true,
      message: "Trainer profile updated successfully",
      trainer: updatedTrainer,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPLOAD TRAINER PROFILE IMAGE
// =====================================================

export const uploadTrainerProfileImage = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const trainer = await User.findOne({
      _id: req.params.id,
      role: "trainer",
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    trainer.profileImage = req.file.path;

    await trainer.save();

    const updatedTrainer =
      await User.findById(
        trainer._id
      ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      trainer: updatedTrainer,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE TRAINER
// =====================================================

export const deleteTrainer = async (req, res) => {
  try {
    const trainer =
      await User.findOneAndDelete({
        _id: req.params.id,
        role: "trainer",
      });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trainer deleted successfully",
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
