import cron from "node-cron";
import PastRequest from "../models/PastRequest.js";

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Delete requests older than 30 days
    await PastRequest.deleteMany({ completedAt: { $lt: thirtyDaysAgo } });

    console.log("Old past requests deleted.");
  } catch (error) {
    console.error("Error deleting old past requests:", error);
  }
});
