import { Reminder } from "../models/Reminder";
import { User } from "../models/User";
import { sendEmailReminder } from "./notification";
import cron from "node-cron";

// Function to send reminders via email
const sendReminder = async () => {
  const reminders = await Reminder.find().populate("patientId");

  for (const reminder of reminders) {
    const patient = await User.findById(reminder.patientId);
    if (!patient || reminder.checkedIn) continue; // Skip if checked-in

    const message = `Reminder: ${reminder.task}. Repeat: ${reminder.repeat}. Duration: ${reminder.duration} days left.`;

    // Send email if patient has an email
    if (patient.email) {
      await sendEmailReminder(patient.email, "Medical Reminder", message);
    }

    console.log(`[Reminder] Email sent to ${patient.email}: ${message}`);
  }
};

// Schedule the reminder job to run every morning at 8 AM
cron.schedule("0 8 * * *", () => {
  console.log("[Reminder Scheduler] Running daily at 8 AM...");
  sendReminder();
});
