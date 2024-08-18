import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        contestNumber: {
            type: Number,
            required: [true, "contestNumber cannot be empty"],
        },
        problemNumber: {
            type: String,
            required: [true, "problemNumber cannot be empty"],
        },
        code: {
            type: Object,
            required: [true, "code cannot be empty"],
        },
        points: {
            type: Number,
        },
        submittedAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const ContestSubmissions = mongoose.model("ContestSubmissions", Schema);
export default ContestSubmissions;
