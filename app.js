const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io')
const morgan = require("morgan");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');
const conversationRouter = require('./routes/conversationRoutes');
const messageRouter = require('./routes/messageRoutes');

const app = express();
//! We Do this refactoring because socket.io expects a raw http server
const server = http.createServer(app)

//* Initiate a socketio 
const io = socketio(server)

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());

app.options('*', cors());

//* Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//* Body parser, reading data from body into req.body
app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//* COOKIE Parser,  For Authentication, we need to reed the JWT from the COOKIE using cookie-parser
app.use(cookieParser());

//* Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

//* Data Sanitization against XSS
app.use(xss());


//* Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

//* Compress all the texts that is sent to the client
app.use(compression());


app.use('/', viewRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);


//* Socket.io
let users = []

//* Push newly connected user
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

//* Remove disconnected user from socket.io
const removeUser = (socketId) => {
  users = users.filter(user=> user.socketId !== socketId)
}

//* Get user 
const getUser = (userId) => {
  return users.find(user => user.userId === userId)
}

//* Listen to socket.io
io.on('connection', (socket) => {

  //* Take userId and socketId from user and add to connected users Array
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    //* Send all connected users to everyone
    io.emit("getUsers", users)
  })

  //* Emit a welcome message when connecting to the websocket
  // socket.emit('message', 'Welcome to the chat')
  // socket.broadcast.emit("message", "New user has joined");



  //* receive the submitted message
  socket.on("submitMessage", (messageData, callback) => {
    //* Send back an acknowledgment, you can also use it to filter out messages like profanity
    // if (isProfane) {
    //   return callback("not delivered, because it's harmful");
    // }

    //* send message to the other client
    const user = getUser(messageData.receiverId);
    user && io.to(user.socketId).emit("sendBackMessage", messageData.message);
    callback("delivered");
  });



  //* When disconnect
  socket.on('disconnect', () => {
    //* You have also disconnect from socket io
    removeUser(socket.id)
    io.emit("getUsers", users);
  })
})




//* CATCH ALL ROUTES ERROR HANDLER
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404)); 
});

//* ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler);


module.exports = server;
