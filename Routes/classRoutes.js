import express from "express";

import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from "../Controllers/classController.js";

const router = express.Router();

router.get("/", getAllClasses);

router.get("/:id", getClassById);


router.post("/", createClass);

router.put("/:id", updateClass);

router.delete("/:id", deleteClass);

export default router;