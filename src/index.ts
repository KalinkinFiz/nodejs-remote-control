import { WebSocketServer, WebSocket, createWebSocketStream } from 'ws';

import { httpServer } from './http_server/index';
import handlerCommand from './commands/handlerCommand';

const HTTP_PORT = 8181;
const WS_PORT = 8080;

httpServer.listen(HTTP_PORT);
process.stdout.write(`🚀 Start static http server on the ${HTTP_PORT} port!\n`);

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws: WebSocket) => {
  process.stdout.write(`🚀 Start WS server on the ${WS_PORT} port!\n`);

  const wsStream = createWebSocketStream(ws, {
    encoding: 'utf8',
    decodeStrings: false,
  });

  handlerCommand(wsStream);

  ws.on('close', () => {
    process.stdout.write('Websocket closed. \n');
  });

  process.on('SIGINT', () => {
    process.stdout.write('Closing WS server\n');

    wss.close();
    process.exit(0);
  });
});
