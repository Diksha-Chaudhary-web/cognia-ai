import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 3000;


const httpServer = http.createServer(app);

initSocket(httpServer);

httpServer.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. The backend may already be running.`);
        process.exit(1);
    }

    console.error("Server failed to start:", error);
    process.exit(1);
});

connectDB()
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
