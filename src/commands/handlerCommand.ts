import * as stream from 'stream';

import { handlerMouse, handlerDrawing, handlerScreen } from '../utils/index';

class HandlerCommand {
  wsStream!: stream.Duplex;

  handler = async (wsStream: stream.Duplex): Promise<void> => {
    this.wsStream = wsStream;

    this.wsStream.on('data', (data) => {
      process.stdout.write(`Recieved: ${data}\n`);

      const [command, action, ...value] = data
        .toString()
        .split('_')
        .join(' ')
        .split(' ');

      switch (command) {
        case 'mouse': {
          handlerMouse.handler(this.wsStream, action, value);
          break;
        }

        case 'draw': {
          handlerDrawing.handler(this.wsStream, action, value);
          break;
        }

        case 'prnt': {
          handlerScreen.handler(this.wsStream);
          break;
        }

        default: {
          break;
        }
      }
    });
  };
}

export default new HandlerCommand().handler;
