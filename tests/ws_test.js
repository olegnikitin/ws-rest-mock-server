const WebSocket = require("ws");
const assert = require("assert");

describe("WS", function () {
    const ws = new WebSocket('ws://localhost:5080');

    beforeEach(done => setTimeout(done, 500));

    after(function () {
       ws.close(1000, "ws test client closed");
    });

    it('should return success', function () {
        ws.send('{"e": "rpc", "payload": {"result": "ok"}}');
        ws.once("message", message => {
            assert.ok(message);
            assert.deepStrictEqual(JSON.parse(message).data.ok.a, "b");
        })
    });

    it('should return failure', function () {
        ws.send('{"e": "rpc", "payload": {"result": "error"}}');
        ws.once("message", message => {
            assert.ok(message);
            assert.deepStrictEqual(JSON.parse(message).data.error.message, "Some message");
        })
    });
});