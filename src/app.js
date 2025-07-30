const express = require('express');

const app = express();
const {adminAuth , userAuth} = require('./middlewares/auth');

app.use('/admin', adminAuth)

app.get('/admin/getAllData', (req, res) => {
    res.send('All Data Retrieved')
})

app.get('/admin/deleteData', (req, res) => {
        res.send('Deleted Data Successfully')
})

app.post('/user/login' , (req, res) => {
    res.send('User Logged In Successfully')
})

app.get('/user/getData', userAuth, (req, res) => {
    res.send('User Data Retrieved Successfully')
})

app.listen(7777, () => {
    console.log('Server is successfully listening on port 7777');
})