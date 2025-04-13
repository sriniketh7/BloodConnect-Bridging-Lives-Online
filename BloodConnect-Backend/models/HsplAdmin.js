import mongoose from "mongoose";
const Schema = mongoose.Schema;

// HospitalAdmin schema
const hospitalAdminSchema = new Schema(
  {
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

// Create a model from the schema
export const HospitalAdmin = mongoose.model(
  "HospitalAdmin",
  hospitalAdminSchema
);
