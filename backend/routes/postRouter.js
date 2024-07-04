import express from "express";

import { isAuthorized } from "../middleware/authCheck.js";
import { commentOnPost, createPost, deletePost } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", isAuthorized, createPost);

router.delete("/delete/:id", isAuthorized, deletePost);

router.post("/comment/:id", isAuthorized, commentOnPost);

export default router;
