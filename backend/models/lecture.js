import mongoose from "mongoose";

const lectureSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date:{
        type: Date,
    },
    startTime:{
        type: String,
    },
    endTime:{
        type: String,
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    instructorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: false
    },
    status:{
        type: String,
        enum: ['Scheduled', 'Pending', 'Completed', 'Cancelled'],
        default : 'Pending'
    }

}, {timestamps: true});
 

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;