import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  setUserRole,
  getUserProfile,
  protect,
} from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/protect", protect, (req, res) => {
  res
    .status(200)
    .json({ valid: true, message: "Token is valid", user: req.user });
});

router.put("/setrole", protect, setUserRole);
router.get("/profile", protect, getUserProfile);
router.post("/logout", logoutUser);

export default router;
