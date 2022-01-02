import {pipeline, Readable, Transform} from "stream";

const textStream = Readable.from('Hello World!', {highWaterMark: 32, encoding: 'utf8'});
const uppercaseTransform = new Transform({
    objectMode: false,
    highWaterMark: 32,
    write: function (chunk, encoding, done) {
        console.log(chunk.toString().toUpperCase());
        done();
    }
})

pipeline(textStream, uppercaseTransform, (err) => {
    if (err) {
        return console.log('err', err);
    }
    console.log('done');
});