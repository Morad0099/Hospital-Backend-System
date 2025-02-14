import { checkSchema, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validation schema for assigning a doctor
export const assignDoctorSchema = checkSchema({
    doctorId: {
        notEmpty: {
            errorMessage: "Doctor ID is required",
        },
        isMongoId: {
            errorMessage: "Invalid Doctor ID format",
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