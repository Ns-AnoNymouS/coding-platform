import User from "../models/user.js"

const saveCode = async (req, res) => {
    try {
        const user_id = req.user.user._id;
        let { language, code } = req.body;
        if (!language || !code){
			return res.status(400).json({
				status: "unsuccessful",
				message: "All fields are required: code, language",
			});
        }
        code = atob(code);
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({status: "not found", message: "Userdoesn't exists"});
        }
        user.savedCode = {...user.savedCode, [language]: code}
        await user.save()
        res.status(200).json({status: "ok", message: "Code saved Sucessfully"});
    } catch (err) {
        console.error(err)
        res.status(500).json({status: "unsucessful", message: err.message});
    }
}

const getsavedCode = async (req, res) => {
    try {
        const user_id = req.user.user._id;
        let { language } = req.query;
        if (!language){
			return res.status(400).json({
				status: "unsuccessful",
				message: "language fields is required",
			});
        }
        const user = await User.findById(user_id);
        if (user && user.savedCode) {
            res.status(200).json({status: "ok", code: user.savedCode[language] || ""})
        }
        else{
            res.status(200).json({status: "ok", code: ""})
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({status: "unsucessful", code: "", message: err.message})
    }
}

export { getsavedCode, saveCode };