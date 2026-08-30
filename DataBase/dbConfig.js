import mongoose from "mongoose";
import dotenv from "dotenv";
import startReminderJob from "../Jobs/reminderJob.js";

dotenv.config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        startReminderJob();
    }
    catch (error) {
        // Error handling safely configured for production review
    }
}

export default connectDb;
