import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import recipientRoutes from "./routes/recipientRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./controllers/cleanup.js";
import "./controllers/cleanuppastrequessts.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://192.168.43.223:8082", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/recipient", recipientRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/user", userRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
