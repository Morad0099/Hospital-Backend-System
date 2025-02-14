import { Response } from "express";
import { Reminder } from "../models/Reminder";
import { AuthRequest } from "../types/express";

// Get reminders for a patient
export const getReminders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(403).json({ message: "Unauthorized access" });
      return;
    }

    const { patientId } = req.params;

    if (req.user.role === "doctor") {
      const doctor = await Reminder.findOne({ patientId });
      if (!doctor) {
        res.status(403).json({ message: "Unauthorized access" });
        return;
      }
    } else if (req.user.role === "patient" && req.user.id !== patientId) {
      res.status(403).json({ message: "Unauthorized access" });
      return;
    }

    const reminders = await Reminder.find({ patientId });

    res.status(200).json({ reminders });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving reminders",
        error: (error as any).message,
      });
  }
};

// Patient checks in (marks reminder as completed)
export const checkInReminder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "patient") {
      res
        .status(403)
        .json({ message: "Only patients can check in for reminders" });
      return;
    }

    const { reminderId } = req.params;

    // Find reminder
    const reminder = await Reminder.findById(reminderId);
    if (!reminder) {
      res.status(404).json({ message: "Reminder not found" });
      return;
    }

    if (reminder.patientId.toString() !== req.user.id) {
      res
        .status(403)
        .json({ message: "You can only check-in for your own reminders" });
      return;
    }

    // Mark as checked-in
    reminder.checkedIn = true;
    await reminder.save();

    res
      .status(200)
      .json({ message: "Reminder checked-in successfully", reminder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking in", error: (error as any).message });
  }
};
