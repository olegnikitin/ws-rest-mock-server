import WebSocket from 'ws';
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

const wss = new WebSocket.Server({
    port: 5080,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
    }
});

wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        let data;
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.error(e);
            return;
        }
        const endpoint = data.e;
        const code = data.payload && data.payload.code || 200;
        ws.send(JSON.stringify({
            e: endpoint,
            data: endpoints[endpoint][code]
        }));
    });

    ws.on('close', function close() {
        ws.send(JSON.stringify({
            "e": "disconnecting",
            "reason": "Wasting time",
            "time": Date.now()
        }))
    });

    console.log('connected');
    ws.send(JSON.stringify({
        "e": "connected"
    }));
});

export default function () {
    console.log('WS started');
    return wss;
}
