const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  cml_code: { type: String, required: true },
  product_name: { type: String, required: true },
  issue_type: { type: String, enum: ["expired", "not_found", "suspended"], required: true },
  complaint_text: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  location_label: String,
  submitted_at: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "reviewing", "resolved", "rejected"], default: "pending" },
  admin_notes: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  points_awarded: { type: Boolean, default: false }
});

module.exports = mongoose.model('Complaint', complaintSchema);
