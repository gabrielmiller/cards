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

//var sio = require('socket.io').listen(server);
//console.log(color.fgcyan+"Socket.io loaded."+color.reset);
//var crypto = require('crypto');
//console.log(color.fggreen+"Crypto loaded."+color.reset);
//var string = require('string');

/**
* Load the database and models
*/
//var mongoose = require('mongoose');
//console.log(color.fgwhite+"DB loaded."+color.reset);
//mongoose.connect(settings.database_host+":"+settings.database_port+"/"+settings.mongodb_database_name, settings.mongodb_options);
//console.log(color.bgwhite+color.fgblack+"DB connected."+color.reset);
//var models = require(settings.models_path)(mongoose, settings);
//console.log(color.fgblue+"Models loaded."+color.reset);

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
