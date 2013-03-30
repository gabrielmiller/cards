/**
* Basic settings
*/
var settings = require('./settings.js');

/**
* Initialize node modules
*/
var http = require('http')
  , express = require('express')
  , cons = require('consolidate')
  , swig = require('swig')
  , mongo = require('mongodb')
  , io = require('socket.io');
//  , assert = require('mongodb').assert

/**
* Initialize express and give it middleware
*/
var app = express()
    .use(express.favicon(settings.favicon_path))
    .use(express.logger('dev'))
    .use(express.static(settings.static_directory))
    .use(express.cookieParser())
    .use(express.session({ secret: settings.session_key }));

/**
* View settings
*/
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', settings.views_directory ); // Tells swig where to look for templates
swig.init({ root: settings.views_directory }); // Tells swig where to look for extended templates

/**
* Load the routes
*/
var routes = require(settings.project_directory + '/routes.js')(app);

/**
* Load the database
*/
//var database = require(settings.project_directory + '/database.js')(settings);

/**
* Start the app
*/
app.listen(settings.port);
console.log("Server is listening on port "+settings.port+".");

/**
* Load websockets
*/
var io_config = require(settings.project_directory + '/sockets.js')(settings);
