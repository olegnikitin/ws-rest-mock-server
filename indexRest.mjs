import express from 'express';
import Utils from "./utils.mjs";

const endpoints = Utils.readFile('rest.json');

const app = express();

for (let key in endpoints) {
    app.post(key, function (req, res) {
        const value = endpoints[key];
        const reqParam = (req.query && req.query.result) || null;
        if (reqParam && value[reqParam]) {
            return res.send(value[reqParam]);
        }
        res.status(400).send({error: "No such param"})
    });
    app.get(key, function (req, res) {
        const value = endpoints[key];
        const reqParam = (req.query && req.query.result) || null;
        if (reqParam && value[reqParam]) {
            return res.send(value[reqParam]);
        }
        res.status(400).send({error: "There are no such param"})
    });
}

export default function () {
    return app.listen(8044, function () {
        console.log(`Available endpoints: ${Object.keys(endpoints)}`);
        console.log('Rest started');
    });
}
