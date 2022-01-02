import {Readable, Writable} from "stream";

const createTask = (taskName = '') => new Promise(resolve => {
    console.log('start task', taskName);
    setTimeout(() => resolve(taskName), 1000 + Math.floor(Math.random() * 2000))
});


let taskNumber = 0;
const newTaskStream = new Readable({
    objectMode: true,
    read: function () {
        console.log('read', taskNumber);
        this.push(createTask.bind(null, `task_${taskNumber++}`));
        if (taskNumber > 10) {
            this.push(null)
        }
    }
});

const MAX_CONCURRENT = 2;
let current = 0;
const taskRunner = new Writable({
    objectMode: true,
    write: function (task, encoding, done) {
        current++;
        task().then(result => {
            console.log('write result', result);
            current--;
            done();
        });

        if (current < MAX_CONCURRENT) {
            done();
        }
    }
});

newTaskStream.pipe(taskRunner);