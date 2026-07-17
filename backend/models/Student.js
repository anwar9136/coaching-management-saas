import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    programId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },
    feeDetails: {
    totalFees: {
        type: Number,
        default: 0
    },
    paidFees: {
        type: Number,
        default: 0
    }
},
    enrollmentDate:{
        type: Date,
        default: Date.now,
    },
    parentName: {
   type: String,
   trim: true
},

    parentPhone: {
   type: String,
   trim: true
},
    studentPhone:{
    type: String,
    trim: true
}

},{timestamps: true})

studentSchema.index({userId: 1}, {unique: true})

const Student = mongoose.model("Student",studentSchema)

export default Student;