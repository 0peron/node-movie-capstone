var {BasicStrategy} = require('passport-http');
var express = require('express');
var jsonParser = require('body-parser').json();
var passport = require('passport');

var {
    User
} = require('./models/users');

var router = express.Router();

router.use(jsonParser);


var strategy = new BasicStrategy(
    (userName, passwords, cb) => {
        User
            .findOne({
                userName
            })
            .exec()
            .then(user => {
                if (!user) {
                    return cb(null, false, {
                        message: 'Incorrect userName'
                    });
                }
                if (user.passwords !== passwords) {
                    return cb(null, false, 'Incorrect password');
                }
                return cb(null, user);
            })
            .catch(err => cb(err));
    });

passport.use(strategy);


router.post('/', (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: 'No request body'
        });
    }

    if (!('userName' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: userName'
        });
    }

    let {
        userName,
        passwords,
        zipCode
    } = req.body;

    if (typeof userName !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: userName'
        });
    }

    userName = userName.trim();

    if (userName === '') {
        return res.status(422).json({
            message: 'Incorrect field length: userName'
        });
    }

    if (!(passwords)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    if (typeof passwords !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    passwords = passwords.trim();

    if (passwords === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    return User
        .find({
            userName
        })
        .count()
        .exec()
        .then(count => {
            if (count > 0) {
                return res.status(422).json({
                    message: 'userName already taken'
                });
            }
            return User.hashPassword(passwords)
        })
        .then(hash => {
            return User
                .create({
                    userName: userName,
                    passwords: hash,
                    zipCode: zipCode
                })
        })
        .then(user => {
            return res.status(201).json(user.apiRepr());
        })
        .catch(err => {
            res.status(500).json({
                message: 'Internal server error'
            })
        });
});


var basicStrategy = new BasicStrategy(function(userName, passwords, callback) {
    let user;
    User
        .findOne({
            userName: userName
        })
        .exec()
        .then(_user => {
            user = _user;
            if (!user) {
                return callback(null, false, {
                    message: 'Incorrect userName'
                });
            }
            return user.validatePassword(passwords);
        })
        .then(isValid => {
            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password'
                });
            }
            else {
                return callback(null, user)
            }
        });
});


passport.use(basicStrategy);
router.use(passport.initialize());

router.get('/users',
    passport.authenticate('basic', {
        session: false
    }), (req, res) => res.json({
        user: req.user.apiRepr()
    })
);


module.exports = {
    router
};
