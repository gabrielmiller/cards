var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var crypto = require('crypto');

function http(express, app, settings, q, db) {

    app.use(express.static(__dirname + "/static"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    function signToken(username, res) {
        console.log("Signing token for user", username);
        var token = res.json({
            token: jwt.sign(username, settings.jwtSecret, {
                expiresInMinutes: 60*4 }
            )}
        );
    }

    app.post('/api/authenticate', function(req, res) {

        if (!("body" in req) || !("username" in req.body) || !("password" in req.body)) {
            res
                .status(400)
                .send("Invalid request.");
            return;
        }

        var getParams = [req.body.username];
        db.get("SELECT username, salt, hash FROM users WHERE username = (?)", getParams, function(err, row) {
            if (row) {
                validatePassword(row, req.body.password);
                return;
            }

            res
                .status(400)
                .send("Invalid credentials.");
        });

        function validatePassword(user, password) {
            var expectedHash = crypto
                .createHmac("sha1", user.salt)
                .update(password)
                .digest("hex");

            if (expectedHash !== user.hash) {
                res
                    .status(400)
                    .send("Invalid credentials.");
                return;
            }

            signToken(user.username, res);
        }

    });

    app.get('/api/user', expressJwt({secret: settings.jwtSecret}), function(req, res) {
        var users = [];

        db.each("SELECT rowid AS id, username FROM users", function(err, row) {
            users.push(row);
        }, function() {
            res.json(users);
        });
    });

    app.get('/api/user/authenticated', expressJwt({secret: settings.jwtSecret}), function(req, res) {
        console.log(req.user);
        res.json(true);
    });

    app.post('/api/user', function(req, res) {
        if (req.user) {
            res
                .status(403)
                .send("Authenticated users cannot create a new user.");
            return;
        }

        if (!("body" in req) || !("username" in req.body) || req.body.username.length < 1 || !("password" in req.body) || req.body.password.length < 1) {
            res
                .status(400)
                .send("Invalid request.");
            return;
        }

        var getParams = [req.body.username];
        db.get("SELECT username FROM users WHERE username = (?)", getParams, function(err, row) {
            if (!row) {
                createUser().then(function(user) {
                    signToken(req.body.username, res);
                    res
                        .status(204)
                        .send();
                }, function() {
                    res
                        .status(400)
                        .send("Invalid request.");
                });
                return;
            }

            res
                .status(400)
                .send("This username is already taken.");
            return;
        });

        function createUser() {

            var defer = q.defer();
            var hash,
                salt = makeSalt();

            hash = crypto
                .createHmac("sha1", salt)
                .update(req.body.password)
                .digest("hex");

            var params = [];
            params.push(req.body.username);
            params.push(hash);
            params.push(salt);

            db.serialize(function() {
                db.run("INSERT INTO users (username, hash, salt) VALUES (?, ?, ?)", params);
                db.get("SELECT salt, hash FROM users WHERE username = (?)", getParams, function(err, row) {
                    if (row) {
                        defer.resolve(row);
                    } else {
                        defer.reject();
                    }
                });
            });

            return defer.promise;;
        }

        function makeSalt() {
            var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var saltArray = [];
            for (var i=0; i < 32; i++) {
                saltArray.push(characters.charAt(Math.floor(Math.random() * characters.length)));
            }
            return saltArray.join("");
        }
    });

    app.all('*', function(req, res) {
        res.sendFile(__dirname + '/static/index.html');
    });
}

module.exports = http;
