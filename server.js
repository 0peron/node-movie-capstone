/*express resources*/
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var http = require('http');
var Users = require('./models/users');
var Movie = require('./models/movie');

/*api resources*/
var unirest = require('unirest');
var events = require('events');

/*db resources*/
var mongoose = require('mongoose');
var config = require('./config');


/*app settings*/
var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));


var server = http.Server(app);

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
}

var getMoviesApi = function(zipcode) {
    console.log(zipcode);
    var emitter = new events.EventEmitter();
    var d = new Date();
    var today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    unirest.get('http://data.tmsapi.com/v1.1/movies/showings?startDate=' + today + '&zip=' + zipcode + '&api_key=tyxufh9kubsvbjcety9axu6h')
        .end(function(response) {
            if (response.ok) {
                emitter.emit('end', response.body);
            }
            else {
                emitter.emit('error', response.code);
            }
        });
    return emitter;
};

app.get('/movies/:zip', function(req, res) {
    console.log(req.params.zip);
    var userzip = getMoviesApi(req.params.zip);

    userzip.on('end', function(movie) {
        if (typeof movie == undefined) {
            res.sendStatus(404);
        }
        else if (!movie) {
            res.sendStatus(404);
        }
        else if (movie.length == 0) {
            res.sendStatus(404);
        }
        else {
            res.json(movie);
        }
    });
    userzip.on('error', function(code) {
        res.sendStatus(code);
    });
});

// console.log(Users.schema);

app.post('/login', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var userName = req.body.userName;
    var password = req.body.password;
    var zipCode = req.body.zipCode;
    console.log(userName, password, zipCode);
    Users.findOne({
        userName: userName,
        password: password
    }, function(err, users) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if (!users) {
            //bad username
            return res.status(401).json({
                message: 'Not found'
            });
        }
        else {
            console.log('validatePassword');
            Users.schema.methods.validatePassword(password, function(err, isValid) {
                console.log(err, isValid, 'hello');
                if (err) {
                    console.log(err);
                }
                if (!isValid) {
                    return res.status(401).json({
                        message: 'Not found'
                    });
                }
                else {
                    console.log("User: " + userName + " logged in.");
                    return res.json(users);
                }
                //return something here

            });
        }
    });
});

///////////----Logout route----------/////////////////////////////
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


app.post('/users', function(req, res) {
    console.log(req.body.zipCode);
    var requiredFields = ['userName', 'password', 'zipCode'];
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (!(field in req.body)) {
            var message = 'Missing `' + field + '` in request body';
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Users.create({
        userName: req.body.userName,
        password: req.body.password,
        zipCode: req.body.zipCode
    }, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: err
            });
        }
        res.status(201).json(user);
    });

});

app.put('users/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        var message = (`Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        res.status(400).json({
            message: message
        });
    }

    var update = {};
    var updateableFields = ['password', 'zipCode'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            update[field] = req.body[field];
        }
    });
    Users
        .findByIdAndUpdate(req.params.id)
        .exec()
        .then(users => res.status(204).end())
        .catch(err => res.satuts(500).json({
            message: 'server error'
        }));
});

app.get('/populate-favorites', function(req, res) {
    console.log(req.params.name);
    Movie.find(function(err, movie) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(movie);
    });
});

app.post('/add-to-favorites', function(req, res) {
    console.log(req.body.name, req.body.idValue);
    var requiredFields = ['name', 'link'];
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (!(field in req.body)) {
            var message = 'Missing `' + field + '` in request body';
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Movie.create({
        name: req.body.name,
        link: req.body.link,
        idValue: req.body.idValue
    }, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: err
            });
        }
        res.status(201).json(user);
    });

});

app.delete('/delete-favorites', function(req, res) {
    console.log(req.body.idValue);
    Movie.find(function(err, movie) {
        if (err) {
            return res.status(404).json({
                message: 'item not found.'
            });
        }
        Movie.remove({
            idValue: req.body.idValue
        },
        function(){
            res.status(201).json(movie);
        });
    });
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});





/* STEP 4 - server settings*/
exports.app = app;
exports.runServer = runServer;
app.listen(process.env.PORT || 5000, process.env.IP);
