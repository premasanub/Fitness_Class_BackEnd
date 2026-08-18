import jwt from "jsonwebtoken";
import User from "../Models/user.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get User (without password)
      req.user = await User.findById(decoded._id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      next();
    } else {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};