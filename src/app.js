const express = require('express');

const app = express();

app.use('/user', (req, res , next) => {
    console.log('Route handler 1');
    // res.send('Route handler 1 response');
    next();
}, (req, res , next) => {
    console.log('Route handler 2')
    // res.send('Route handler 2 response');
    next();
}, (req, res , next) => {
    console.log('Route handler 3')
    res.send('Route handler 3 response');
    // next();
})

app.listen(7777 , () => {
    console.log('Server is successfully listening on port 7777');
})