const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');
const http = require('http');
const cors = require('cors');
const initializeSocket = require('./utils/socket');
const chatRouter = require('./routes/chat');
require('dotenv').config()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter)
app.use('/', chatRouter)

const server = http.createServer(app);
initializeSocket(server);



const port = process.env.port
connectDB().then(() => {
    console.log('Database connected successfully');
    server.listen(port, () => {
        console.log(`Server is successfully listening on port ${port}`);
    })
})
    .catch((error) => {
        console.error('Database connection failed:', error);
    });

