var express = require('express');
var router = express.Router();
var theMovieDb = require('../themoviedb/themoviedb');
var createError = require('http-errors');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({
      
    });        
});

router.get('/:query', searchForFilm, function (req, res, next) {
    res.json(res.queryResults);
});

async function searchForFilm(req, res, next) {
    theMovieDb.search.getMovie(
        {
            query: req.params.query,
            include_adult: false,
        },
        function successCallBack(results) {
            console.log('Successful query.');
            res.queryResults = JSON.parse(results);
            next();
        },
        function failureCallback(err) {
            next(createError(500, err.message));
        });
}

module.exports = router;
