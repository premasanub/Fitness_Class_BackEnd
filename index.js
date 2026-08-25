import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./DataBase/dbConfig.js";
import authRoutes from "./Routes/authRoutes.js";
import trainerRoutes from "./Routes/trainerRoutes.js";
import classRoutes from "./Routes/classRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import bookingRoutes from "./Routes/bookingRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";
import feedbackRoutes from "./Routes/feedbackRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";

import referralRoutes from "./Routes/referralRoutes.js";

//dotenv config
dotenv.config();


//express initialization
const app=express();



//default middleware
app.use(express.json());
app.use(cors());



//Database connection
connectDb();

//default route
app.get("/",(req,res) =>{
    res.status(200).send({message:"welcome to Fitness Class backend"});
});


//port
const port=process.env.PORT || 5000;

//custom routes
app.use("/api/auth",authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin",adminRoutes);
app.use(
  "/api/referral",
  referralRoutes
);

app.listen(port, () => {
    console.log("Server Started");
});