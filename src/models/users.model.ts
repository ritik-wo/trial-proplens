import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  sessionId: { type: String, required: false },
  org_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  projects: { type: [] },
  firstLogin: { type: Boolean, required: false, default: false },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  numberOfLogins: { type: Number, default: 0 },
  resetToken: { type: String, required: false },
  resetTokenExpires: { type: Date, required: false },
});

const User = mongoose?.models?.User || mongoose.model("User", userSchema);

export default User;
