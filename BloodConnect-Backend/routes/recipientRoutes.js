import express from "express";
import { protect } from "../controllers/AuthController.js";
import { getRecipientDashboard } from "../controllers/recipientController.js";
import { saveHospitalDetails } from "../controllers/HospitalController.js";

const router = express.Router();

router.post("/recdashboard", protect, getRecipientDashboard);
router.post("/hospital", protect, saveHospitalDetails);
export default router;
