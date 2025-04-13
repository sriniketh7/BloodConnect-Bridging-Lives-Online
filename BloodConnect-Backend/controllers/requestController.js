// import Request from "../models/Request.js";
// import { User } from "../models/User.js";
// import twilio from "twilio"; // For sending SMS (use your Twilio credentials)

// const sendSMS = async (recipientPhone, message) => {
//   const client = twilio("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN");
//   try {
//     await client.messages.create({
//       body: message,
//       from: "+1XXXXXXXXXX", // Your Twilio phone number
//       to: recipientPhone,
//     });
//   } catch (error) {
//     console.error("Error sending SMS:", error);
//   }
// };

// export const sendRequest = async (req, res) => {
//   const { donorId } = req.body;
//   const recipientId = req.user._id;
//   console.log(recipientId); // Get recipient's ID from the logged-in user
//   try {
//     const newRequest = await Request.create({
//       recipientId,
//       donorId,
//       status: "Pending",
//     });

//     // Send an SMS to the donor with recipient's info
//     const recipient = await User.findById(recipientId);
//     const donor = await User.findById(donorId);
//     const message = `You have a new donation request from ${recipient.name} (${recipient.bloodGroup}). Check your dashboard to respond.`;
//     await sendSMS(donor.phone, message); // Assuming the donor has a `phone` field

//     res.status(201).json({ success: true, request: newRequest });
//   } catch (error) {
//     console.error("Error creating request:", error);
//     res.status(500).json({ message: "Error creating request." });
//   }
// };

// export const getRequests = async (req, res) => {
//   try {
//     const requests = await Request.find({
//       donorId: req.user._id,
//       status: "Pending",
//     })
//       .populate("recipientId", "name bloodGroup")
//       .populate("donorId", "name bloodGroup");
//     res.status(200).json({ success: true, requests });
//   } catch (error) {
//     console.error("Error fetching requests:", error);
//     res.status(500).json({ message: "Error fetching requests." });
//   }
// };

// export const respondToRequest = async (req, res) => {
//   const { requestId, action } = req.body; // action: 'accept' or 'deny'
//   try {
//     const request = await Request.findById(requestId);
//     if (!request) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     if (action === "accept") {
//       request.status = "Accepted";

//       // Update lastDonationDate for the donor
//       const donor = await User.findById(request.donorId);
//       donor.lastDonationDate = new Date();
//       await donor.save();

//       // Send SMS to recipient
//       const recipient = await User.findById(request.recipientId);
//       const message = `Your donation request to ${donor.name} (${donor.bloodGroup}) has been accepted!`;
//       await sendSMS(recipient.phone, message);
//     } else if (action === "deny") {
//       request.status = "Denied";
//     }

//     await request.save();
//     res.status(200).json({ success: true, request });
//   } catch (error) {
//     console.error("Error responding to request:", error);
//     res.status(500).json({ message: "Error responding to request." });
//   }
// };

import Request from "../models/Request.js";
import { User } from "../models/User.js";
import PastRequest from "../models/PastRequest.js";
import { generateCertificateAndSendEmail } from "./CertificateController.js";
import { sendSMS } from "../twilioapi/sms.js";
import { Hospital } from "../models/hospital.js";

export const sendRequest = async (req, res) => {
  const { donorId, recipientId, hospitalId, message } = req.body;

  //const recipientId = req.user.id;
  //console.log(hospitalId);

  if (!donorId || !recipientId || !hospitalId) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const newRequest = await Request.create({
      recipientId,
      donorId,
      hospitalId,
      status: "Pending",
      approve: "Pending",
      message,
    });

    // Fetch recipient and donor for potential future SMS integration
    const recipient = await User.findById(recipientId);
    const donor = await User.findById(donorId);

    // Temporarily disable SMS functionality
    //console.log(`New request created from ${recipient.name} to ${donor.name}`);

    res.status(201).json({ success: true, request: newRequest });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Error creating request." });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      donorId: req.user._id,
      status: "Pending",
    })
      .populate("recipientId", "name bloodGroup")
      .populate("donorId", "name bloodGroup");

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Error fetching requests." });
  }
};

