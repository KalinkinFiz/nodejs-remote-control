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
        case 'rectangle': {
          const [width, length] = value;
          this.rectangle(+width!, +length!);
          break;
        }
        case 'square': {
          this.square(+[value]);
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

  rectangle = async (width: number, length: number) => {
    let { x, y } = await mouse.getPosition();

    mouse.config.mouseSpeed = -0.1;

    await mouse.pressButton(Button.LEFT);

    x += width;
    await mouse.move(straightTo(new Point(x, y)));

    y += length;
    await mouse.move(straightTo(new Point(x - 2, y)));

    x -= width + 2;
    await mouse.move(straightTo(new Point(x, y - 2)));

    y -= length + 2;
    await mouse.move(straightTo(new Point(x + 2, y + 1)));

    await mouse.releaseButton(Button.LEFT);
    this.send();
  };

  square = async (length: number) => {
    let { x, y } = await mouse.getPosition();

    mouse.config.mouseSpeed = -0.1;

    await mouse.pressButton(Button.LEFT);

    x += length;
    await mouse.move(straightTo(new Point(x, y)));

    y += length;
    await mouse.move(straightTo(new Point(x - 2, y)));

    x -= length + 2;
    await mouse.move(straightTo(new Point(x, y - 2)));

    y -= length + 2;
    await mouse.move(straightTo(new Point(x + 2, y)));

    await mouse.releaseButton(Button.LEFT);
    this.send();
  };

  send = async (value: string = ''): Promise<void> => {
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
