import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
    programId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    level:{
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: false
    }
},{timestamps: true})

const Course = mongoose.model("Course", courseSchema);

export default Course;