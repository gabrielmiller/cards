/**
* Load settings
*/
var Settings = require('./settings.js');
var settings = new Settings();
console.log("Settings loaded.");
var color = require(settings.colors_path);
console.log(color.red("C")+color.green("o")+color.yellow("l")+color.blue("o")+color.magenta("r")+color.cyan("s")+" l"+color.red("o")+color.green("a")+color.yellow("d")+color.blue("e")+color.magenta("d")+color.cyan("."));

/**
* Initialize node modules and express middleware
*/
var express = require('express');
var app = express();
app.use(express.static(__dirname + "/static"));
console.log(color.magenta("Express loaded."));

var server = require('http').createServer(app);
console.log(color.green("HTTP Server started."));

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
db.run("CREATE TABLE users (username VARCHAR(255) UNIQUE, salt VARCHAR(255), hash VARCHAR(255))");

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bodyParser = require('body-parser');

var crypto = require('crypto');
console.log(color.red("Crypto loaded."));

var q = require('q');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

function signToken(user, res) {
    var token = res.json({
        token: jwt.sign(user, settings.jwtSecret, {
            expiresInMinutes: 60*4 }
        )}
    );
}

app.post('/authenticate', function(req, res) {

    if (!("body" in req) || !("username" in req.body) || !("password" in req.body)) {
        res
            .status(400)
            .send("Invalid request.");
        return;
    }

    var getParams = [req.body.username];
    db.get("SELECT salt, hash FROM users WHERE username = (?)", getParams, function(err, row) {
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

        signToken(user, res);
    }

});

app.get('/user', expressJwt({secret: settings.jwtSecret}), function(req, res) {
    var users = [];

    db.each("SELECT rowid AS id, username FROM users", function(err, row) {
        users.push(row);
    }, function() {
        res.json(users);
    });
});

app.get('/user/authenticated', expressJwt({secret: settings.jwtSecret}), function(req, res) {
    res.json(true);
});

app.post('/user', function(req, res) {
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
                signToken(user, res);
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

var sio = require('socket.io').listen(server);
console.log(color.blue("Socket.io loaded."));
//var string = require('string');

/**
* Load the database and models
*/
//console.log("DB loaded.");

/**
* Load websockets
*/
//var sioconfig = require(settings.sockets_path)(settings, sio, app, models, string);
/*
var socket_authentication = require('socket.io-express').createAuthFunction(cookie_parser, redis_store);
io.set('authorization', function(handshake, callback){
    if (handshake.headers.cookie) {
        var sessionCookie = cookie.parse(handshake.headers.cookie)[settings.session_key];
        var sessionCookie = sessionCookie.slice(2);
        var sessionID = sessionCookie.slice(0,24);
        var sessionID_and_hash = sessionCookie;
        var sessionID_and_hash_rehashed = cookie_signature.sign(sessionID_and_hash, settings.session_secret).slice(0,111);
        if(sessionCookie == sessionID_and_hash_rehashed){
            session_store.get(sessionID, function(error, session) {
                if (error || !session) {
                    callback('Error: '+error, false);
                    console.log("Auth Error: "+error);
                } else {
                    handshake.session = session;
                    handshake.sessionID = sessionID;
                    //console.log("Socket.io auth from session successful.");
                    callback(null, true);
                }
            });
        }else{
        callback('Cookies didn\'t match', false);
        }
    } else {
        callback('No cookie', false);
    }
});
*/

/**
* Start the app
*/
server.listen(settings.port);

console.log(color.bold("========================================="));
console.log(color.green("HTTP")+" and "+color.red("Socket.io")+" are listening on port "+color.green(color.bold(settings.port))+".");
console.log(color.bold("========================================="));
