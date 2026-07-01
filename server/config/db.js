import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("✅ Database connected successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err.message);
        });

        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI environment variable not set");
        }

        await mongoose.connect(mongoUri);
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;
