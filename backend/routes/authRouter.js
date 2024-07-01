import express from "express";
import { signup, login, logout, getUser } from "../controllers/authController.js";
import { isAuthorized } from "../middleware/authCheck.js";

const router = express.Router();

router.get('/getuser', isAuthorized, getUser);

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', isAuthorized, logout);

export default router;