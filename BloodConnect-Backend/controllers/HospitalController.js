import axios from "axios";
import { Hospital } from "../models/Hospital.js";
import { User } from "../models/User.js";
import { HospitalAdmin } from "../models/HsplAdmin.js";

export const saveHospitalDetails = async (req, res) => {
  const { hospitalName } = req.body;

  if (!hospitalName) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const hspl = await HospitalAdmin.findOne({ hospitalName });
  const hsplid = hspl._id;

  try {
    // Geocode the address
    const geocodeResponse = await axios.get(
      `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(
        hospitalName
      )}&key=${process.env.API_KEY}`
    );

    if (
      geocodeResponse.data.status !== "OK" ||
      !geocodeResponse.data.results.length
    ) {
      return res.status(400).json({ message: "Invalid address provided." });
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

    // Save hospital details to the database
    const hospital = await Hospital.create({
      userId: req.user.id,
      hospitalid: hsplid,
      hospitalName,
      hospitalAddress: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    // Update the user's `isFirstVisit` flag
    const user = await User.findById(req.user.id);
    if (user) {
      user.isFirstVisit = false;
      await user.save();
    }

    res.status(201).json({
      message: "Hospital details saved successfully!",
      hospital,
    });
  } catch (error) {
    console.error("Error saving hospital details:", error);

    if (error.response) {
      // Handle geocoding API errors
      return res.status(500).json({
        message: "Failed to fetch geocoding data.",
        error: error.response.data,
      });
    }

    res.status(500).json({ message: "Internal server error." });
  }
};
