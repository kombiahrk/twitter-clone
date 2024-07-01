import express from "express"
import { isAuthorized } from "../middleware/authCheck.js";
import { getUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", isAuthorized, getUserProfile);

export default router;