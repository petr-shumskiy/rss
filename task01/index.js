/* eslint-disable no-underscore-dangle */
import { Transform } from 'stream';
import fs from 'fs';
import path from 'path';
import { argv, stdin, stdout } from 'process';
import {
  ASCIIWithShiftToChar,
  charToASCII,
  mirrorASCIIChar,
  runPipeline,
} from './utils.js';
import { validateArgs, validateConfig } from './validations.js';

const __dirname = path.resolve();

const caesarCipher = (mode, str, shift = 1) => {
  const normalizedShift = mode === 'encode' ? shift % 26 : -(shift % 26);
  if (!str) {
    return str;
  }
  if (typeof str !== 'string') {
    // TODO throw new Error("incorrect type")
    throw new Error("input isn't a string");
  }
  return str
    .split('')
    .map(charToASCII)
    .map((n) => ASCIIWithShiftToChar(n, normalizedShift))
    .join('');
};

/**
 *
 * @param {string} str
 */
const atbash = (str) => str
  .split('')
  .map(charToASCII)
  .map(mirrorASCIIChar)
  .join('');

class Crypto extends Transform {
  constructor({ algorithm = 'C', mode = '1', shift = 1 }) {
    super();
    this.mode = mode;
    this.shift = shift;
    if (algorithm === 'C') {
      this.encode = caesarCipher.bind(null, 'encode');
      this.decode = caesarCipher.bind(null, 'decode');
    }

    if (algorithm === 'A') {
      this.encode = atbash;
      this.decode = atbash;
    }
  }

  _transform(chunk, encoding, callback) {
    try {
      if (this.mode === '1') {
        callback(null, this.encode(chunk.toString(), this.shift));
      } else {
        callback(null, this.decode(chunk.toString(), this.shift));
      }
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * @param {string} config
 * @return {Transform[]}
 */
const parseConfig = (config) => config
  .split('-')
  .map((code) => {
    const [algorithm, mode] = code.split('');
    if (algorithm === 'C') {
      return new Crypto({ algorithm, mode });
    }
    if (algorithm === 'R') {
      return new Crypto({ algorithm: 'C', mode, shift: 8 });
    }
    if (algorithm === 'A') {
      return new Crypto({ algorithm });
    }

    throw new Error('undefined algo');
  });

const [config, inputPath, outputPath] = validateArgs(argv.slice(2));
validateConfig(config);

let rs; let ws;
if (!inputPath) {
  rs = stdin;
}
if (!outputPath) {
  ws = stdout;
}
rs = rs || fs.createReadStream(path.resolve(__dirname, inputPath), { encoding: 'utf-8' });
ws = fs || fs.createWriteStream(path.resolve(__dirname, outputPath), { encoding: 'utf-8' });

const transformStreams = parseConfig(config);
runPipeline([rs, ...transformStreams, ws]);
