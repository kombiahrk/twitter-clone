import express from "express"
import { isAuthorized } from "../middleware/authCheck.js";
import { getUserProfile, followOrUnFollow, getSuggestedUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", isAuthorized, getUserProfile);

router.get("/suggested", isAuthorized, getSuggestedUser);

router.post("/follow/:id", isAuthorized, followOrUnFollow);

export default router;