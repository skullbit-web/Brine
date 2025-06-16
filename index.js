import express from 'express';
import http from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import cors from 'cors';
import path from 'path';

const server = http.createServer();
const app = express();
const __dirname = process.cwd();
const bareServer = createBareServer('/b/');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname + '/public'));

// Main HTTP and WebSocket proxy handler
server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        // Native WebSocket upgrade support (works for GeForce NOW signaling)
        bareServer.routeUpgrade(req, socket, head);
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
