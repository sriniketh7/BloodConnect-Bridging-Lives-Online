import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendSMS = async (to, message) => {
  console.log(to);
  try {
    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });
    console.log(`SMS sent to ${to}`);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};
