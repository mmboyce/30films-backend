var express = require('express');
var router = express.Router();
var Result = require('../models/result');
var createError = require('http-errors');

/* GET home page. */
router.get('/', async function (req, res, next) {
    try {
        var results = await Result.find({}, {films: 0 });
        var count = results.length;
        
        res.json({
            count,
            results
        });
    } catch (err) {
        next(createError(500, err.message));
    }
});

router.get('/:id', getResult, function (req, res, next) {
    res.json(res.result);
});

router.post('/', async function (req, res, next) {
    var result = new Result({
        name: req.body.name,
        films: req.body.films,
    });

    try {
        var newResult = await result.save();
        res.status(201).json(newResult);
    } catch (err) {
        next(createError(400, err.message));
    }
});

router.patch('/:id', getResult, restrictToDevelopment, async function (req, res, next) {  
    try {
        // A patch request may upadte the name or film list.
        if (req.body.name) {
            res.result.name = req.body.name;
        }

        if (req.body.films) {
            res.result.films = req.body.films;
        }

        var newResult = await res.result.save();

        res.status(200).json(newResult);
    } catch (err) {
        next(createError(400, err.message));
    }
});

router.delete('/:id', getResult, restrictToDevelopment, async function (req, res, next) {
    try {
        await res.result.remove();
        res.json({ message: 'Deleted Result' });
    } catch (err) {
        req.method;
        next(createError(500, err.message));
    }
});

function restrictToDevelopment(req, res, next) {
    var isDevelopment = process.env.NODE_ENV === 'development';

    const errMsg = (function createErrorMessageFromRequestMethod() {
        let output;
        
        switch (req.method) {
            case 'GET':
                output = 'Contact me if you would like to access this submission.';
                break;
            case 'POST':
                output = 'Contact me if you would like to submit this.';
                break;
            case 'PUT':
            case 'PATCH':
                output = 'Contact me if you would like to update your submission.';
                break;
            case 'DELETE':
                output = 'Contact me if you would like your submission removed.';
                break;
            default:
                output = 'Contact me if you would like this request to be made.';
        }
    
        return output;
    }());
    
    if (isDevelopment) {
        next();       
    } else {
        next(createError(403, errMsg));
    }
}

async function getResult(req, res, next) {
    var result;

    try {
        result = await Result.findById(req.params.id);
        if (result === null) {
            return next(createError(404, 'Cannot find result'));
        }
    } catch (err) {
        if (err.name === 'CastError') {
            return next(createError(404, 'Cannot find result'));
        } else {
            return next(createError(400, err.message));
        }
    }

    res.result = result;
    next();
}

module.exports = router;
