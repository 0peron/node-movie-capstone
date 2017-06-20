var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    idValue: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    }

});

var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
