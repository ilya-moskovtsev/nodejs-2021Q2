import {pipeline} from "stream";
import path from "path";
import fs from "fs";
import csv from "csvtojson";

const csvFilePath = path.join(process.cwd(), 'csv', 'nodejs-hw1-ex1.csv');

pipeline(
    fs.createReadStream(csvFilePath),
    csv(),
    fs.createWriteStream('nodejs-hw1-ex2.txt'),
    (err) => {
        if (err) {
            console.error('Pipeline failed.', err);
        } else {
            console.log('Pipeline succeeded.');
        }
    }
);