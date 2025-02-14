import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import { authenticateUser } from "./middlewares/authMiddleware";
import noteRoutes from "./routes/noteRoutes";
import "./utils/reminderScheduler"; // Start the reminder scheduler
import reminderRoutes from "./routes/reminderRoutes";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", authenticateUser, doctorRoutes);
app.use("/api/notes", authenticateUser, noteRoutes);
app.use("/api/reminders", authenticateUser, reminderRoutes);

// Root route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Hospital Backend API is running..." });
});

// Load Swagger JSON
const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(__dirname, "docs/swagger.json"), "utf-8")
  );
  
  // Setup Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  console.log("Swagger Docs available at: http://localhost:5000/api-docs");

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
