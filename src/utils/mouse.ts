import { mouse, down, up, left, right } from '@nut-tree/nut-js';
import * as stream from 'stream';

class Mouse {
  duplex!: stream.Duplex;

  action!: string;

  handler = (duplex: stream.Duplex, action: string, value: string[]) => {
    try {
      this.duplex = duplex;

      this.action = action;

      const number = parseInt(value[0]!, 10);

      switch (this.action) {
        case 'up': {
          this.up(number);
          break;
        }

        case 'right': {
          this.right(number);
          break;
        }

        case 'down': {
          this.down(number);
          break;
        }

        case 'left': {
          this.left(number);
          break;
        }

        case 'position': {
          this.position();
          break;
        }

        default: {
          break;
        }
      }
    } catch {
      process.stdout.write('☠️ ERROR\n');
    }
  };

  up = async (value: number): Promise<void> => {
    await mouse.move(up(value));
    this.send();
  };

  right = async (value: number): Promise<void> => {
    await mouse.move(right(value));
    this.send();
  };

  down = async (value: number): Promise<void> => {
    await mouse.move(down(value));
    this.send();
  };

  left = async (value: number): Promise<void> => {
    await mouse.move(left(value));
    this.send();
  };

  position = async (): Promise<void> => {
    const { x, y } = await mouse.getPosition();
    console.log(` ${x},${y}`);

    const value = ` ${x},${y}`;
    this.send(value);
  };

  send = (value: string = ''): void => {
    const command = `mouse_${this.action}${value}`;

    this.duplex.write(command, 'utf-8');

    process.stdout.write(`Done: ${command}\n`);
  };
}

export const handlerMouse = new Mouse();
