import Instructor from '../models/Instructor.js';
import Lecture from '../models/lecture.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create instructor (admin) — creates a User and Instructor profile
export const createInstructor = async (req, res) => {
    try {
        const { name, email, password, experience = 0, specialization = 'Other' } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Create user with instructor role
        const user = await User.create({ name, email, password, role: 'instructor' });

        // Create instructor profile
        const instructor = await Instructor.create({ userId: user._id, experience, specialization });

        const populatedInstructor = await Instructor.findById(instructor._id).populate('userId', 'name email');
        return res.status(201).json({ success: true, message: 'Instructor created', data: populatedInstructor });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

export const getAllInstructor = async (req, res) => {
    try {
        const instructors = await Instructor.find().populate('userId',  'name email');

         //Get lecture count for all instructors
        const instructorsWithCount = await Promise.all(
            instructors.map(async (instructor) => {
                const lectureCount = await Lecture.countDocuments({
                    instructorId: instructor._id
                });

                return {
                    ...instructor.toObject(),
                    lectureCount: lectureCount
                };
            })
        );

        res.status(200).json({
            success: true,
            count: instructorsWithCount.length,
            data: instructorsWithCount
        });




    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const getPendingInstructor = async (req, res) => {
    try {
        // Pending instructors are users whose role is 'pendingInstructor' and do not yet have an Instructor profile
        const pendingUsers = await User.find({ role: 'pendingInstructor' }).select('name email role createdAt');

        return res.status(200).json({
            success: true,
            count: pendingUsers.length,
            data: pendingUsers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

export const approveInstructor = async(req, res) => {
    const {userId} = req.body;
    try {
        // 1. Initial ID format safety check
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "A valid User ID is required in the request body."
            });
        }

        // 2. Fetch required information from database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        const existingInstructor = await Instructor.findOne({ userId });
        if (existingInstructor) {
            return res.status(400).json({
                success: false,
                message: "Instructor profile already exists for this user"
            });
        }

        if (user.role !== 'pendingInstructor') {
            return res.status(400).json({
                success: false,
                message: "You have not applied for the instructor role"
            });
        }

        // 3. Create the instructor profile
        const instructor = await Instructor.create({ userId });

        // 4. Update the user role using an atomic operation (prevents parallel save crashes)
        await User.findByIdAndUpdate(userId, { role: 'instructor' });

        // 5. Populate and return data
        const populatedInstructor = await Instructor.findById(instructor._id)
            .populate('userId', 'name email');
        
        return res.status(201).json({
            success: true,
            message: "Instructor successfully approved",
            data: populatedInstructor
        });

    } catch (error) {
        // Look at your backend terminal console to see exactly which line broke!
        console.error("CRITICAL BACKEND ERROR IN APPROVE INSTRUCTOR:", error); 
        
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }

};

export const rejectInstructor = async(req, res) =>{
    try {
        const {userId} = req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User does not exists"
            })
        }
        if(user.role !== "pendingInstructor"){
            return res.status(400).json({
                success: false,
                message: "User has not applies for the instructor"
            })
        }
        user.role = 'rejectedInstructor'
        await user.save();
        return res.status(200).json({
            success: true,
            message: "User rejected successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
}

export const updateInstructor = async(req, res) =>{
    // Admins or instructors can update an instructor profile.
    // Admins call PATCH /:id with instructor id; instructors call PATCH /:id for their own profile.
    const { experience, specialization } = req.body;
    const { id } = req.params;

   try {
     const instructor = await Instructor.findById(id);
     if (!instructor) {
         return res.status(404).json({
             success: false,
             message: 'Instructor profile not found'
         });
     }
 
     // If current user is an instructor, ensure they can only update their own profile
     if (req.user.role === 'instructor') {
         if (String(instructor.userId) !== String(req.user._id)) { 
             return res.status(403).json({
                 success: false,
                 message: 'Forbidden: cannot update other instructor profiles'
             });
         }
     }
 
     const updates = {};
     if (experience !== undefined) updates.experience = experience;
     if (specialization !== undefined) updates.specialization = specialization;
     if(Object.keys(updates).length === 0){
        return res.status(400).json({
        success:false,
        message:"No fields provided for update"
    });
     }
 
     const updatedInstructor = await Instructor.findByIdAndUpdate(id, updates, { new: true });
     const responseInstructor = await Instructor.findById(updatedInstructor._id).populate('userId', 'name email');
     return res.status(200).json({
         success: true,
         data: responseInstructor
     });
   } catch (error) {
     res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
   }
}




export const deleteInstructor = async(req, res) => {
    const { id } = req.params;
    try {
        const instructor = await Instructor.findById(id);
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        // Count lectures using instructorId instead of lectureId
        const lectureCount = await Lecture.countDocuments({ instructorId: id });
        if (lectureCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete instructor. They have ${lectureCount} lecture(s) assigned. Please reassign or delete those lectures first.`
            });
        }

        // Delete instructor profile
        await Instructor.findByIdAndDelete(id);

        // Delete corresponding login credentials
        await User.findByIdAndDelete(instructor.userId);

        res.status(200).json({
            success: true,
            message: "Instructor deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const getInstructorDetails = async(req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid instructor id'
            });
        }

        const instructor = await Instructor.findById(id).populate('userId', 'name email');
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        const lectures = await Lecture.find({ instructorId: id }).populate('courseId', 'name level').sort({ date: 1 });
        const lectureCount = lectures.length;
        res.status(200).json({
            success: true,
            data: {
                instructor: instructor,
                lectureCount: lectureCount,
                lectures: lectures
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};


export default {
    createInstructor,
    getAllInstructor,
    approveInstructor,
    getPendingInstructor,
    rejectInstructor,
    deleteInstructor,
    getInstructorDetails,
    updateInstructor
};