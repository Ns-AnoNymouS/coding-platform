import ContestQuestions from "../models/contest-problems-model.js";
import Contest from "../models/contest-model.js";
import User from "../models/user.js";

const createContest = async (req, res) => {
    try {
        const user = req.user.user || {};
        const userId = user._id;

        const { contestTitle, schedule, description } = req.body;

        const contest = await Contest.create({
            contestTitle,
            schedule,
            description,
            questionIds,
            host: userId
        });

        res.status(201).json({
            status: "ok",
            data: contest,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "unsuccessful",
            data: err.message,
        });
    }
}

const getContest = async (req, res) => {
    try {
        const user = req.user.user || {};
        const userId = user._id;

        const type = req.query.type;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const title = req.query.title;

        const now = new Date();
        const query = { schedule: {} };
        if (type == "upcoming") {
            query.schedule.start = { $gte: now };
        }
        if (type == "ongoing") {
            query.schedule.start = { $lte: now };
            query.schedule.end = { $gte: now };
        }
        if (type == "previous") {
            query.schedule.end = { $lt: now };
        }
        if (title) {
            query.contestTitle = new RegExp(title, 'i');
        }

        const contest = await Contest.find(query, "_id contestNumber contestTitle schedule host")
            .limit(limit)
            .skip((page - 1) * limit);

        const updatedContest = contest.map(item => {
            return {
                ...item._doc,  // Spread the original document's properties
                isHost: item.host.toString() === userId.toString() // Add the isHost key
            };
        });

        const totalDocuments = await Contest.countDocuments(query);
        const hasNextPage = (page * limit) < totalDocuments;
        return res.status(200).json({
            status: "ok",
            data: updatedContest,
            totalDocuments,
            hasNextPage
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "unsuccessful",
            data: "Internal Server Error",
            error: err.message
        });
    }
}

const getContestQuestions = async (req, res) => {
    try {
        const { contestId } = req.query;
        const user = req.user.user || {};
        const userId = user._id;

        if (!contestId) {
            return res.status(400).json({ message: "contest ID not found!" });
        }

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({
                status: "unsuccessful",
                data: "Contest ID not found"
            })
        }

        const response = {
            contestTitle: contest.contestTitle,
            contestNumber: contest.contestNumber,
            schedule: contest.schedule,
            isHost: contest.host == userId,
        };

        if (contest.schedule.start < new Date()) {
            const questions = await ContestQuestions.find({ _id: { $in: contest.questionIds } }, "_id title points");
            response.questions = questions;
        }

        res.status(200).json({
            status: "ok",
            data: response,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "unsuccessful",
            message: err.message,
        });
    }
};

const getContestQuestionsById = async (req, res) => {
    try {
        const { questionId } = req.query;
        const user = req.user.user || {};
        const userId = user._id;

        if (!questionId) {
            return res.status(400).json({ message: "questionId not found!" });
        }

        const question = await ContestQuestions.findById(questionId);
        if (!question) {
            return res.status(404).json({
                status: "unsuccessful",
                data: "Contest Question ID not found"
            })
        }

        const contest = await Contest.findById(question.contestId);
        if (!contest) {
            return res.status(404).json({
                status: "unsuccessful",
                data: "Contest ID not found"
            })
        }

        if (contest.host != userId && contest.schedule.start > new Date()) {
            return res.status(404).json({
                status: "unsuccessful",
                data: "Contest not started yet"
            })
        }

        if (contest.schedule.start < new Date()) {
            const questions = await ContestQuestions.find({ _id: { $in: contest.questionIds } }, "_id title points");
            response.questions = questions;
        }

        res.status(200).json({
            status: "ok",
            data: response,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "unsuccessful",
            data: err.message,
        });
    }
};

export { getContest, getContestQuestions, getContestQuestionsById };