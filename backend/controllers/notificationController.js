import Notification from "../models/notificationSchema.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ to: userId })
            .populate({ path: "from", select: ["fullName", "username", "profileImg"] });

        await Notification.updateMany({ to: userId }, { read: true });

        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications function:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({ to: userId });
        console.log("All Notifications deleted successfully");
        res.status(200).json({ message: "All Notifications deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotifications function:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            console.log("Notification not found");
            return res.status(404).json({ error: "Notification not found" });
        }

        if (notification.to.toString() !== userId.toString()) {
            console.log("You are not allowed to delete this notification");
            return res.status(403).json({ error: "You are not allowed to delete this notification" });
        }
        await Notification.findByIdAndDelete(notificationId);
        console.log("Notification deleted successfully");
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotification function:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
