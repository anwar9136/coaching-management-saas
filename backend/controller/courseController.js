import Course from "../models/Course.js";
import Lecture from "../models/lecture.js";
import Program from "../models/Program.js";

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('programId', 'name').sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const createCourse = async (req, res) => {
    const { programId, name, level, description, image } = req.body;
    try {
        if (!programId || !name || !level || !description) {
            return res.status(400).json({
                success: false,
                message: "Please provide programId, name, level and description"
            });
        }

        const program = await Program.findById(programId);
        if (!program) {
            return res.status(404).json({
                success: false,
                message: "Program not found"
            });
        }

        const existingCourse = await Course.findOne({ name: name.trim(), programId });
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: "A course with this name already exists in the program"
            });
        }

        const course = await Course.create({
            programId,
            name: name.trim(),
            level,
            description: description.trim(),
            image: image || null
        });

        const populatedCourse = await Course.findById(course._id).populate('programId', 'name');
        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: populatedCourse
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const lectureCount = await Lecture.countDocuments({ courseId: id });
        if (lectureCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete this course. It has ${lectureCount} lecture(s) assigned. Please delete those lectures first.`
            });
        }

        await Course.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id).populate('programId', 'name');
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const updateCourse = async (req, res) => {
    const { id } = req.params;
    // Whitelist allowed update fields — never pass raw req.body to Mongo
    const { name, level, description, image, programId } = req.body;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // If programId provided, validate it exists
        if (programId) {
            const program = await Program.findById(programId);
            if (!program) {
                return res.status(404).json({
                    success: false,
                    message: "Program not found"
                });
            }
        }

        // Build update object with only provided fields
        const updates = {};
        if (name !== undefined) updates.name = name.trim();
        if (level !== undefined) updates.level = level;
        if (description !== undefined) updates.description = description.trim();
        if (image !== undefined) updates.image = image || null;
        if (programId !== undefined) updates.programId = programId;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "No fields provided for update" });
        }

        // Duplicate name check in same program (after update)
        const finalProgramId = updates.programId || course.programId;
        const finalName = updates.name || course.name;

        const duplicate = await Course.findOne({
            name: finalName,
            programId: finalProgramId,
            _id: { $ne: id }
        });
        if (duplicate) {
            return res.status(400).json({
                success: false,
                message: "Another course with this name already exists in the program"
            });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        const populated = await Course.findById(updatedCourse._id).populate('programId', 'name');
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: populated
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export default { getAllCourses, createCourse, deleteCourse, getCourseById, updateCourse }
