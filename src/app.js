const express = require('express');

const app = express();


app.get('/getData',  (req, res) => {
    throw new Error("This is an error");
    // res.send('Data fetched successfully');
})

app.use('/', (err , req, res, next) => {
    if(err){
        console.log(err);
        res.status(500).send('something went wrong');
    }
});

app.listen(7777, () => {
    console.log('Server is successfully listening on port 7777');
})