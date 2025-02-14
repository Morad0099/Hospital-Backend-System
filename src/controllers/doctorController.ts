import { Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../types/express";

const DoctorHandler = {
    assignDoctor: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user || req.user.role !== "patient") {
                res.status(403).json({ message: "Only patients can select doctors" });
                return;
            }

            const { doctorId } = req.body;

            // Check if the selected doctor exists
            const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
            if (!doctor) {
                res.status(404).json({ message: "Doctor not found" });
                return;
            }

            // Assign the doctor to the patient
            await User.findByIdAndUpdate(req.user.id, { doctorId });

            res.status(200).json({ message: "Doctor assigned successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error assigning doctor", error: (error as any).message });
        }
    },

    getAssignedPatients: async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user || req.user.role !== "doctor") {
                res.status(403).json({ message: "Only doctors can view their patients" });
                return;
            }

            const patients = await User.find({ doctorId: req.user.id });

            res.status(200).json({ patients });
        } catch (error) {
            res.status(500).json({ message: "Error retrieving patients", error: (error as any).message });
        }
    }
};

export default DoctorHandler;