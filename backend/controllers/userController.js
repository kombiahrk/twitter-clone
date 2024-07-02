import Notification from "../models/notificationSchema.js";
import User from "../models/userSchema.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" })
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
            return res.status(404).json({ error: "User not found" });
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

            //send notification to the user
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: id,
            });

            await newNotification.save();

            console.log("User followed successfully");
            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.log("Error in followOrUnfollow controller:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getSuggestedUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId } //Filters out documents where the _id matches the specified userId. $ne stands for "not equal".
                }
            },
            {
                $sample: {
                    size: 10 // Randomly selects a specified number of documents
                }
            },
            {
                $project: {
                    password: 0  // Exclude the password field
                }
            }
        ])

        const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0, 4)
        res.status(200).json(suggestedUsers)
    } catch (error) {
        console.log("Error in getSuggestedUser controller:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}