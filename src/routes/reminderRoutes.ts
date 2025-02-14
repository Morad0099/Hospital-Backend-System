import express from "express";
import { getReminders, checkInReminder } from "../controllers/reminderController";

const router = express.Router();

router.get("/patient/:patientId", getReminders);
router.put("/check-in/:reminderId", checkInReminder);

export default router;
