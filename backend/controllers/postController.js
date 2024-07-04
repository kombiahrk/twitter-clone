import { v2 as cloudinary } from "cloudinary";
import User from "../models/userSchema.js";
import Post from "../models/postSchema.js";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId)
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        if (!text && !img) {
            console.log("Post must have text or image");
            return res.status(400).json({ error: "Post must have text or inmage" });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save();
        console.log("Post has been successfully created");
        res.status(201).json(newPost);
    } catch (error) {
        console.log("Error in createPost controller:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}