import { User } from "../models/User.js";
import PastRequest from "../models/PastRequest.js";
import { HospitalAdmin } from "../models/HsplAdmin.js";
import { Hospital } from "../models/Hospital.js";
import Request from "../models/Request.js";
import axios from "axios";

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    //console.log(req.user._id);
    const user = await User.findById(req.user._id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    let donationsCount = 0;
    let lastDonationDate = null;

    if (user.role === "Donor") {
      donationsCount = await PastRequest.countDocuments({
        donorId: req.user.id,
        confirmstatus: "Donated",
      });

      const lastDonation = await PastRequest.findOne({
        donorId: req.user.id,
        confirmstatus: "Donated",
      })
        .sort({ completedAt: -1 })
        .select("completedAt");

      lastDonationDate = lastDonation ? lastDonation.completedAt : null;
    }

    res.json({ ...user.toObject(), donationsCount, lastDonationDate });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, MobileNumber, location } = req.body;
    console.log(req.user._id);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, MobileNumber, location },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changeHospital = async (req, res) => {
  const { hospitalName } = req.body;

  console.log(hospitalName);

  if (!hospitalName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hspl = await HospitalAdmin.findOne({ hospitalName });
  const hsplid = hspl._id;

  try {
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

    const updatedHospital = await Hospital.findOneAndUpdate(
      { userId: req.user._id }, // Find hospital by userId
      {
        $set: {
          hospitalName,
          hospitalid: hsplid,
          hospitalAddress: {
            type: "Point",
            coordinates: [lng, lat],
          },
        },
      },
      { new: true } // Return the updated document
    );

    // const updatedRqst = await Request.findOneAndUpdate(
    //   {
    //     recipientId: req.user._id,
    //   },
    //   {
    //     $set: {
    //       hospitalId: hsplid,
    //     },
    //   },
    //   { new: true }
    // );

    if (!updatedHospital) {
      return res
        .status(404)
        .json({ message: "Hospital not found for the user" });
    }

    // if (!updatedRqst) {
    //   return res.status(404).json({ message: "not updated in the requests" });
    // }

    return res
      .status(200)
      .json({ message: "Hospital updated successfully", updatedHospital });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
