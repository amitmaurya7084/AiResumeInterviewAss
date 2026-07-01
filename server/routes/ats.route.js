import express from "express";
import { upload } from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";
import { analyzeAts, getAtsHistory } from "../controllers/ats.controller.js";

const atsRouter = express.Router();

atsRouter.post("/analyze", isAuth, upload.single("resume"), analyzeAts);
atsRouter.get("/history", isAuth, getAtsHistory);

export default atsRouter;
