import { checkSchema, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validation schema for note submission
export const noteSchema = checkSchema({
  patientId: {
    notEmpty: {
      errorMessage: "Patient ID is required",
    },
    isMongoId: {
      errorMessage: "Invalid Patient ID format",
    },
  },
  note: {
    notEmpty: {
      errorMessage: "Note content is required",
    },
    isLength: {
      options: { min: 5 },
      errorMessage: "Note must be at least 5 characters",
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
