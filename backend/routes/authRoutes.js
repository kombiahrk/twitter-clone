import express from "express";
import { signup, login, logout, authCheck } from "../controllers/authController.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get('/check', protectedRoute, authCheck);

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

export default router;