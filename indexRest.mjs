import express from 'express';
import fs from "fs";

const path = '/data/endpoints.json';

let endpointsFile;

try {
    if (fs.existsSync(process.env['HOME'] + '/endpoints.json')) {//local
        endpointsFile = fs.readFileSync(process.env['HOME'] + '/endpoints.json', {encoding: 'utf8'});
    } else if (fs.existsSync(path)) {//docker
        endpointsFile = fs.readFileSync(path, {encoding: 'utf8'});
    } else {
        console.error("There are no such file with endpoints like it's required");
        process.exit(1);
    }
} catch(err) {
    console.error(err)
}

const endpoints = JSON.parse(endpointsFile);

const app = express();

for (let key in endpoints) {
    app.post(key, function (req, res) {
        const value = endpoints[key];
        const code = (req.query && req.query.code) || 200;
        res.send(value[code]);
    });
    app.get(key, function (req, res) {
        const value = endpoints[key];
        const code = (req.query && req.query.code) || 200;
        res.send(value[code]);
    });
}

export default function () {
    return app.listen(8044, function () {
        console.log('Rest started');
        console.log(`Available endpoints: ${Object.keys(JSON.parse(endpointsFile))}`);
    });
}
