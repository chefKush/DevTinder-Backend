const express = require('express');

const app = express();


app.get('/hello', (req, res) => {
    res.send('Hello form the server!');
})

app.use('/test', (req, res) => {
    res.send('Testing form the server!');
})

app.use('/', (req, res) => {
    res.send('Namaste!');
})

app.listen(7777 , () => {
    console.log('Server is successfully listening on port 7777');
})