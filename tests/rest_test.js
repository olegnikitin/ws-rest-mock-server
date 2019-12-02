const assert = require("assert");
const axios = require("axios");

describe("http", function () {
    it('should return success', async function () {
        const res = await axios("http://localhost:8044/login?result=ok");
        assert.deepStrictEqual(res.status, 200);
        assert.deepStrictEqual(res.statusText, "OK");
        assert.deepStrictEqual(res.data.ok.a, "b");
    });

    it('should return error', async function () {
        const res = await axios("http://localhost:8044/login?result=error");
        assert.deepStrictEqual(res.status, 200);
        assert.deepStrictEqual(res.data.error.message, "Some message");
    });
});