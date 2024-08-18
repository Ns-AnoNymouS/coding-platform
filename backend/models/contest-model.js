import mongoose from "mongoose";
import Counter from "./counter-model.js";

const Schema = new mongoose.Schema(
    {
        contestNumber: {
            type: Number,
            unique: true,
        },
        contestTitle: {
            type: String,
            required: [true, "Name cannot be empty"],
        },
        schedule: {
            type: Object,
        },
        questionIds: {
            type: [mongoose.Schema.ObjectId],
            ref: "ContestQuestions",
            required: [true, "A contest must have atleast one question"],
        },
        description: {
            type: String,
            required: [true, "A Problem Shoud have it's description"],
        },
        host: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "A contest must have a host"],
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        { _id: sequenceName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
}

Schema.pre('save', async function (next) {
    if (this.isNew) {
        this.contestNumber = await getNextSequenceValue('contestNumber');
    }
    next();
});

const Contest = mongoose.model("Contest", Schema);
export default Contest;
