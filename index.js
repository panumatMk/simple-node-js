const app = require('express')();
const cors = require('cors');
const PORT = process.env.PORT || 3333;

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
