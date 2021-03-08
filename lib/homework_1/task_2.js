import {pipeline, Transform} from "stream";
import path from "path";
import fs from "fs";
import csv from "csvtojson";
import os from "os";

const csvFilePath = path.join(process.cwd(), 'csv', 'nodejs-hw1-ex1.csv');

pipeline(
    fs.createReadStream(csvFilePath),
    csv(),
    new Transform({
        transform(chunk, encoding, callback) {
            const {['Amount']: remove, ...rest} = JSON.parse(chunk.toString());
            callback(null, Buffer.from(JSON.stringify(rest) + os.EOL));
        }
    }),
    fs.createWriteStream('nodejs-hw1-ex2.txt'),
    (err) => {
        if (err) {
            console.error('Pipeline failed.', err);
        } else {
            console.log('Pipeline succeeded.');
        }
    }
);