export const respondToRequest = async (req, res) => {
  const { requestId, action } = req.body; // action: 'accept' or 'deny'

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (action === "accept") {
      request.status = "Accepted";

      // Update lastDonationDate for the donor
      const donor = await User.findById(request.donorId);
      donor.lastDonationDate = new Date();
      await donor.save();

      // Temporarily disable SMS functionality
      const recipient = await User.findById(request.recipientId);

      const hospital = await Hospital.findOne({ userId: request.recipientId });

      const recMessage = request.message ? `\nMessage: ${request.message}` : "";

      console.log(recMessage);

      const recipientMessage = `BloodConnect Alert! 🚨\n
      Donor Details:\n
      Name: ${donor.name} ${donor.MobileNumber}\n
      Location: ${donor.address}\n
      Blood Group: ${donor.bloodGroup}`;

      await sendSMS(recipient.MobileNumber, recipientMessage);

      const donorMessage = `BloodConnect Alert! 🚨\n
       Recipient Details:\n
      Name: ${recipient.name}\n
       Mobile: ${recipient.MobileNumber}\n
       Hospital: ${hospital.hospitalName}-${recMessage}\n`;

      await sendSMS(donor.MobileNumber, donorMessage);

      console.log(`Request accepted. Inform ${recipient.name}.`);
    } else if (action === "deny") {
      request.status = "Denied";
      const msg = `BloodConnect Alert! 🚨\n
      sorry the donor is not willing to accept the request`;
      await sendSMS(recipient.MobileNumber, msg);
    }

    await request.save();

    await PastRequest.create({
      requestId,
      recipientId: request.recipientId,
      donorId: request.donorId,
      status: request.status,
      createdAt: request.createdAt,
    });
    // await Request.findByIdAndDelete(requestId);
    res.status(200).json({ success: true, request });
  } catch (error) {
    console.error("Error responding to request:", error);
    res.status(500).json({ message: "Error responding to request." });
  }
};

export const getHospitalRequests = async (req, res) => {
  try {
    const { hospitalId } = req.query;
    //console.log(hospitalId);

    // Fetch requests and populate the required fields
    const requests = await Request.find({
      hospitalId,
      confirmstatus: "Yet to Donate",
    })
      .populate("recipientId", "name bloodGroup") // Populate recipient details
      .populate("donorId", "name bloodGroup") // Populate donor details
      .sort({ createdAt: -1 });

    // Extract the necessary information for frontend
    const formattedRequests = requests.map((request) => ({
      id: request._id,
      recipientName: request.recipientId.name,
      recipientBloodGroup: request.recipientId.bloodGroup,
      donorName: request.donorId.name,
      donorBloodGroup: request.donorId.bloodGroup,
      date: request.createdAt, // or any other date field you are using
    }));

    res.status(200).json({ success: true, requests: formattedRequests });
  } catch (error) {
    console.error("Error fetching hospital requests:", error);
    res.status(500).json({ message: "Error fetching requests." });
  }
};

export const HandleRequests = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    console.log(status);
    const token = req.headers.authorization.split(" ")[1];

    if (!requestId || !status || !["Approved", "Denied"].includes(status)) {
      return res.status(400).json({ message: "Invalid request or status" });
    }
    const request = await Request.findByIdAndUpdate(
      requestId,
      { approve: status }, // Update the 'approve' field instead of 'status'
      { new: true } // Return the updated document
    );
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({
      success: true,
      message: `Request has been ${status}`,
      request,
    });
  } catch (error) {
    console.error("Error updating request approval status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const HandleConfirmations = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    //console.log(requestId);

    // Find the request by ID
    const request = await Request.findById(requestId)
      .populate("donorId", "name email")
      .populate("hospitalId", "hospitalName");

    console.log(request);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    //console.log(request.confirmstatus);
    // Check if the request is approved and accepted
    if (
      request.approve === "Approved" &&
      request.status === "Accepted" &&
      request.confirmstatus === "Yet to Donate"
    ) {
      // Update request status to "donated"
      request.confirmstatus = "Donated";
      await request.save();

      const pastrequest = await PastRequest.findOne({ requestId });
      if (!pastrequest) {
        console.log("hi");
        return res.status(404).json({ message: "Request not found" });
      }
      pastrequest.confirmstatus = "Donated";
      await pastrequest.save();

      const donorName = request.donorId.name;
      const donorEmail = request.donorId.email;
      const hospitalName = request.hospitalId.hospitalName;

      console.log(donorName, donorEmail, hospitalName);

      await generateCertificateAndSendEmail(
        donorName,
        donorEmail,
        hospitalName,
        new Date().toISOString().split("T")[0]
      );

      await Request.findByIdAndDelete(requestId);
      return res
        .status(200)
        .json({ message: "Donation confirmed successfully", request });
    } else {
      return res.status(400).json({
        message:
          "Request must be approved and accepted before confirming donation",
      });
    }
  } catch (error) {
    console.error("Error in HandleConfirmations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
