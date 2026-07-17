import mongoose from "mongoose";

const programSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
    }
}, {
    timestamps: true
})

const Program = mongoose.model("Program",programSchema);
export default Program;