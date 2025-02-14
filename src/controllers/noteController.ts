import { Response } from "express";
import { DoctorNote } from "../models/DoctorNote";
import { User } from "../models/User";
import { encryptNote, decryptNote } from "../utils/encryption";
import { processDoctorNote } from "../utils/llmProcessor";
import { AuthRequest } from "../types/express";
import { Reminder } from "../models/Reminder";

// Submit a doctor note & process with LLM
export const submitNote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "doctor") {
      res.status(403).json({ message: "Only doctors can submit notes" });
      return;
    }

    const { patientId, note } = req.body;

    // Check if patient exists
    const patient = await User.findOne({ _id: patientId, role: "patient" });
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    // Encrypt the note before saving
    const encryptedNote = encryptNote(note);

    // Process note with LLM for actionable steps
    const actionableSteps = await processDoctorNote(note);
    if (!actionableSteps) {
      res.status(500).json({ message: "Failed to process note with AI" });
      return;
    }

    // Remove previous reminders
    await Reminder.deleteMany({ patientId });

    // Schedule new reminders
    if (actionableSteps.plan) {
      for (const task of actionableSteps.plan) {
        await Reminder.create({
          patientId,
          task: task.task,
          repeat: task.repeat,
          duration: task.duration === "N/A" ? 1 : parseInt(task.duration, 10),
        });
      }
    }

    // Save note to database
    const newNote = new DoctorNote({
      doctorId: req.user.id,
      patientId,
      encryptedNote,
      checklist: actionableSteps.checklist,
      plan: actionableSteps.plan,
    });
    await newNote.save();

    res.status(201).json({
      message: "Note submitted successfully",
      actionableSteps,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error submitting note",
        error: (error as any).message,
      });
  }
};

// Retrieve doctor notes for a patient (decrypted)
export const getNotes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(403).json({ message: "Unauthorized access" });
      return;
    }

    const { patientId } = req.params;

    // Ensure requester is either the doctor or the patient
    if (req.user.role === "doctor") {
      const doctor = await User.findById(req.user.id);
      if (!doctor) {
        res.status(403).json({ message: "Unauthorized access" });
        return;
      }
    } else if (req.user.role === "patient" && req.user.id !== patientId) {
      res.status(403).json({ message: "Unauthorized access" });
      return;
    }

    const notes = await DoctorNote.find({ patientId });

    // Decrypt the notes before sending
    const decryptedNotes = notes.map((note) => ({
      ...note.toObject(),
      decryptedNote: decryptNote(note.encryptedNote),
    }));

    res.status(200).json({ notes: decryptedNotes });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving notes",
      error: (error as any).message,
    });
  }
};
