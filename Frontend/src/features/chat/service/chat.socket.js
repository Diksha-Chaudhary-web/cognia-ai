import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:3000";
let socket;

export const initializeSocketConnection = () => {
    if (socket?.connected) {
        return socket;
    }

    socket = io(socketUrl, {
        withCredentials: true,
    })

    socket.on("connect", () => {
        console.log("Connected to Socket.IO server")
    })

    return socket;
}
