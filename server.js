/**
* Load settings
*/
var Settings = require('./settings.js');
var settings = new Settings();
console.log("Settings loaded.");
var color = require(settings.colors_path);
console.log(color.fgred+"C"+color.fggreen+"o"+color.fgyellow+"l"+color.fgblue+"o"+color.fgmagenta+"r"+color.fgcyan+"s "+color.fgwhite+"l"+color.fgred+"o"+color.fggreen+"a"+color.fgyellow+"d"+color.fgblue+"e"+color.fgmagenta+"d"+color.fgcyan+"."+color.reset);

/**
* Initialize node modules and express middleware
*/
var express = require('express');
var app = express();
app.use(express.static(__dirname + "/static"));
console.log(color.fgmagenta+"Express loaded."+color.reset);

var server = require('http').createServer(app);
console.log(color.fggreen+"HTTP Server started."+color.reset);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
db.run("CREATE TABLE users (username VARCHAR(255) UNIQUE, salt VARCHAR(255), hash VARCHAR(255))");

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bodyParser = require('body-parser');

var crypto = require('crypto');
console.log(color.fggreen+"Crypto loaded."+color.reset);

//app.use('/user', expressJwt({secret: settings.jwtSecret}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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

    function signToken(user) {
        var token = res.json({
            token: jwt.sign(user, settings.jwtSecret, {
                expiresInMinutes: 60*4 }
            )}
        );
    }

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

        signToken(user);
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
            createUser();
            return;
        }

        res
            .status(400)
            .send("This username is already taken.");
        return;
    });

    function createUser() {
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

        db.run("INSERT INTO users (username, hash, salt) VALUES (?, ?, ?)", params);

        res
            .status(204)
            .send();
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

//var sio = require('socket.io').listen(server);
//console.log(color.fgcyan+"Socket.io loaded."+color.reset);
//var string = require('string');

/**
* Load the database and models
*/
//console.log(color.fgwhite+"DB loaded."+color.reset);

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

console.log(color.fgwhite+color.bold+"========================================="+color.reset);
console.log(color.fgwhite+"Running release number "+color.bold+settings.context.version+color.reset);
console.log(color.fggreen+"HTTP"+color.reset+" and "+color.fgred+"Socket"+color.reset+" servers are listening on port "+color.fggreen+color.bold+settings.port+color.reset+".");
console.log(color.fgwhite+color.bold+"========================================="+color.reset);
