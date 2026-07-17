import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true  // One Instructor profile per User
    },
    experience: {
        type: Number,
        default: 0,
        min: 0
    },
    specialization: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

const Instructor = mongoose.model("Instructor", instructorSchema);

export default Instructor;