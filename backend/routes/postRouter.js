import express from "express";

import { isAuthorized } from "../middleware/authCheck.js";
import { createPost, deletePost } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", isAuthorized, createPost);

router.delete("/:id", isAuthorized, deletePost);

export default router;
