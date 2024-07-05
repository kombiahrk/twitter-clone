import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
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

export const updateUser = async (req, res) => {
    const { fullName, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        if ((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
            console.log("Please provide both current and new password");
            return res.status(400).json({ error: "Please provide both current and new password" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if (!isMatch) {
                console.log("Current password is incorrect");
                return res.status(400).json({ error: "Current password is incorrect" });
            }

            if (newPassword.length < 6) {
                console.log("Password must be atleast 6 characters long");
                return res.status(400).json({ error: "Password must be atleast 6 characters long" });
            }

            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }

        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;

        console.log("User Details updated successfully");
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateUser controller:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}  