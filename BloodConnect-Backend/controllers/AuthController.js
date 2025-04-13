import { User } from "../models/User.js"; // Import your User model
import jwt from "jsonwebtoken"; // For JWT token generation
import bcrypt from "bcrypt"; // For hashing passwords
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, bloodGroup, MobileNumber, location } =
    req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ MobileNumber });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Geocode the location
    const geocodeUrl = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${process.env.API_KEY}`;
    const geocodeResponse = await axios.get(geocodeUrl);

    if (
      geocodeResponse.data.status !== "OK" ||
      !geocodeResponse.data.results.length
    ) {
      return res
        .status(400)
        .json({ message: "Invalid location. Please provide a valid address." });
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      bloodGroup,
      MobileNumber,
      address: location,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    // Respond with user details and token
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      MobileNumber: user.MobileNumber,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // Respond with user details and token
    res.status(200).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodGroup: user.bloodGroup,
        MobileNumber: user.MobileNumber,
        address: user.address,
        location: user.location,
        role: user.role,
        lastDonationdate: user.lastDonationDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email bloodGroup location"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Set User Role
export const setUserRole = async (req, res) => {
  const { role } = req.body;
  if (!["Donor", "Recipient"].includes(role)) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    const isFirstVisit = role === "Recipient" && user.isFirstVisit;
    await user.save();

    res.status(200).json({
      message: "Role updated successfully",
      role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodGroup: user.bloodGroup,
        address: user.address,
        location: user.location,
        role: user.role,
        lastDonationDate: user.lastDonationDate,
        isFirstVisit: user.isFirstVisit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware for JWT verification
export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    try {
      token = token.split(" ")[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) return res.status(401).json({ message: "User not found" });

      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }
};
