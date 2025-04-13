import cron from "node-cron";
import Request from "../models/Request.js";

// Runs every hour
cron.schedule("0 * * * *", async () => {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Delete expired requests
    await Request.deleteMany({
      status: "Pending",
      createdAt: { $lt: twentyFourHoursAgo },
    });

    console.log("Expired requests deleted.");
  } catch (error) {
    console.error("Error deleting expired requests:", error);
  }
});
