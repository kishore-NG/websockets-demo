import { WebSocket  } from "ws";

function sendJson(socket, payload) {

    if (socket.readyState !== WebSocket.OPEN) 
        return;
    

  socket.send(JSON.stringify(payload));
}

function broadcast (wss, payload) {
    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) return;

        client.send(JSON.stringify(payload));
    }
}

export function attachWebSocketServer(server) {
    const wss = new WebSocket({
         server,
         path : "/ws",
         maxPayload : 1024 * 1024 

     });

    wss.on("connection", (socket) => {
        console.log("New WebSocket connection established.");

        sendJson(socket, { message: "Welcome to the WebSocket server!" });

        socket.on("message", (message) => {
            console.log("Received message:", message);
            // Handle incoming messages here
        });

        socket.on("error", (error) => {
            console.error("WebSocket error:", error);
        });

        socket.on("close", () => {
            console.log("WebSocket connection closed.");
        });
    });

    function broadcastMatchCreated(match) {
        broadcast(wss, { type: "matchCreated", data: match });
    }

    return { broadcastMatchCreated };
}

