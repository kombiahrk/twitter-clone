import express from "express";
import donenv from "dotenv";
import authRoute from "./routes/auth.js";

donenv.config();

const app = express();

console.log(process.env.MONGO_URI);

app.get("/", (req, res) => res.send("Server is ready"));

app.use("/api/auth", authRoute);

app.listen(8000, () => console.log("Server is running on Port 8000"));
