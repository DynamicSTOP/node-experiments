import {Readable, Transform, Writable, pipeline} from "stream";

const makeStr = (() => {
    const alphabet = 'qwertyuiopasdfhjklzxcvbnm';
    return size => {
        let s = '';
        while (size--) {
            s += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return s;
    }
})();

const randomString = new Readable({
    encoding: 'utf8',
    highWaterMark: 2 * 1024,
    read: function (size) {
        console.log('++', size);
        this.push(makeStr(size));
        if (Math.random() * 100 > 95) {
            this.push(null);
        }
    }
});

const transform = new Transform({
    defaultEncoding: 'utf8',
    encoding: 'utf8',
    highWaterMark: 2 * 1024,
    transform(chunk, encoding, done) {
        console.log('--', chunk.length);
        this.push(chunk.toString().toUpperCase());
        done();
    }
});

const logStream = new Writable({
    defaultEncoding: 'utf8',
    highWaterMark: 2 * 1024,
    write: function (chunk, encoding, done) {
        console.log('==', chunk.length);
        console.log(chunk);
        done();
    }
});


pipeline(randomString, transform, logStream, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('all ok');
})