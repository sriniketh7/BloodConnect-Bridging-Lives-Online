import mongoose from "mongoose";

const PastRequestSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: { type: String, enum: ["Accepted", "Denied"], required: true },
  confirmstatus: {
    type: String,
    enum: ["Donated", "Yet to Donate"],
    default: "Yet to Donate",
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now }, // Timestamp for when request was moved
});

const PastRequest = mongoose.model("PastRequest", PastRequestSchema);
export default PastRequest;
