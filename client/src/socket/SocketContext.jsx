import { io } from "socket.io-client";

let socket;

const getSocket = () => {
    if (!socket) {
        const url = import.meta.env.VITE_API_SOCKET_URL || "http://localhost:3000";
        socket = io(url, {
            withCredentials: true,
            transports: ["websocket", "polling"],
        });
        // Basic diagnostics
        socket.on('connect', () => {
            console.log('[socket] connected', socket.id);
        });
        socket.on('connect_error', (err) => {
            console.log('[socket] connect_error', err?.message);
        });
        socket.on('disconnect', (reason) => {
            console.log('[socket] disconnected', reason);
        });
    }
    return socket;
}

const setSocket = () => {
    socket = null;
}

export default {
    getSocket, setSocket
}