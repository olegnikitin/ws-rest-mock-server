import WebSocket from 'ws';
import Utils from "./utils.mjs"

const wsFile = Utils.readFile('ws.json');

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
        const param = (data.payload && wsFile[endpoint][data.payload.result]) || null;
        if (param) {
            return ws.send(JSON.stringify({
                e: endpoint,
                data: param
            }));
        }
        ws.send(JSON.stringify({
            e: endpoint,
            data: {
                error: "There are no such WS endpoint or param"
            }
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
    console.log(`Available WSs: ${Object.keys(wsFile)}`);
    console.log('WS started');
    return wss;
}
