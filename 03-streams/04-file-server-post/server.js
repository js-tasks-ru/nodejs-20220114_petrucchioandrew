// const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }
      const streamWrite = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitStream = new LimitSizeStream({limit: config.limit});
      let isWritingStarted = false;

      streamWrite
          .on('open', () => {
            isWritingStarted = true;
          });

      req
          .on('aborted', () => {
            if (isWritingStarted) {
              fs.unlink(filepath, err => {
                if (err) {
                  // log error
                  console.log('fs.unlink error', err.code);
                }
              });
            }
          });

      req
          .pipe(limitStream)
          .pipe(streamWrite);

      limitStream
          .on('error', err => {
            if (err instanceof LimitExceededError) {
              res.statusCode = 413;
              res.end('File size exceeded');
              streamWrite.destroy();
              fs.unlink(filepath, err => {
                if (err) {
                  // log error
                  console.log('fs.unlink Error');
                }
              });
            } else {
              res.statusCode = 500;
              res.end('Server error');
            }
          });

      streamWrite
          .on('error', err => {
            if (err.code === 'EEXIST') {
              res.statusCode = 409;
              res.end('File already exists');
            } else {
              res.statusCode = 500;
              res.end('Server error');
            }
          })
          .on('close', () => {
            if (!res.writableEnded) {
              res.statusCode = 201;
              res.end('Created');
            }
          });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
