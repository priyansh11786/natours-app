const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController')
const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')
const bookingRouter = require('./routes/bookingRoutes')


const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))


//HTTP security headers

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:', 'fonts.googleapis.com', 'fonts.gstatic.com'],
        scriptSrc: [
          "'self'",
          'https:',
          'http:',
          'blob:',
          'https://js.stripe.com',
          'https://m.stripe.network',
          'https://*.cloudflare.com',
          'https://unpkg.com/', 
          'https://tile.openstreetmap.org'
        ],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'", 'https://unpkg.com/','https://tile.openstreetmap.org', 'https://fonts.googleapis.com/' ],
        workerSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://m.stripe.network',
        ],
        childSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
        formAction: ["'self'"],
        connectSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.stripe.com',
          'https://*.cloudflare.com/',
          'https://bundle.js:*',
          'ws://127.0.0.1:*/',
          'https://unpkg.com/',
          'https://tile.openstreetmap.org'
        ],
      },
    },
  })
);



if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'))
}

//Rate Limiter middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again after 1 hour'
})
app.use('/api', limiter)

//Body-parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser())

app.use(compression())

app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);


app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find error ${req.originalUrl} on this server!`)
  // err.status='fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find error ${req.originalUrl} on this server!`, 404));
})


app.use(errorController)

module.exports = app;


