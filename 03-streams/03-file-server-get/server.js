// const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = '400';
        res.end('Bad Request');
      }

      const fileStream = fs.createReadStream(filepath);
      fileStream
          .on('error', () => {
            res.statusCode = '404';
            res.end('Not Found');
          })
          .pipe(res)
          .on('error', () => {
            res.statusCode = '500';
            res.end('Something goes wrong');
          });

      req.on('aborted', () => {
        fileStream.destroy();
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
