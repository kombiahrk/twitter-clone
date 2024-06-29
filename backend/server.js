import express from "express";
import donenv from "dotenv";
import authRoute from "./routes/auth.js";
import connectMongoDB from "./db/connectMongoDB.js";

donenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
    connectMongoDB();
});
