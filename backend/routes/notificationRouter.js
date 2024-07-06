import express from "express";
import { isAuthorized } from "../middleware/authCheck.js";
import { deleteAllNotifications, deleteNotification, getNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", isAuthorized, getNotifications);

router.delete("/", isAuthorized, deleteAllNotifications);

router.delete("/:id", isAuthorized, deleteNotification);

export default router;