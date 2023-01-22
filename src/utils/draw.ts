import { mouse, Button, Point, straightTo } from '@nut-tree/nut-js';
import * as stream from 'stream';

class Draw {
  wsStream!: stream.Duplex;

  action!: string;

  handler = (
    wsStream: stream.Duplex,
    action: string,
    value: string[],
  ): void => {
    try {
      this.wsStream = wsStream;
      this.action = action;

      switch (this.action) {
        case 'circle': {
          this.circle(+[value]);
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

  circle = async (radius: number) => {
    let { x, y } = await mouse.getPosition();

    mouse.config.mouseSpeed = -0.8;

    await mouse.pressButton(Button.LEFT);

    const x0 = x + radius;
    const y0 = y;

    for (let i = x; i <= x0 + radius; i += 0.2) {
      x = i;
      y = this.calculateY(x, x0, y0, radius, -1);
      await mouse.move(straightTo(new Point(x, y)));
    }
    for (let i = x; i >= x0 - radius; i -= 0.2) {
      x = i;
      y = this.calculateY(x, x0, y0, radius, 1);
      await mouse.move(straightTo(new Point(x, y)));
    }
    await mouse.releaseButton(Button.LEFT);
    this.send();
  };

  send = (value: string = ''): void => {
    const command = `draw_${this.action} ${value}`;
    this.wsStream.write(command, 'utf-8');
    process.stdout.write(`Done: ${command}\n`);
  };

  calculateY = (
    x: number,
    x0: number,
    y0: number,
    r: number,
    direction: number,
  ): number => {
    const c = -(r ** 2 - x ** 2 + 2 * x * x0 - x0 ** 2 - y0 ** 2);
    const d = Math.sqrt(y0 ** 2 - c);
    return y0 + d * direction;
  };
}

export default new Draw();
