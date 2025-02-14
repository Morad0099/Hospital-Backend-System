// authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const AuthHandler = {
    signup: async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password, role } = req.body;

            // Check if the user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: "User already exists" });
                return;
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const newUser = new User({ name, email, password: hashedPassword, role });
            await newUser.save();

            // Generate JWT token
            const token = jwt.sign(
                { id: newUser._id, role: newUser.role },
                process.env.JWT_SECRET as string,
                { expiresIn: "7d" }
            );

            res.status(201).json({ message: "User registered successfully", token });
        } catch (error) {
            res.status(500).json({ message: "Error signing up", error });
        }
    },

    login: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({ message: "Invalid credentials" });
                return;
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: "7d" }
            );

            res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            res.status(500).json({ message: "Error logging in", error });
        }
    }
};

export default AuthHandler;