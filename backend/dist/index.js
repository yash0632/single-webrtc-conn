"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const port = 3000;
const httpServer = http_1.default.createServer().listen(port);
let senderWebSocket = null;
let receiverWebSocket = null;
const wss = new ws_1.WebSocketServer({ server: httpServer });
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        switch (message.type) {
            case 'sender':
                senderWebSocket = ws;
                break;
            case 'receiver':
                receiverWebSocket = ws;
                break;
            case 'createOffer':
                if (senderWebSocket !== ws) {
                    break;
                }
                receiverWebSocket === null || receiverWebSocket === void 0 ? void 0 : receiverWebSocket.send(JSON.stringify({
                    type: 'createOffer',
                    sdp: message.sdp
                }));
            case 'createAnswer':
                if (receiverWebSocket !== ws) {
                    break;
                }
                senderWebSocket === null || senderWebSocket === void 0 ? void 0 : senderWebSocket.send(JSON.stringify({
                    type: 'createAnswer',
                    sdp: message.sdp
                }));
            case 'iceCandidate':
                if (senderWebSocket === ws) {
                    receiverWebSocket === null || receiverWebSocket === void 0 ? void 0 : receiverWebSocket.send(JSON.stringify({
                        type: 'iceCandidate',
                        iceCandidate: message.iceCandidate
                    }));
                    break;
                }
                else if (receiverWebSocket === ws) {
                    senderWebSocket === null || senderWebSocket === void 0 ? void 0 : senderWebSocket.send(JSON.stringify({
                        type: 'iceCandidate',
                        iceCandidate: message.iceCandidate
                    }));
                    break;
                }
            default:
                ws.send(JSON.stringify({
                    type: 'error',
                    error: 'no required functionality'
                }));
                break;
        }
    });
    ws.send('you are successfully connected');
});
//websocket -> 
//senderice->receiver
