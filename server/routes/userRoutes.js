import express from "express";
import { getUserById, loginUser, registerUser } from "../controllers/userController.js";
 import { getUserResumes, protect } from "../middlewares/authMiddleware.js";




const userRoute = express.Router();
userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);
userRoute.get('/data' , protect, getUserById)
userRoute.get('/resume',protect, getUserResumes)

export default userRoute