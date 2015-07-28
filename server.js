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
var db = new sqlite3.Database('cards');

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var bodyParser = require('body-parser');

//app.use('/user', expressJwt({secret: settings.jwtSecret}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/authenticate', function(req, res) {
    if (!(req.body.username === "test" && req.body.password === "test")) {
        console.log("Could not authenticate");
        res
            .status(401)
            .send("Wrong username or password");
        return;
    }

    console.log("Authenticating");

    var user = {
        id: 1,
        password: "test",
        username: "test"
    };

    var token = jwt.sign(user, settings.jwtSecret, { expiresInMinutes: 60*4 });

    res.json({ token: token });
});

app.get('/user', expressJwt({secret: settings.jwtSecret}), function(req, res) {
    console.log("user calling is", req.user);
    res.json("hello");
});

app.get('/user/authenticated', expressJwt({secret: settings.jwtSecret}), function(req, res) {
    res.json(true);
});

app.post('/user', function(req, res) {
    console.log("user POSTing is", req.user);
    if (req.user) {
        res
            .status(403)
            .send("Authenticated users cannot create a new user.");
        return;
    }

    if (!("body" in req) || !("username" in req.body) || !("password" in req.body)) {
        res
            .status(400)
            .send("Invalid request.");
        return;
    }

    var hash,
        salt;

    hash = "hamburger";
    salt = "hotdog";

    var params = [];
    params.push(req.body.username);
    params.push(hash);
    params.push(salt);

    db.run("INSERT INTO cards.users (username, hash, salt) VALUES (?, ?, ?)");

    var user = {
        password: req.body.password,
        username: req.body.username,
    };

    res
        .status(200)
        .send(user);
});

//var sio = require('socket.io').listen(server);
//console.log(color.fgcyan+"Socket.io loaded."+color.reset);
//var crypto = require('crypto');
//console.log(color.fggreen+"Crypto loaded."+color.reset);
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
