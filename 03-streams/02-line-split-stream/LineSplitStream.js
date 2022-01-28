const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.encoding = options.encoding;
    this.lineTemp = null;
    // this.regexp = new RegExp(`(.)+(${os.EOL})?`, 'g');
  }

  _transform(chunk, encoding, callback) {
    const str = encoding === 'buffer' ? chunk.toString(this.encoding) : chunk;

    // this.passLinesWithEOL(str);
    this.passLinesWithoutEOL(str);

    callback();
  }

  passLinesWithoutEOL(str) {
    const lines = str.split(os.EOL);

    lines.forEach((string, index) => {
      if (lines.length - 1 === index) { // part that has no EOL in original string
        this.lineTemp = this.lineTemp === null ? string : `${this.lineTemp}${string}`;
      } else {
        this.push(`${this.lineTemp || ''}${string}`);
        this.lineTemp = null;
      }
    });
  }

  // по условию задачи не понял, что надо передавать дальше уже без EOL.
  // Понял это, только почитав тесты, получился такой TDD.
  // Решил этот метод не удалять, оставлю себе для истории.
  // passLinesWithEOL(str) {
  //   const lines = str.match(this.regexp);
  //
  //   if (lines) {
  //     lines.forEach(string => {
  //       if (string.includes(os.EOL)) {
  //         this.push(`${this.lineTemp || ''}${string.replace(os.EOL, '')}`);
  //         this.lineTemp = null;
  //       } else {
  //         this.lineTemp = this.lineTemp === null ? string : `${this.lineTemp}${string}`;
  //       }
  //     });
  //   }
  // }

  _flush(callback) {
    if (this.lineTemp !== null) {
      this.push(this.lineTemp);
    }

    callback();
  }
}

module.exports = LineSplitStream;
