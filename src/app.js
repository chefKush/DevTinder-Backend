const express = require('express');

const app = express();

app.use('/test', (req, res) => {
    res.send('Testing form the server!');
})

app.get('/user/:userId' , (req , res) => {
    console.log(req.params);
    res.send({firstName: 'Kush', lastName: 'Aish'})
})
  
app.post('/user', (req, res) => {
    res.send({message: 'User created successfully!'});
})

app.delete('/user', (req, res) => {
    res.send({message: 'User deleted successfully!'});
})

app.patch('/user', (req, res) => {
    res.send({message: 'User updated successfully!'});
})

app.listen(7777 , () => {
    console.log('Server is successfully listening on port 7777');
})