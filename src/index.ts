import { WebSocketServer, WebSocket, createWebSocketStream } from 'ws';
import { httpServer } from './http_server/index';

const HTTP_PORT = 8181;
const WS_PORT = 8080;

httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws: WebSocket) => {
  const wsStream = createWebSocketStream(ws, {
    encoding: 'utf8',
    decodeStrings: false,
  });

  wsStream.on('data', async (command: string) => {
    try {
      process.stdout.write(command);
    } catch (err) {
      process.stdout.write((err as Error)?.message);
    }
  });

  ws.on('close', () => {
    process.stdout.write('Websocket closed. \n');
  });

  process.on('SIGINT', () => {
    process.stdout.write('Closing WS server\n');

    wss.close();
    process.exit(0);
  });
});

process.stdout.write(`🚀 Start static http server on the ${HTTP_PORT} port!\n`);
process.stdout.write(`🚀 Start WS server on the ${WS_PORT} port!\n`);
