const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();

app.use(express.json());

// post user
app.post('/signup', async (req, res) => {
    // creating a new instance of the User model
    const user = new User(req.body);
    // saving the user to the database
    try {
        await user.save()
        res.send('User created successfully');
    } catch (error) {
        console.error('Error saving user:', error);
    }
});

// get user by ID
app.get('/user', async (req, res) => {
    try {
        const userID = req.body.id;
        console.log(userID);
        const userData = await User.findById(userID);
        if (userData.length === 0) {
            res.status(404).send('User not found');
        }else{
            res.send(userData);
        }
    } catch (error) {
        res.status(400).send('something went wrong' );
        console.error('Error fetching user:', error);
    }
})



app.get('/feed', async (req, res) => {
    try {
        const allData = await User.find({})
        res.send(allData);
    } catch (error) {
        res.status(400).send('Error fetching data');
    }

})

// delete User
app.delete('/user', async (req, res) => {
    try {
        const userId = req.body.userId
        // const user = await User.findByIdAndDelete(userId)
        const user = await User.findByIdAndDelete({_id : userId})
        res.send('User Deleted Successfully')
        
    } catch (error) {
        res.status(400).send('something went wrong' );
        console.error('Error fetching user:', error);
    }
})

// Update User
app.patch('/user', async (req, res) => {
    try {
        const userId =  req.body.userId
        const updatedData = req.body;
        const user = await User.findByIdAndUpdate(userId, updatedData)
        console.log(user);
        res.send( user)
    } catch (error) {
         res.status(400).send('something went wrong' );
        console.error('Error fetching user:', error);
    }
})

connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(7777, () => {
        console.log('Server is successfully listening on port 7777');
    })
})
    .catch((error) => {
        console.error('Database connection failed:', error);
    });

