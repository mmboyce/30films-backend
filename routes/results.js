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

router.delete('/:id', getResult, async function (req, res, next) {
    var isDevelopment = process.env.NODE_ENV === 'development';
    if(isDevelopment){
        try {
            await res.result.remove();
            res.json({ message: 'Deleted Result' });
        } catch (err) {
            next(createError(500, err.message));
        }
    } else {
        next(createError(403, 'Contact me if you would like your submission removed.'));
    }
});

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
