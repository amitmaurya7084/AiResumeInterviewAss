

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Method to compare passwords
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// ✅ Export properly
const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
