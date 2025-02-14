import { checkSchema, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validation schema for signup
export const signupSchema = checkSchema({
  name: {
    notEmpty: {
      errorMessage: "Name is required",
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "Name should be at least 2 characters",
    },
  },
  email: {
    isEmail: {
      errorMessage: "Invalid email format",
    },
    normalizeEmail: true,
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: "Password should be at least 6 characters",
    },
  },
  role: {
    optional: true,
    isIn: {
      options: [["doctor", "patient"]],
      errorMessage: "Role must be either 'doctor' or 'patient'",
    },
  },
});

// Validation schema for login
export const loginSchema = checkSchema({
  email: {
    isEmail: {
      errorMessage: "Invalid email format",
    },
    normalizeEmail: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
});

// Validation error handler middleware
export const validateRequestSchema = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
