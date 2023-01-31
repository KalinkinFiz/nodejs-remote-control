import * as fs from 'fs';
import * as path from 'path';
import { createServer, IncomingMessage, ServerResponse } from 'http';

export const httpServer = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const __dirname = path.resolve(path.dirname(''));
    const filePath =
      __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));

        return;
      }

      res.writeHead(200);
      res.end(data);
    });
  },
);
