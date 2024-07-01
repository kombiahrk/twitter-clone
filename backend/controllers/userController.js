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

export const followOrUnFollow = async (req, res) => {
    try {
        const { id } = req.params;
        const userToFollowOrUnFollow = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id == req.user._id.toString()) {
            console.log("You can't follow or unfollow yourself");
            return res.status(400).json({ error: "You can't follow or unfollow yourself" });
        }

        if (!userToFollowOrUnFollow || !currentUser) {
            console.log("User not found");
            return res.status(400).json({ error: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            //unfollow the user
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            console.log("User unfollowed successfully");
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            //follow the user
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
            console.log("User followed successfully");
            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.log("Error in followOrUnfollow controller:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}