
 import userModel from "../models/User.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Resume from "../models/Resume.js";
import validator from "validator";

const genrateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};



 


export const registerUser = async (req, res) => {
  
  try {
    const { name, email, password } = req.body;
  if(!name || !email || !password){
    return res.status(400).json({message: 'Missing required field'})
  }
    // checking user is already exist
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // create new user
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await userModel.create({
      name, email, password: hashedPassword
    })

    // return succes message
    const token = genrateToken(newUser._id);
    newUser.password = undefined;
    return res.status(201).json({ message: "User created successfully" , token,
      user:newUser
    });


  } catch (error) {
   
    return res.status(400).json({message: error.message})
  }
};


// controller for user login
export const loginUser = async (req, res) => {
  try {
    const {email, password } = req.body;
    // checking user is already exist
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid email and password" });
    }
    // check if password is correct
    if(!user.comparePassword(password)){
      return res.status(404).json({ success: false, message: "Invalid email and password" });
    }
    // return succes message
    const token = genrateToken(user._id);
    user.password = undefined;
    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {  
    return res.status(400).json({message: error.message})
  }
};
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    // check if user exists
    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // return user
    user.password = undefined;
    return res.status(200).json({
      user
    })

  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}



// controller for gettting user resumes 
 // GET /aoi/users/resumes

export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;
    // return user resumes
    const resumes = await Resume.find({ userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};