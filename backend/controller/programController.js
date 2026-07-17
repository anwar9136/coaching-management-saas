import Course from "../models/Course.js";
import Program from "../models/Program.js";

export const getAllPrograms = async (req, res) => {
    try {
        const programs = await Program.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: programs.length,
            data: programs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

export const createProgram = async (req, res) => {
    const { name, description } = req.body;
    try {
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide the Program name"
            });
        }

        // Case-insensitive duplicate check
        const existingProgram = await Program.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
        if (existingProgram) {
            return res.status(400).json({
                success: false,
                message: "A program with this name already exists"
            });
        }

        const program = await Program.create({ name: name.trim(), description: description?.trim() || '' });
        return res.status(201).json({
            success: true,
            message: "Program created successfully",
            data: program
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

export const updateProgram = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const program = await Program.findById(id);
        if (!program) {
            return res.status(404).json({
                success: false,
                message: "Program not found"
            });
        }

        // Only update fields that were actually provided
        const updates = {};
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({ success: false, message: "Program name cannot be empty" });
            }
            // Check for duplicate name (excluding current program)
            const duplicate = await Program.findOne({
                name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
                _id: { $ne: id }
            });
            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "A program with this name already exists"
                });
            }
            updates.name = name.trim();
        }
        if (description !== undefined) {
            updates.description = description.trim();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "No fields provided for update" });
        }

        const updatedProgram = await Program.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Program updated successfully",
            data: updatedProgram
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

export const getProgramById = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        if (!program) {
            return res.status(404).json({
                success: false,
                message: "Program not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: program
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

export const deleteProgram = async (req, res) => {
    const { id } = req.params;
    try {
        const program = await Program.findById(id);
        if (!program) {
            return res.status(404).json({
                success: false,
                message: "Program not found"
            });
        }

        const courseCount = await Course.countDocuments({ programId: id });
        if (courseCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete program. It has ${courseCount} course(s) assigned. Please delete those courses first.`
            });
        }

        await Program.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Program deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

export default {
    getAllPrograms,
    createProgram,
    updateProgram,
    getProgramById,
    deleteProgram
}