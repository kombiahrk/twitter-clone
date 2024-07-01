import express from "express";
import donenv from "dotenv";
import authRoutes from "./routes/authRouter.js";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

donenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json()); // to parse req.body
app.use(express.urlencoded({ extended: true })); //to parse form data
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
    connectMongoDB();
});
