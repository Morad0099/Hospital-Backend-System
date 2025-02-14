import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import {
  assignDoctorSchema,
  validateRequestSchema,
} from "../../validations/doctorValidation";
import DoctorHandler from "../controllers/doctorController";
const router = express.Router();

router.post(
  "/assign",
  assignDoctorSchema, // Validation rules
  validateRequestSchema, // Error checking
  DoctorHandler.assignDoctor
);

router.get("/patients", DoctorHandler.getAssignedPatients);

export default router;
