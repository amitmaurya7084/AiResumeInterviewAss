import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

// Single shared DB connection (uses MONGODB_URI from .env)
import connectDB from "./config/db.js";

// --- Resume Builder Routes ---
import userRoute from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoute.js";
import aiRouter from "./routes/aiRoutes.js";
import atsRouter from "./routes/ats.route.js";

// --- Interview Routes ---
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(u => u.trim()) : []),
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Database
await connectDB();

app.get('/', (req, res)=> res.send("AiCareerPlatform server is live..."))

// --- Mount Resume Builder Routes ---
app.use('/api/users', userRoute) // from Resume
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)
app.use('/api/ats', atsRouter)

// --- Mount Interview Routes ---
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter) // from Interview
app.use("/api/interview", interviewRouter)

app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`)
})
