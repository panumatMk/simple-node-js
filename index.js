const app = require('express')();
const cors = require('cors');
const PORT = process.env.PORT || 3333;

app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('hello world')
})

app.get('/tshirt', (req, res) => {
    res.status(200).send({
        tshirt: '',
        size: 'large'
    })
});

var clientId = 0;
var clients = {}; // <- Keep a map of attached clients

// Called once for each new client. Note, this response is left open!
app.get('/events/', function (req, res) {
    req.socket.setTimeout(Number.MAX_VALUE);
    res.writeHead(200, {
        'Content-Type': 'text/event-stream', // <- Important headers
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
    (function (clientId) {
        clients[clientId] = res; // <- Add this client to those we consider "attached"
        req.on("close", function () {
            delete clients[clientId]
        }); // <- Remove this client when he disconnects
    })(++clientId)
});

setInterval(function () {
    var msg = Math.random();
    // console.log("Clients: " + Object.keys(clients) + " <- " + msg);
    for (clientId in clients) {
        clients[clientId].write(`data: { value: ${msg} } \n\n`); // <- Push a message to a single attached client
    };
}, 2000);

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)
