import mongoose, { Document, Schema } from "mongoose";

export interface IDoctorNote extends Document {
  doctorId: mongoose.Schema.Types.ObjectId;
  patientId: mongoose.Schema.Types.ObjectId;
  encryptedNote: string;
  checklist: string[]; // Immediate tasks
  plan: { task: string; repeat: string; duration: string }[]; // Scheduled tasks
  createdAt: Date;
}

const DoctorNoteSchema = new Schema<IDoctorNote>(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    encryptedNote: { type: String, required: true },
    checklist: [{ type: String, required: true }],
    plan: [
      {
        task: { type: String, required: true },
        repeat: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const DoctorNote = mongoose.model<IDoctorNote>(
  "DoctorNote",
  DoctorNoteSchema
);
