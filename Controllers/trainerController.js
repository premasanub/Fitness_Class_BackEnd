import User from "../models/user.js";
import bcrypt from "bcrypt";

// ===============================
// Get All Trainers
// ===============================
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" }).select("-password");

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

// ===============================
// Get Trainer By ID
// ===============================
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

// ===============================
// Create Trainer (Admin)
// ===============================
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

    const existingTrainer = await User.findOne({ email });

    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        message: "Trainer already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const trainer = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "trainer",
      phone,
      address,
      qualification,
      specialization,
      experience,
      bio,
      meetingLink,
    });

    res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      trainer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Trainer
// ===============================
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

    Object.assign(trainer, req.body);

    await trainer.save();

    const updatedTrainer = await User.findById(trainer._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      trainer: updatedTrainer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Trainer
// ===============================
export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await User.findOneAndDelete({
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