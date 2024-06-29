import express from "express";
import authRoute from "./routes/auth.js";

const app = express();

app.get("/", (req, res) => res.send("Server is ready"));

app.use("/api/auth", authRoute);

app.listen(8000, () => console.log("Server is running on Port 8000"));
