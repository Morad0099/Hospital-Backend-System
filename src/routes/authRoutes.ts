import express from "express";
import AuthHandler from "../controllers/authController";
import { loginSchema, signupSchema, validateRequestSchema } from "../../validations/authValidation";

const router = express.Router();

router.post(
  "/signup",
  signupSchema,        // Validation rules
  validateRequestSchema, // Error checking
  AuthHandler.signup   
);

router.post(
  "/login",
  loginSchema,         
  validateRequestSchema, 
  AuthHandler.login   
);

export default router;