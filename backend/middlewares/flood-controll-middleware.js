const submissions = {};

const floodControlMiddleware = (req, res, next) => {
    if (req.user && req.user.user) {
        const user_id = req.user.user._id;

        // Initialize user's submission tracking if not already present
        if (!submissions[user_id]) {
            submissions[user_id] = {};
        }

        // Check if there is an ongoing process for the user
        if (Object.keys(submissions[user_id]).length !== 0) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }

        // Check if user has made a recent submission within 5 seconds
        if (submissions[user_id].timestamp && (Date.now() - submissions[user_id].timestamp) < 5000) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }

        // Set the timestamp for the user's submission
        submissions[user_id].timestamp = Date.now();

        // Remove ongoing process after 5 seconds
        setTimeout(() => {
            delete submissions[user_id];
        }, 5000);
    }

    next();
};

export { floodControlMiddleware }
