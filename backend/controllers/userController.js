import User from "../models/userSchema.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" })
        }

        console.log("Fullname of", username, "is", user.fullName);
        res.status(200).json(user);

    } catch (error) {
        console.log("Error in getUserProfile controller:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}