import {Readable} from 'stream'

class RandomNumStream extends Readable {
    constructor(props) {
        super(props);
        this.numbersLimit = Math.floor(10 + 15 * Math.random());
        if (props && props.numbersLimit) {
            let n = parseInt(props.numbersLimit);
            if (!isNaN(n) && n > 0) {
                this.numbersLimit = n;
            }
        }
        console.log('num limit', this.numbersLimit);
    }

    _pushNumber() {
        const num = Math.floor(Math.random() * 10);
        console.log(this.numbersLimit--, 'left to generate');
        this.push(this.readableObjectMode ? {num} : num.toString());
    }

    _read(size) {
        const genSize = Math.min(this.numbersLimit, 5, size);
        for (let i = 0; i < genSize; i++) {
            this._pushNumber();
        }
        if (this.numbersLimit <= 0) {
            this.push(null);
        }
    }

}

export default RandomNumStream;