import RandomNumStream from "./RandomNumStream.js";
import {Writable, PassThrough} from "stream";
import SquareNums from "./SquareNums.js";

console.log('streams');

const objectMode = true
let numbers = [];
const randomNums = new RandomNumStream({objectMode, numbersLimit: 21});

const writable = new Writable({
    objectMode,
    write: (data, enc, cb) => {
        console.log(objectMode ? data : data.toString());
        cb();
    }
});

const squareStream = new SquareNums({readableObjectMode: objectMode, writableObjectMode: objectMode});

const makeLogger = line => {
    return new PassThrough({
        readableObjectMode: objectMode,
        writableObjectMode: objectMode,
        transform(chunk, encoding, callback) {
            console.log(`${line} ${this.readableObjectMode ? chunk.num : chunk}`);
            numbers.push(this.readableObjectMode ? chunk.num : chunk);
            this.push(chunk);
            callback();
        }
    });
}

writable.on('end', () => {
    console.log('write end');
    console.log(numbers)
});

randomNums
    .pipe(makeLogger('generate num ->'))
    .pipe(squareStream)
    .pipe(makeLogger('square num ->'))
    .pipe(writable);