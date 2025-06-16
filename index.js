import express from 'express';
import http from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import cors from 'cors';
import path from 'path';
import { WebSocketServer } from 'ws';

const server = http.createServer();
const app = express();
const __dirname = process.cwd();
const bareServer = createBareServer('/b/');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname + '/public'));

// --- WebRTC Signaling Server (NO TURN, just signaling) ---
const wss = new WebSocketServer({ noServer: true });
const peers = new Map(); // Map<roomId, Set<ws>>

wss.on('connection', (ws, request, client) => {
    let roomId = null;

    ws.on('message', (msg) => {
        let data;
        try { data = JSON.parse(msg); } catch { return; }

        if (data.join && typeof data.join === 'string') {
            roomId = data.join;
            if (!peers.has(roomId)) peers.set(roomId, new Set());
            peers.get(roomId).add(ws);
            // Optionally notify others
            return;
        }

        // Relay signaling messages to all other peers in the room
        if (roomId && peers.has(roomId)) {
            for (const peer of peers.get(roomId)) {
                if (peer !== ws && peer.readyState === 1) {
                    peer.send(JSON.stringify(data));
                }
            }
        }
    });

    ws.on('close', () => {
        if (roomId && peers.has(roomId)) {
            peers.get(roomId).delete(ws);
            if (peers.get(roomId).size === 0) peers.delete(roomId);
        }
    });
});

// Main HTTP and WebSocket proxy handler
server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

// Upgrade HTTP to WebSocket for signaling
server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else if (req.url.startsWith('/signal')) {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    } else {
        socket.end();
    }
});

// Optional: Direct index.html route for browser access
app.get(['/', '/index'], (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✅ Proxy running at http://localhost:${PORT}`);
    console.log(`WebSocket and signaling proxying is enabled.`);
    console.log(`WebRTC media relay is NOT supported without an external TURN server.`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("Shutting down gracefully...");
    server.close();
    bareServer.close();
    process.exit(0);
}
