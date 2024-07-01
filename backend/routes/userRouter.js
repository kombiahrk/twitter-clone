import express from "express"
import { isAuthorized } from "../middleware/authCheck.js";
import { getUserProfile, followOrUnFollow } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", isAuthorized, getUserProfile);

router.post("/follow/:id", isAuthorized, followOrUnFollow);

export default router;