import express from "express";

import { isAuthorized } from "../middleware/authCheck.js";
import { commentOnPost, createPost, deletePost, getAllPosts, likeUnlikePost } from "../controllers/postController.js";

const router = express.Router();

router.get("/all", isAuthorized, getAllPosts);

router.post("/create", isAuthorized, createPost);

router.post("/comment/:id", isAuthorized, commentOnPost);

router.post("/like/:id", isAuthorized, likeUnlikePost);

router.delete("/delete/:id", isAuthorized, deletePost);

export default router;
