import rest from './indexRest.mjs'
import ws from './indexWs.mjs'

const wsServer = ws();
const restServer = rest();

process.on('SIGINT', function () {
    wsServer.clients.forEach(conn => conn.terminate());
    wsServer._server.close(() => console.log("WS closed"));
    restServer.close(() => console.log("REST closed"));
});
