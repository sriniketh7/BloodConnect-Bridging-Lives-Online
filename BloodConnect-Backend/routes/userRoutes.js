import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changeHospital,
} from "../controllers/userController.js";

import { getHospitals } from "../controllers/HspAuthController.js";

import { protect } from "../controllers/AuthController.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.get("/get-hospitals", getHospitals);
router.put("/update", protect, updateUserProfile);
router.put("/change-hospital", protect, changeHospital);

export default router;
