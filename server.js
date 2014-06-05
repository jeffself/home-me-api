var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// Database
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/homedb', {native_parser:true});

var routes = require('./routes/index');
//var media = require('./routes/media');

var app = express();

app.use(bodyParser());

var port = process.env.PORT || 7000;

// Make our DB accessible
app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use('/api', routes);
//app.use('/api/games', games);

app.listen(port);
