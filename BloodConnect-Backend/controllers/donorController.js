import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import Request from "../models/Request.js";
import { Hospital } from "../models/Hospital.js";

export const getDonorDashboard = async (req, res) => {
  // Retrieve the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // Extract token after "Bearer"
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user details from the database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Ensure the user is a donor
    if (user.role !== "Donor") {
      return res.status(403).json({ message: "Access restricted to donors!" });
    }

    // Fetch pending recipient requests for the donor
    const recipientRequests = await Request.find({
      donorId: user._id,
      status: "Pending",
      approve: "Approved",
      confirmstatus: "Yet to Donate",
    })
      .populate({
        path: "recipientId", // Populate recipient details
        select: "name bloodGroup",
      })
      .select("recipientId createdAt");

    // Fetch hospital details for each recipient
    const formattedRequests = await Promise.all(
      recipientRequests.map(async (request) => {
        const hospital = await Hospital.findOne({
          userId: request.recipientId._id,
        }).select("hospitalName hospitalAddress");

        return {
          requestId: request._id,
          recipientName: request.recipientId.name,
          bloodGroup: request.recipientId.bloodGroup,
          hospitalName: hospital?.hospitalName || "N/A",
          hospitalLocation: hospital?.hospitalAddress || "N/A",
          requestDate: request.createdAt,
        };
      })
    );

    // Send the response with user and recipient request data
    res.status(200).json({
      name: user.name,
      email: user.email,
      bloodGroup: user.bloodGroup,
      requests: formattedRequests,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Session expired or invalid token!" });
  }
};
