
import User from "../models/user.models.js";
import jwt from "jsonwebtoken"; // ✅ add this

// create token function
// NOTE: key must be "userId" (not "id") because middleware/isAuth.js reads
// `verifiedToken.userId` when decoding the token. Using "id" here caused
// req.userId to always be undefined -> User.findById(undefined) -> "User not found."
const getToken = (id) => {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Missing data" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ name, email });
        }

        const token = getToken(user._id);

        const isProd = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const payload = user.toObject ? user.toObject() : { ...user };
        return res.status(200).json({ ...payload, token });

    } catch (err) {
        console.error("Google auth error:", err);
        return res.status(500).json({ message: "Google auth error" });
    }
};

export const logout = async (req, res) => {
    try {
        const isProd = process.env.NODE_ENV === "production";
        res.clearCookie("token", { path: "/", sameSite: isProd ? "none" : "lax", secure: isProd, httpOnly: true });
        return res.status(200).json({ message: "logout successfully" });
    } catch (err) {
        return res.status(500).json({ message: `logout error ${err}` });
    }
};