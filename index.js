const app = require('express')();
const PORT = process.env.PORT || 3333;

app.get('/', (req, res) => {
    res.status(200).send('hello world')
})

app.get('/tshirt', (req, res) => {
    res.status(200).send({
        tshirt: '',
        size: 'large'
    })
});

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)
