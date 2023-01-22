import * as stream from 'stream';

import mouse from '../utils/mouse';
import drawing from '../utils/drawing';

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
          mouse.handler(this.wsStream, action, value);
          break;
        }

        case 'draw': {
          drawing.handler(this.wsStream, action, value);
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
