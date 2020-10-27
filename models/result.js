var mongoose = require('mongoose');

var ResultSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    films: [{
        title: String,
        tmdbId: String,
        poster_path: String,
    }]
},
{
    toJSON: {
        virtuals: true,
    }    
});

ResultSchema
    .virtual('url')
    .get(function () {
        return '/results/' + this._id;
    });

module.exports = mongoose.model('Result', ResultSchema);