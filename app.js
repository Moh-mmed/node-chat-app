// This file is only for Express

const path = require('path');
const express = require('express');
const morgan = require("morgan");

// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const cookieParser = require('cookie-parser');
// const compression = require('compression');
// const cors = require('cors');

// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errorController');
const chatRouter = require('./routes/chatRoutes');

const app = express();
// app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// app.use(cors());

// app.options('*', cors());

// app.use(helmet());
//* Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


//* Body parser, reading data from body into req.body
app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//* COOKIE Parser,  For Authentication, we need to reed the JWT from the COOKIE using cookie-parser
// app.use(cookieParser());

//* Data Sanitization against NoSQL query injection
// app.use(mongoSanitize());

//* Data Sanitization against XSS
// app.use(xss());


//* Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

//* Compress all the texts that is sent to the client
// app.use(compression());

//* Test middleware (we created it)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3. ROUTES

app.use('/', chatRouter);


// CATCH ALL ROUTES ERROR HANDLER
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `can't find ${req.originalUrl} on the server`,
  });

  // const err = new Error(`Can't find ${req.originalUrl} on the server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // next(new AppError(`Can't find ${req.originalUrl} on the server`, 404)); // ! if anything is passed to next() in error handling middleware, Express will know that it's an error, which it will skip all other errors in the Middleware stack and execute the one we defined below
});

// ERROR HANDLER MIDDLEWARE
// app.use(globalErrorHandler);

module.exports = app;
