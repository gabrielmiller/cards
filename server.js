/**
* Load settings
*/
var Settings = require('./settings.js');
var settings = new Settings();
var color = require(settings.colors_path);

/**
* Initialize DB
*/
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
db.run("CREATE TABLE users (username VARCHAR(255) UNIQUE, salt VARCHAR(255), hash VARCHAR(255))");

/**
* Initialize q
*/
var q = require('q');

/**
* Configure HTTP endpoints
*/
var express = require('express');
var app = express();
var routes = require('./routes.js')(express, app, settings, q, db);
var server = require('http').createServer(app);
//var string = require('string');

/**
* Configure websockets
*/
var socketIo = require('socket.io').listen(server);
var socketIoConfig = require(settings.sockets_path)(settings, socketIo);

/**
* Start the app
*/
server.listen(settings.port);

console.log(color.bold("========================================="));
console.log(color.green("HTTP")+" and "+color.red("Socket.io")+" are listening on port "+color.green(color.bold(settings.port))+".");
console.log(color.bold("========================================="));
