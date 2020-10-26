var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var httpErrors = require('http-errors-express').default;

var indexRouter = require('./routes/index');
var resultsRouter = require('./routes/results');
var searchRouter = require('./routes/search');

// load environment variables from .env
require('dotenv').config();
var app = express();

var environment = process.env.NODE_ENV;
var isDevelopment = environment === 'development';

// the origins that are allowed to make requests to the backend
var allowedOrigins = (function createAllowedOriginsArray () {
    var arr = ['https://mmboyce.github.io'];

    if (isDevelopment) {
        arr.push('http://192.168.1.226:3001');
    }

    return arr;
})();
console.log('Allowed origin = ' + (isDevelopment ? '*' : 'https://mmboyce.github.io'));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    }
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function redirectRequests(req, res, next) {
    if (!isDevelopment) {
        var callOrigin = req.headers['origin'];
        if (!allowedOrigins.includes(callOrigin)) {
            console.log('ORIGIN = ' + callOrigin);
            next(createError(403, 'Access not authorized.', {
                detail: {
                    'If you would like to see the backend source': 'Contact me.',
                }
            }));
        }
    }
    next();
});

app.use('/', indexRouter);
app.use('/results', resultsRouter);
app.use('/search', searchRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    if (isDevelopment) {
        next(createError(404));
    }
});

// Error handler
app.use(httpErrors());

module.exports = app;