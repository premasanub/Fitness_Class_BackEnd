import mongoose from "mongoose";
import dotenv from "dotenv";
import startReminderJob from "../Jobs/reminderJob.js";

dotenv.config();

const connectDb= async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Mongodb connected successfully");

        startReminderJob();
    }
    catch(error){
     console.log(error);
    }
}


export default connectDb;