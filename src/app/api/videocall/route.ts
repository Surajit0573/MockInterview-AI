import { createServer } from 'http';
import { NextRequest, NextResponse } from 'next/server';
import { PeerServer } from 'peer';
import { WebSocketServer } from 'ws';

const server = createServer();
const wss = new WebSocketServer({ server });

// Setup PeerJS server
const peerServer = PeerServer({ port: 9000, path: '/peerjs' });

const clients = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === 'register') {
            clients.set(data.peerId, ws);
        } else if (data.type === 'call') {
            const recipient = clients.get(data.targetId);
            if (recipient) {
                recipient.send(JSON.stringify({ type: 'incoming-call', peerId: data.peerId }));
            }
        }
    });

    ws.on('close', () => {
        for (const [peerId, client] of clients.entries()) {
            if (client === ws) {
                clients.delete(peerId);
                break;
            }
        }
    });
});

server.listen(8080, () => console.log('WebSocket signaling server running on ws://localhost:8080'));

export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'WebSocket Server Running' });
}
