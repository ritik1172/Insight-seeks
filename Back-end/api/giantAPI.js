require('dotenv').config();
const mongodbConnect = require('../db/database')

mongodbConnect().then(() => console.log("Connected to Mongodb"))
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit the application if MongoDB connection fails
});

const { createServer } = require('node:http');
const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors());
const port = process.env.PORT || 5000; // Change as per your configuration
const host = '0.0.0.0';
const User = require('../models/signup')

const server = createServer(app);

console.log("here is the server", server)
const { Server } = require('socket.io'); //1
console.log("Here is the Server", Server)

const io = require('socket.io')(server, {
    cors: {
      origin: process.env.REACT_APP_BASE_URL, // Replace with the actual origin of your React app
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
  });

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', async (msg) => {
        console.log('message: ', msg);
        const user = await User.findById({_id:msg.uid});
        const username = await user.fullname;
        const messageWithUser = await {
            body: msg.body,
            qid: msg.qid,
            user: username // Include user information
        };
        await io.emit('chat message', messageWithUser);
      });
  });

app.use(express.json())
app.use('/api',require('../routes/authentication'))
app.use('/',require('../routes/questionrequest'))


server.listen(port, host, ()=>{
    console.log(`Server Started on the port ${port}`)
})