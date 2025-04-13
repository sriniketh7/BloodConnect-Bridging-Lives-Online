import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model for the recipient
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model for the donor
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalAdmin",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Denied"],
      default: "Pending",
    },
    approve: {
      type: String,
      enum: ["Pending", "Approved", "Denied"],
      default: "Pending",
    },
    confirmstatus: {
      type: String,
      enum: ["Donated", "Yet to Donate"],
      default: "Yet to Donate",
    },
    message: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);

export default Request;
