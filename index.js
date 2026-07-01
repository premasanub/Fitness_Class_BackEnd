import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./DataBase/dbConfig.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDb();

app.get("/", (req, res) => {
    res.send("welcome to backend");
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Server Started");
})