const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score: { type: Number, default: 0 },
  scans: { type: Number, default: 0 },
  violations_caught: { type: Number, default: 0 },
  complaints_filed: { type: Number, default: 0 },
  complaints_verified: { type: Number, default: 0 },
  badges: [String],
  missions_done: [String],
  pending_notifications: [
    {
      message: String,
      points: Number,
      seen: { type: Boolean, default: false },
      created_at: { type: Date, default: Date.now },
    },
  ],
  role: { type: String, default: "user" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
