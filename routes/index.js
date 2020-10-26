var express = require('express');
var router = express.Router();
var theMovieDb = require('../themoviedb');

/* GET home page. */
router.get('/', function (req, res, next) {
    var isDevelopment = process.env.NODE_ENV === 'development';
    var PORT = 3000;
    
    function formatRouteNameOnEnvironment ( route) {
        if (isDevelopment) { 
            return `http://${req.hostname}:${PORT}/${route}`;
        }

        return `https://${req.hostname}/${route}`;
    }

    var routes = {
        search: formatRouteNameOnEnvironment( 'search'),
        results: formatRouteNameOnEnvironment( 'results')
    };

    res.json(routes);        
});

module.exports = router;
