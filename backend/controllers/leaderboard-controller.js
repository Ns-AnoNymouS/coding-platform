import ContestSubmissions from "../models/contest-submissions-model.js";
import Contest from "../models/contest-model.js";

const getLeaderboard = async (req, res) => {
    try {
        const contest = await Contest.findOne({ contestNumber: req.params.contestNumber });
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        const participants = await Contest.findById(contestId)
            .select('participants') // Adjust based on your schema
            .exec();

        const leaderboard = participants
            .sort({ score: -1, submittedAt: 1 }) // Sort by score descending and submittedAt ascending
            .slice((currentPage - 1) * pageSize, currentPage * pageSize);

        return res.status(200).json({ status: "ok", data: leaderboard });
    } catch (error) {
        return res.status(500).json({ status: "failed", data: error.message });
    }
}

export { getLeaderboard };