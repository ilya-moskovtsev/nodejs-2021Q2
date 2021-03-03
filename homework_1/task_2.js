const path = require('path');
const fs = require('fs');
const csv = require('csvtojson');

const csvFilePath = path.join(process.cwd(), 'csv', 'nodejs-hw1-ex1.csv');
const readStream = fs.createReadStream(csvFilePath);
const writeStream = fs.createWriteStream('nodejs-hw1-ex2.txt');

readStream
    .on('error', err => console.error('Error in read stream...', err))
    .pipe(csv())
    .pipe(writeStream
        .on('error', err => console.error('Error in write stream...', err))
    );