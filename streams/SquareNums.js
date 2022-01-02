import {Transform} from 'stream'

export default class SquareNums extends Transform {
    constructor(props) {
        super(props);
    }

    _transform(chunk, encoding, callback) {
        let num = this.readableObjectMode ? chunk.num : parseInt(chunk);
        this.push(this.writableObjectMode ? {num: Math.pow(num, 2)} : Math.pow(num, 2).toString());
        callback();
    }
}