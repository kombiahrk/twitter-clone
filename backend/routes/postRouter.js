import express from "express";

import { isAuthorized } from "../middleware/authCheck.js";
import { createPost } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", isAuthorized, createPost);

export default router;
