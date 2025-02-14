import express from "express";
import { submitNote, getNotes } from "../controllers/noteController";
import { authenticateUser } from "../middlewares/authMiddleware";
import { noteSchema } from "../../validations/noteValidation";
import { validateRequestSchema } from "../../validations/authValidation";

const router = express.Router();

router.post(
  "/submit",
  noteSchema, // Validation rules
  validateRequestSchema, // Error checking
  submitNote
);

router.get("/patient/:patientId", getNotes);

export default router;
