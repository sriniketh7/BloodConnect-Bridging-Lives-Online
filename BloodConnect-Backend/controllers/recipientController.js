// import axios from "axios";
// import { User } from "../models/User.js";
// import { Hospital } from "../models/Hospital.js"; // Import the Hospital model
// import dotenv from "dotenv";
// dotenv.config();

// // Blood compatibility mapping
// const bloodCompatibility = {
//   "o+": ["o+", "o-"],
//   "O-": ["O-"],
//   "A+": ["A+", "A-", "O+", "O-"],
//   "A-": ["A-", "O-"],
//   "B+": ["B+", "B-", "O+", "O-"],
//   "B-": ["B-", "O-"],
//   "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
//   "AB-": ["AB-", "A-", "B-", "O-"],
// };

// // Function to escape special characters for regex
// const escapeRegex = (string) => {
//   return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
// };

// export const getRecipientDashboard = async (req, res) => {
//   const { bloodGroup, search } = req.body;

//   try {
//     // Find the hospital associated with the recipient
//     const hospital = await Hospital.findOne({ userId: req.user.id });
//     if (!hospital) {
//       return res
//         .status(400)
//         .json({ message: "Recipient's hospital location not found." });
//     }

//     const [hospitalLng, hospitalLat] = hospital.hospitalAddress.coordinates;

//     let donors;

//     // If there is a search term, sanitize it and search
//     if (search?.trim()) {
//       const escapedSearch = escapeRegex(search); // Escape search term to make it regex-safe

//       donors = await User.find({
//         $and: [
//           { role: "Donor" },
//           {
//             $or: [
//               { name: { $regex: `^${escapedSearch}`, $options: "i" } },
//               { "location.address": { $regex: escapedSearch, $options: "i" } },
//               { bloodGroup: { $regex: `^${escapedSearch}`, $options: "i" } },
//             ],
//           },
//         ],
//       }).select("-password");
//     } else {
//       // If no search term, fetch compatible blood group donors
//       const compatibleBloodGroups = bloodCompatibility[bloodGroup] || [];
//       donors = await User.find({
//         role: "Donor",
//         bloodGroup: { $in: compatibleBloodGroups },
//       }).select("-password");

//       if (donors.length > 0) {
//         const donorLocations = donors.map(
//           (donor) =>
//             `${donor.location.coordinates[1]},${donor.location.coordinates[0]}`
//         );
//         const origin = `${hospitalLat},${hospitalLng}`;
//         const maxDestinations = 25;
//         const filteredDonors = [];

//         for (let i = 0; i < donorLocations.length; i += maxDestinations) {
//           const batch = donorLocations.slice(i, i + maxDestinations);
//           const response = await axios.get(
//             `https://maps.gomaps.pro/maps/api/distancematrix/json`,
//             {
//               params: {
//                 destinations: batch.join("|"),
//                 origins: origin,
//                 key: process.env.API_KEY,
//               },
//             }
//           );

//           const distances = response.data.rows[0]?.elements || [];
//           batch.forEach((_, batchIndex) => {
//             const distanceData = distances[batchIndex];
//             if (distanceData?.distance?.value <= 20000) {
//               filteredDonors.push(donors[i + batchIndex]);
//             }
//           });
//         }
//         donors = filteredDonors;
//       }
//     }

//     res.status(200).json({ success: true, donors });
//   } catch (error) {
//     console.error("Error fetching donors:", error);
//     res.status(500).json({ message: "Error fetching donor data." });
//   }
// };

import { getDonorsList } from "./getDonorsList.js";
import { Hospital } from "../models/Hospital.js";

export const getRecipientDashboard = async (req, res) => {
  const { bloodGroup, search } = req.body;

  try {
    const hospital = await Hospital.findOne({ userId: req.user.id });
    console.log(hospital);

    if (!hospital) {
      return res
        .status(400)
        .json({ message: "Recipient's hospital location not found." });
    }

    // Fetch the donor list using the new function
    const donors = await getDonorsList(bloodGroup, search, hospital);
    //console.log(donors);
    res.status(200).json({ success: true, donors, hospital });
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ message: "Error fetching donor data." });
  }
};
