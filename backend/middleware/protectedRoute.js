import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            console.log("Valid token not provided");
            return res.status(401).json({error: "Unauthorized: No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        if(!decoded){
            console.log("Issue with token decoding");
            return res.status(401).json({error: "Unauthorized: Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user){
            console.log("User not found");
            return res.status(404).json({error: "User not found"});
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectedRoute middleware", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}