const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { Server } = require("socket.io");
const dotenv = require('dotenv')
const app = express();

dotenv.config()
app.use(cors())

app.use(express.static('/uploads'))

app.use(express.json())

const pollRouter = require('./routes/polls');
const userRouter = require('./routes/users');

app.use('/polls', pollRouter);
app.use('/users', userRouter);


mongoose.connect(process.env.DB_URL)
  .then(() => {

    console.log('MongoDb Connected')
  })
  .catch(err => {
    console.log(err.message)
  })


const server = app.listen(3000, () => {
  console.log('server started')
})

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('socket created')


  socket.on('vote', (optionid) => {
    io.emit('livepoll', optionid)
  })

})