 import Resume from "../models/Resume.js";
import userModel from "../models/User.js";

import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decode.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};


// controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;

    // return user resumes
    const resumes = await Resume.find({userId})
    return res.status(200).json({resumes})
  } catch (error) {
    return res.status(400).json({message: error.message})
  }
}

export default protect