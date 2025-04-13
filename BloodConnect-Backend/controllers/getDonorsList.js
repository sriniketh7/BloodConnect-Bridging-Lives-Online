import { User } from "../models/User.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const bloodCompatibility = {
  "O+": ["O+", "O-"],
  "O-": ["O-"],
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
};

// Function to get donors list with 10-day filter
export const getDonorsList = async (bloodGroup, search, hospital) => {
  try {
    if (!hospital) {
      throw new Error("Hospital location not found.");
    }

    const [hospitalLng, hospitalLat] = hospital.hospitalAddress.coordinates;
    let donors;

    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    if (search?.trim()) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape regex characters

      donors = await User.find({
        $and: [
          { role: "Donor" },
          // Exclude recent donors
          {
            $or: [
              { name: { $regex: `^${escapedSearch}`, $options: "i" } },
              { "location.address": { $regex: escapedSearch, $options: "i" } },
              { bloodGroup: { $regex: `^${escapedSearch}`, $options: "i" } },
            ],
          },
        ],
      }).select("-password");
    } else {
      const compatibleBloodGroups = bloodCompatibility[bloodGroup] || [];
      donors = await User.find({
        role: "Donor",
        bloodGroup: { $in: compatibleBloodGroups },
      }).select("-password");

      if (donors.length > 0) {
        const donorLocations = donors.map(
          (donor) =>
            `${donor.location.coordinates[1]},${donor.location.coordinates[0]}`
        );

        const origin = `${hospitalLat},${hospitalLng}`;
        const maxDestinations = 25;
        const filteredDonors = [];

        for (let i = 0; i < donorLocations.length; i += maxDestinations) {
          const batch = donorLocations.slice(i, i + maxDestinations);
          const response = await axios.get(
            `https://maps.gomaps.pro/maps/api/distancematrix/json`,
            {
              params: {
                destinations: batch.join("|"),
                origins: origin,
                key: process.env.API_KEY,
              },
            }
          );

          const distances = response.data.rows[0]?.elements || [];
          batch.forEach((_, batchIndex) => {
            const distanceData = distances[batchIndex];
            if (distanceData?.distance?.value <= 20000) {
              filteredDonors.push(donors[i + batchIndex]);
            }
          });
        }
        donors = filteredDonors;
      }
    }
    //console.log(donors);
    return donors;
  } catch (error) {
    console.error("Error fetching donors:", error);
    throw error;
  }
};
