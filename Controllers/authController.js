import User from "../Models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendMail from "../Utils/mailer.js";

dotenv.config();

//Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error Error in register user" });
  }
};

//Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();

   res.status(200).json({
  message: "Login successful",
  token,
  role: user.role,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
//Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //send email
    await sendMail(
      user.email,
      "Password Reset link",
      `You are receiving this email because you have requested to reset your password.
       Please click the following link to reset your password: https://fitness-class-front-end-wgzh.vercel.app/reset-password/${user._id}/${token}
       If you did not request this, please ignore this email.`
    );
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//Reset password
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { id, token } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    //verify token
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded){
      return res.status(401).json({message:"Invalid token"});
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
   
    //update the user password in db
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json(
      { message: "Password reset successfully", data: updatedUser }
    )
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};