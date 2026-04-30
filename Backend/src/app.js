import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";
import cors from "cors";

const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = frontendUrl.split(",").map((origin) => origin.trim()).filter(Boolean);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
  origin: "https://cognia-ai-app.onrender.com",
  credentials: true
}));

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

app.get("/api/health", (req, res) => {
    res.json({ ok: true, message: "Perplexity backend is healthy" });
});

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

export default app;
