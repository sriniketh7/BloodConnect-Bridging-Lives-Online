import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User's ObjectId
      ref: "User", // Reference model name
      required: true,
    },
    hospitalid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalAdmin",
      required: true,
    },
    hospitalName: { type: String, required: true },
    hospitalAddress: {
      type: {
        type: String,
        enum: ["Point"], // GeoJSON type must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // Array: [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

// Index location field for geospatial queries
hospitalSchema.index({ hospitalAddress: "2dsphere" });

export const Hospital =
  mongoose.models.Hospital || mongoose.model("Hospital", hospitalSchema);
