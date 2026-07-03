import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./DataBase/dbConfig.js";
import authRoutes from "./Routes/authRoutes.js";

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

app.listen(port, () => {
    console.log("Server Started");
});