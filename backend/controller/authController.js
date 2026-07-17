
import User from '../models/User.js';
import Instructor from '../models/Instructor.js';
import Student from '../models/Student.js'
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password"
            });
        }

        // Check if user already exists in either collection
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        const finalRole = role === 'instructor'? 'pendingInstructor' : 'student';
        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role: finalRole   // default to instructor
        });


        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;
        const message = finalRole === "pendingInstructor"
        ? "Registration successful. Awaiting admin approval."
        : "Registration successful.";

        res.status(201).json({
            success: true,
            message,
            data: userResponse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        let instructorId = null;

        // If user is instructor, fetch their instructor profile ID
        if (user.role === 'instructor') {
            const instructorProfile = await Instructor.findOne({ userId: user._id });
            instructorId = instructorProfile?._id;
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                ...userResponse,
                instructorId: instructorId   // ← This was missing!
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

export const logoutUser = (req, res) =>{
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}

export default {registerUser, loginUser, logoutUser}