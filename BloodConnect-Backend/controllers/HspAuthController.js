import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HospitalAdmin } from "../models/HsplAdmin.js";
import dotenv from "dotenv";

dotenv.config();
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register a new Hospital Admin
export const registerHospitalAdmin = async (req, res) => {
  const { hospitalName, registrationNumber, email, password } = req.body;
  //console.log(hospitalName, registrationNumber, email, password);

  try {
    // Validate input fields
    if (!hospitalName || !registrationNumber || !email || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide all required fields" });
    }

    // Check if the email is already registered
    const existingAdmin = await HospitalAdmin.findOne({ registrationNumber });
    if (existingAdmin) {
      return res.status(400).json({ msg: "Email is already registered" });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new HospitalAdmin instance
    const newHospitalAdmin = new HospitalAdmin({
      hospitalName,
      registrationNumber,
      email,
      password: hashedPassword,
    });

    // Save the hospital admin to the database
    await newHospitalAdmin.save();

    // Send success response
    res.status(201).json({
      id: newHospitalAdmin._id,
      hospitalName: newHospitalAdmin.hospitalName,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const loginHospitalAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide both email and password" });
    }

    // Check if the email exists in the database
    const hospitalAdmin = await HospitalAdmin.findOne({ email });
    if (!hospitalAdmin) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, hospitalAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create and sign a JWT token

    // Send success response with the token
    res.status(200).json({
      token: generateToken(hospitalAdmin._id),
      user: {
        hospitalId: hospitalAdmin._id,
        hospitalName: hospitalAdmin.hospitalName,
        email: hospitalAdmin.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getHospitals = async (req, res) => {
  try {
    const hospitals = await HospitalAdmin.find({}, "hospitalName");

    if (!hospitals || hospitals.length === 0) {
      return res.status(404).json({ message: "No hospitals found" });
    }
    //console.log(hospitals);
    res.status(200).json(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
