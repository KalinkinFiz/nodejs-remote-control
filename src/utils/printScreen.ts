import { mouse, screen, Region } from '@nut-tree/nut-js';
import Jimp from 'jimp';
import * as stream from 'stream';

class Screen {
  wsStream!: stream.Duplex;

  handler = async (wsStream: stream.Duplex) => {
    try {
      this.wsStream = wsStream;

      const { x, y } = await mouse.getPosition();
      const imageSize = 200;
      const img = new Region(
        x - imageSize / 2,
        y - imageSize / 2,
        imageSize,
        imageSize,
      );

      await screen.highlight(img);

      const screenshot = await (await screen.grabRegion(img)).toRGB();

      const image = new Jimp({
        data: screenshot.data,
        width: img.width,
        height: img.height,
      });

      image.getBase64(
        Jimp.MIME_PNG,
        (_err: Error | null, imgString: string) => {
          wsStream.write(`prnt_scrn ${imgString.split(',')[1]}\0`, 'utf-8');
        },
      );
      process.stdout.write('Done: prnt_scrn\n');
    } catch {
      process.stdout.write('☠️ ERROR\n');
    }
  };
}

export default new Screen();