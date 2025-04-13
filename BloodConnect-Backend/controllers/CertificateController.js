// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";
// import nodemailer from "nodemailer";

// export const sendCertificateEmail = async (
//   donorName,
//   donorEmail,
//   hospitalName,
//   donationDate
// ) => {
//   try {
//     const certPath = path.join(
//       "certificates",
//       `Certificate_${donorName.replace(/\s+/g, "_")}.pdf`
//     );

//     if (!fs.existsSync("certificates")) {
//       fs.mkdirSync("certificates");
//     }

//     // Create a PDF document
//     const doc = new PDFDocument({ size: "A4" });
//     const writeStream = fs.createWriteStream(certPath);
//     doc.pipe(writeStream);

//     // Add certificate content
//     doc
//       .fontSize(22)
//       .text("BloodConnect: Bridging Lives Online", { align: "center" });
//     doc.moveDown();
//     doc.fontSize(18).text(`Certificate of Appreciation`, { align: "center" });
//     doc.moveDown(2);
//     doc.fontSize(14).text(`This is to certify that`, { align: "center" });
//     doc.moveDown();
//     doc.fontSize(16).text(`${donorName}`, { align: "center", underline: true });
//     doc.moveDown();
//     doc
//       .fontSize(14)
//       .text(`has generously donated blood at`, { align: "center" });
//     doc.moveDown();
//     doc
//       .fontSize(16)
//       .text(`${hospitalName}`, { align: "center", underline: true });
//     doc.moveDown();
//     doc.fontSize(14).text(`on ${donationDate}`, { align: "center" });
//     doc.moveDown(3);
//     doc.fontSize(12).text(`Your selfless contribution helps save lives!`, {
//       align: "center",
//     });
//     doc.end();

//     // Wait for PDF to finish writing
//     await new Promise((resolve, reject) => {
//       writeStream.on("finish", resolve);
//       writeStream.on("error", reject);
//     });

//     // Send Email with certificate attached
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER, // Replace with your email
//         pass: process.env.EMAIL_PASSWORD, // Use an App Password for security
//       },
//     });

//     const mailOptions = {
//       from: {
//         name: "BloodConnect",
//         address: "process.env.EMAIL_USER",
//       },
//       to: donorEmail,
//       subject: "Blood Donation Certificate - BloodConnect",
//       text: `Dear ${donorName},\n\nThank you for your life-saving blood donation at ${hospitalName} on ${donationDate}. Please find your certificate attached.\n\nBest regards,\nBloodConnect Team`,
//       attachments: [
//         {
//           filename: `Certificate_${donorName.replace(/\s+/g, "_")}.pdf`,
//           path: certPath,
//         },
//       ],
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Certificate sent successfully to:", donorEmail);

//     // Optionally, delete the certificate file after sending
//     setTimeout(() => fs.unlinkSync(certPath), 30000); // Deletes after 30 sec
//   } catch (error) {
//     console.error("Error sending certificate:", error);
//   }
// };

import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const generateCertificateAndSendEmail = async (
  donorName,
  donorEmail,
  hospitalName,
  donationDate
) => {
  try {
    const width = 1500;
    const height = 850;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Load the certificate background image
    const backgroundImage = await loadImage(
      path.join("assets", "certificate_template.png")
    );
    ctx.drawImage(backgroundImage, 0, 0, width, height);

    // Set text styles
    ctx.fillStyle = "#000000"; // Text color
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";

    // Donor's name
    ctx.fillText(donorName, width / 2, 440);

    // Hospital name
    ctx.font = "bold 30px Arial";
    ctx.fillText(`Donated at: ${hospitalName}`, width / 2, 570);

    // Donation date
    ctx.fillText(`${donationDate}`, width / 2, 670);

    // Generate Certificate File Path
    const certPath = path.join(
      "certificates",
      `Certificate_${donorName.replace(/\s+/g, "_")}.png`
    );

    // Ensure the certificates directory exists
    if (!fs.existsSync("certificates")) {
      fs.mkdirSync("certificates");
    }

    // Save the certificate
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(certPath, buffer);

    console.log(`Certificate saved at: ${certPath}`);

    // Send the certificate via email
    await sendEmailWithCertificate(
      donorEmail,
      certPath,
      donorName,
      hospitalName,
      donationDate
    );
  } catch (error) {
    console.error("Error generating certificate:", error);
  }
};

// Function to send email with certificate attachment
const sendEmailWithCertificate = async (
  donorEmail,
  certPath,
  donorName,
  hospitalName,
  donationDate
) => {
  // console.log(process.env.EMAIL_USER);
  //console.log(process.env.EMAIL_PASSWORD);
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password or App Password
      },
    });

    const mailOptions = {
      from: {
        name: "BloodConnect:Bridging Lives Online",
        address: "process.env.EMAIL_USER",
      },
      to: donorEmail,
      subject: "Your Blood Donation Certificate - BloodConnect",
      text: `Dear ${donorName},\n\nThank you for your generous blood donation at ${hospitalName} on ${donationDate}. Please find your donation certificate attached.\n\nBest regards,\nBloodConnect Team`,
      attachments: [
        {
          filename: `Certificate_${donorName.replace(/\s+/g, "_")}.png`,
          path: certPath,
          contentType: "image/png",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Certificate sent successfully to: ${donorEmail}`);

    // Optionally, delete the certificate file after sending
    setTimeout(() => fs.unlinkSync(certPath), 60000); // Deletes after 60 sec
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
