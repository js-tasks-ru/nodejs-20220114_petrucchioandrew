const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.encoding = options.encoding;
    this.passedDataSize = 0;
  }

  _transform(chunk, encoding, callback) {
    const chunkSize = this.getChunkSize(chunk);

    if (this.passedDataSize + chunkSize > this.limit) {
      callback(new LimitExceededError());
    } else {
      this.passedDataSize += chunkSize;
      callback(null, chunk);
    }
  }

  getChunkSize(chunk) {
    return chunk instanceof Buffer ? chunk.length : Buffer.from(chunk, this.encoding).length;
  }
}

module.exports = LimitSizeStream;
