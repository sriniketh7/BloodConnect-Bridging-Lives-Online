import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Already hashed in controller
    bloodGroup: { type: String, required: true },
    MobileNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\+\d{1,3}\d{10}$/.test(v); // Country code (1-3 digits) + 10-digit number
        },
        message:
          "Mobile number must be in the format +[country code][10-digit number]. Example: +919876543210",
      },
    },

    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"], // GeoJSON type must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // Array of numbers: [longitude, latitude]
        required: true,
      },
    },
    role: {
      type: String,
      enum: ["Donor", "Recipient", null],
      default: null,
    },
    lastDonationDate: { type: Date, default: null },
    isFirstVisit: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index location field for geospatial queries
userSchema.index({ location: "2dsphere" });

export const User = mongoose.model("User", userSchema);
