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

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log("Post not found");
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            console.log("You are not authorized to delete this post");
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        console.log("Post deleted successfully");
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error in deletePost controller:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}