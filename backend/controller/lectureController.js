import Lecture from "../models/lecture.js";
import Instructor from "../models/Instructor.js";
import mongoose from "mongoose";

// Convert "HH:MM" time string to total minutes for comparison
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Check if two time ranges overlap: [newStart, newEnd) vs [existStart, existEnd)
const hasTimeOverlap = (newStart, newEnd, existStart, existEnd) => {
    return newStart < existEnd && newEnd > existStart;
};

// Build a date range query for a given date string to match all lectures on that day
// regardless of how the date was stored (midnight UTC vs local)
const buildDateRangeQuery = (dateStr) => {
    const start = new Date(dateStr);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(dateStr);
    end.setUTCHours(23, 59, 59, 999);
    return { $gte: start, $lte: end };
};

export const getAllLecture = async (req, res) => {
    try {
        const lectures = await Lecture.find()
            .populate('courseId', 'name level')
            .populate({ path: 'instructorId', populate: { path: 'userId', select: 'name email' } })
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: lectures.length,
            data: lectures
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

export const createLecture = async (req, res) => {
    try {
        const { title, date, courseId, instructorId, startTime, endTime } = req.body;

        if (!title || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Please provide title and courseId"
            });
        }

        if (date) {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                return res.status(400).json({ success: false, message: "Cannot create a lecture on a past date." });
            }
        }

        // If instructor is being assigned, enforce date + time + conflict check
        if (instructorId) {
            // Validate instructor exists
            if (!mongoose.Types.ObjectId.isValid(instructorId)) {
                return res.status(400).json({ success: false, message: "Invalid instructor ID" });
            }
            const instructor = await Instructor.findById(instructorId);
            if (!instructor) {
                return res.status(404).json({ success: false, message: "Instructor not found" });
            }

            // Date and time are required when assigning an instructor
            if (!date || !startTime || !endTime) {
                return res.status(400).json({
                    success: false,
                    message: "Date, start time, and end time are required when assigning an instructor"
                });
            }

            const newStart = timeToMinutes(startTime);
            const newEnd = timeToMinutes(endTime);

            if (newStart >= newEnd) {
                return res.status(400).json({
                    success: false,
                    message: "End time must be after start time"
                });
            }

            // Fetch instructor's existing lectures on the same day using date range
            const existingLectures = await Lecture.find({
                instructorId,
                date: buildDateRangeQuery(date),
                startTime: { $exists: true, $ne: null },
                endTime: { $exists: true, $ne: null }
            });

            for (const lect of existingLectures) {
                if (!lect.startTime || !lect.endTime) continue;
                const existStart = timeToMinutes(lect.startTime);
                const existEnd = timeToMinutes(lect.endTime);

                if (hasTimeOverlap(newStart, newEnd, existStart, existEnd)) {
                    return res.status(400).json({
                        success: false,
                        message: `Time conflict: instructor already has a lecture from ${lect.startTime} to ${lect.endTime} on this date`
                    });
                }
            }
        }

        const lecture = await Lecture.create({
            title: title.trim(),
            date: date || null,
            startTime: startTime || null,
            endTime: endTime || null,
            courseId,
            instructorId: instructorId || null,
            status: instructorId ? 'Scheduled' : 'Pending'
        });

        const populatedLecture = await Lecture.findById(lecture._id)
            .populate('courseId', 'name level')
            .populate({ path: 'instructorId', populate: { path: 'userId', select: 'name email' } });

        res.status(201).json({ success: true, data: populatedLecture });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const getLectureById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid lecture ID" });
        }

        const lecture = await Lecture.findById(id)
            .populate('courseId', 'name level')
            .populate({ path: 'instructorId', populate: { path: 'userId', select: 'name email' } });

        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }
        res.status(200).json({ success: true, data: lecture });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const updateLecture = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid lecture ID" });
        }

        const lecture = await Lecture.findById(id);
        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        // Extract only whitelisted fields from body
        const { title, date, startTime, endTime, instructorId, status } = req.body;

        // Build update object with only provided fields
        const updates = {};
        if (title !== undefined) updates.title = title.trim();
        if (date !== undefined) updates.date = date || null;
        if (startTime !== undefined) updates.startTime = startTime || null;
        if (endTime !== undefined) updates.endTime = endTime || null;
        if (status !== undefined) updates.status = status;

        // Handle instructor assignment / reassignment
        // Determine the effective instructor after update
        const effectiveInstructorId = instructorId !== undefined
            ? (instructorId || null)
            : lecture.instructorId;

        if (instructorId !== undefined) {
            updates.instructorId = instructorId || null;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "No fields provided for update" });
        }

        // If an instructor is (or remains) assigned after this update, validate time conflicts
        if (effectiveInstructorId) {
            // Validate instructor exists
            if (!mongoose.Types.ObjectId.isValid(String(effectiveInstructorId))) {
                return res.status(400).json({ success: false, message: "Invalid instructor ID" });
            }
            const instructor = await Instructor.findById(effectiveInstructorId);
            if (!instructor) {
                return res.status(404).json({ success: false, message: "Instructor not found" });
            }

            // Effective date and times after update
            const effectiveDate = updates.date !== undefined ? updates.date : lecture.date;
            const effectiveStart = updates.startTime !== undefined ? updates.startTime : lecture.startTime;
            const effectiveEnd = updates.endTime !== undefined ? updates.endTime : lecture.endTime;

            // Only run conflict check if we have complete time information
            if (effectiveDate && effectiveStart && effectiveEnd) {
                const newStart = timeToMinutes(effectiveStart);
                const newEnd = timeToMinutes(effectiveEnd);

                if (newStart >= newEnd) {
                    return res.status(400).json({
                        success: false,
                        message: "End time must be after start time"
                    });
                }

                const existingLectures = await Lecture.find({
                    instructorId: effectiveInstructorId,
                    date: buildDateRangeQuery(effectiveDate),
                    _id: { $ne: id }, // Exclude current lecture
                    startTime: { $exists: true, $ne: null },
                    endTime: { $exists: true, $ne: null }
                });

                for (const lect of existingLectures) {
                    if (!lect.startTime || !lect.endTime) continue;
                    const existStart = timeToMinutes(lect.startTime);
                    const existEnd = timeToMinutes(lect.endTime);

                    if (hasTimeOverlap(newStart, newEnd, existStart, existEnd)) {
                        return res.status(400).json({
                            success: false,
                            message: `Time conflict: instructor already has a lecture from ${lect.startTime} to ${lect.endTime} on this date`
                        });
                    }
                }
            }
        }

        // Auto-update status based on instructor assignment
        if (updates.instructorId !== undefined && !updates.status) {
            updates.status = updates.instructorId ? 'Scheduled' : 'Pending';
        }

        const updatedLecture = await Lecture.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        const populatedLecture = await Lecture.findById(updatedLecture._id)
            .populate('courseId', 'name level')
            .populate({ path: 'instructorId', populate: { path: 'userId', select: 'name email' } });

        res.status(200).json({
            success: true,
            message: "Lecture updated successfully",
            data: populatedLecture
        });
    } catch (error) {
        console.error("Update Lecture Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const deleteLecture = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid lecture ID" });
        }

        const lecture = await Lecture.findByIdAndDelete(id);
        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        res.status(200).json({ success: true, message: "Lecture deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const getMyLectures = async (req, res) => {
    try {
        const instructor = await Instructor.findOne({ userId: req.user._id });
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor profile not found. Your account may still be pending approval."
            });
        }

        const lectures = await Lecture.find({ instructorId: instructor._id })
            .populate('courseId', 'name level')
            .populate({ path: 'instructorId', populate: { path: 'userId', select: 'name email' } })
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: lectures.length,
            data: lectures
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export default { getAllLecture, createLecture, getLectureById, updateLecture, deleteLecture, getMyLectures }