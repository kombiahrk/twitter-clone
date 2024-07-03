import express from "express";
import { isAuthorized } from "../middleware/authCheck.js";
import { getUserProfile, followOrUnFollow, getSuggestedUser, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", isAuthorized, getUserProfile);

router.get("/suggested", isAuthorized, getSuggestedUser);

router.post("/follow/:id", isAuthorized, followOrUnFollow);

router.post("/update", isAuthorized, updateUser);

export default router;