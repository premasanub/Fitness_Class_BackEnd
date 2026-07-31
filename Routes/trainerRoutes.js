import express from "express";
import {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from "../Controllers/trainerController.js";

const router = express.Router();

// Get all trainers
router.get("/", getAllTrainers);

// Get single trainer
router.get("/:id", getTrainerById);

// Create trainer (Admin)
router.post("/", createTrainer);

// Update trainer
router.put("/:id", updateTrainer);

// Delete trainer
router.delete("/:id", deleteTrainer);

export default router;