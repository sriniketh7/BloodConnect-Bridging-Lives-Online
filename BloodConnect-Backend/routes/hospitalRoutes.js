import express from "express";
import {
  registerHospitalAdmin,
  loginHospitalAdmin,
  getHospitals,
} from "../controllers/HspAuthController.js";
import { protect } from "../controllers/AuthController.js";
import {
  getHospitalRequests,
  HandleRequests,
  HandleConfirmations,
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/register", registerHospitalAdmin);
router.post("/login", loginHospitalAdmin);
router.get("/get-hospitals", getHospitals);
router.get("/requests", getHospitalRequests);
router.post("/approve-request", HandleRequests);
router.post("/confirm", HandleConfirmations);

router.get("/protect", protect, (req, res) => {
  res
    .status(200)
    .json({ valid: true, message: "Token is valid", user: req.user });
});

export default router;
