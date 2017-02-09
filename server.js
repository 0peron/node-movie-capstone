var express = require('express');
var http = require('http');
var unirest = require('unirest');
var events = require('events');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var users = require('./models/users');
app.use(bodyParser.json());
app.use(express.static('public'));
var config = require('./config');


var server = http.Server(app);

var runServer = function (callback) {
    mongoose.connect(config.DATABASE_URL, function (err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function () {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function (err) {
        if (err) {
            console.error(err);
        }
    });
};

var getMoviesApi = function (zipcode) {
    console.log(zipcode);
    var emitter = new events.EventEmitter();
    var d = new Date();
    var today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    unirest.get('http://data.tmsapi.com/v1.1/movies/showings?startDate=' + today + '&zip=' + zipcode + '&api_key=tyxufh9kubsvbjcety9axu6h')
        .end(function (response) {
            if (response.ok) {
                emitter.emit('end', response.body);
            } else {
                emitter.emit('error', response.code);
            }
        });
    return emitter;
};

var getTrailerApi = function (trailer) {
    console.log(trailer);
    var emit = new events.EventEmitter();
    unirest.get("https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + trailer + "&key=AIzaSyAb_vpzPd09vDWQAounmUNPVGPj-oLOxQc")
        .end(function (res) {
            if (res.ok) {
                emitter.emit('end', res.body);
            } else {
                emitter.emit('error', res.code);
            }
        });
    return emit;
}

var validateMovies = function (movies) {
    if (movies != '') {
        return movies;
    } else {
        return "-";
    }
};

var movieTheaters = [];

app.get('/movies/:zip', function (req, res) {
    console.log(req.params.zip);
    var userzip = getMoviesApi(req.params.zip);

    userzip.on('end', function (movie) {
        if (movie.length != 0) {
            res.json(movie);
        }
    });
    userzip.on('error', function (code) {
        res.sendStatus(code);
    });
});


app.get('/users', function (req, res) {
    console.log(req.params.body);
    var usersGet = getTrailerApi(req.params.body);

    usersGet.on('end', function (trailer) {
        if (trailer.length != 0) {
            res.json(trailer);
        }
    });
    usersGet.on('error', function (code) {
        res.sendStatus(code);
    });
});

app.post('/users', function (req, res) {
    var requiredFields = ['userName', 'password', 'zipCode'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const user = user.create({
        userName: req.body.userName,
        password: req.body.password,
        zipCode: req.body.zipcode
    });
    res.status(201).json(user);
})

//app.get('/trailers/:q', function (req, res) {
//    console.log(req.params.q);
//    var trailerGet = getTrailerApi(req.params.q);
//
//    trailerGet.on('end', function (trailer) {
//        if (trailer.length != 0) {
//            res.json(trailer);
//        }
//    });
//    trailerGet.on('error', function (code) {
//        res.sendStatus(code);
//    });
//});


app.use('*', function (req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});





/* STEP 4 - server settings*/
exports.app = app;
exports.runServer = runServer;
app.listen(process.env.PORT || 5000, process.env.IP);
