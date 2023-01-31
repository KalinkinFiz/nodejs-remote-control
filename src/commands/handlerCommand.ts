import * as stream from 'stream';

import { handlerMouse, handlerDrawing, handlerScreen } from '../utils/index';

class HandlerCommand {
  duplex!: stream.Duplex;

  handler = async (duplex: stream.Duplex): Promise<void> => {
    this.duplex = duplex;

    this.duplex.on('data', (data) => {
      process.stdout.write(`Recieved: ${data}\n`);

      const [command, action, ...value] = data
        .toString()
        .split('_')
        .join(' ')
        .split(' ');

      switch (command) {
        case 'mouse': {
          handlerMouse.handler(this.duplex, action, value);
          break;
        }

        case 'draw': {
          handlerDrawing.handler(this.duplex, action, value);
          break;
        }

        case 'prnt': {
          handlerScreen.handler(this.duplex);
          break;
        }

        default: {
          break;
        }
      }
    });
  };
}

export const handlerCommand = new HandlerCommand().handler;
