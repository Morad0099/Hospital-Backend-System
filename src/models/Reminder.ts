import mongoose, { Document, Schema } from "mongoose";

export interface IReminder extends Document {
  patientId: mongoose.Schema.Types.ObjectId;
  task: string;
  repeat: string;
  duration: number;
  checkedIn: boolean;
  createdAt: Date;
}

enum RepeatEnum {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
}

const ReminderSchema = new Schema<IReminder>(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: { type: String, required: true },
    repeat: {
      type: String,
      enum: RepeatEnum,
      required: true,
    },
    duration: { type: Number, required: true }, // Duration in days
    checkedIn: { type: Boolean, default: false }, // Track if patient checked-in
  },
  { timestamps: true }
);

export const Reminder = mongoose.model<IReminder>("Reminder", ReminderSchema);
