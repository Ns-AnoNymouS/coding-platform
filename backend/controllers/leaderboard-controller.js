import ContestSubmissions from "../models/contest-submissions-model.js";
import Contest from "../models/contest-model.js";
import User from "../models/user.js";

const getLeaderboard = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const contestId = req.query.contestId;

        if (!contestId) {
            return res.status(400).json({ message: "contestId is required" });
        }

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        // const participants = await Contest.findById(contestId)
        //     .select('participants');
        const participantsData = await Contest.aggregate([
            { $unwind: '$participants' }, // Deconstructs the participants array
            { $sort: { 'participants.score': -1, 'participants.submittedAt': 1 } }, // Sort by score descending and submission time ascending
            { $skip: (page - 1) * limit }, // Skip documents for the current page
            { $limit: limit }, // Limit the number of documents per page
            { $project: { _id: 0, participants: 1 } } // Project only the participants field
        ]);

        const userIds = participantsData.map(p => p.participants.user);

        // Step 2: Query the User model to get usernames
        const users = await User.find({ _id: { $in: userIds } }).select('username _id').exec();

        // Step 3: Create a mapping of user ID to username
        const userMap = {};
        users.forEach(user => {
            userMap[user._id] = user.username;
        });

        const enrichedParticipants = participantsData.map(p => ({
            ...p,
            participants: {
                ...p.participants,
                username: userMap[p.participants.user], // Add username here
            }
        }));
        // const leaderboard = participants
        //     .sort({ score: -1, submittedAt: 1 }) // Sort by score descending and submittedAt ascending
        //     .slice((page - 1) * limit, page * limit);

        return res.status(200).json({ status: "ok", data: enrichedParticipants });
    } catch (error) {
        return res.status(500).json({ status: "failed", data: error.message });
    }
}

export { getLeaderboard };