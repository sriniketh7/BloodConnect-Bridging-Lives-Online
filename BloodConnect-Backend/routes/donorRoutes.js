import express from "express";
import { protect } from "../controllers/AuthController.js";
import { getDonorDashboard } from "../controllers/donorController.js";

const router = express.Router();

// Define the route for donor dashboard
router.get("/requests", protect, getDonorDashboard);

export default router;
