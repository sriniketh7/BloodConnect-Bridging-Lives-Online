import express from "express";
import {
  sendRequest,
  getRequests,
  respondToRequest,
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/send", sendRequest);

router.get("/getrequests", getRequests);

router.post("/respond", respondToRequest);

export default router;
