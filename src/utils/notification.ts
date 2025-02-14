import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

// Nodemailer transport for emails
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false, // Set to true if using port 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * Send email reminder to patient
 */
export const sendEmailReminder = async (email: string, subject: string, message: string) => {
  try {
    const mailOptions = {
      from: SMTP_USER,
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Sent] Reminder sent to ${email}`);
  } catch (error) {
    console.error(`[Email Error] Failed to send email: ${error}`);
  }
};
