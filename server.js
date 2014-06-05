var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');

// Database
var mongoose = require('mongoose');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost:27017/homedb2';

// The http server will listen to an appropriate port, or default to
// port 5000.
var port = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
var db = mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

var Schema = mongoose.Schema;

var MediaSchema = new Schema({
    listing_id: Number,
    group_id: Number,
    photos: [{
        image_url: String,
        date_taken: Date,
        annotations: [{
            annotation: String,
            x_coord: Number,
            y_coord: Number
        }]
    }],
    comments: [{
        user: String,
        comment_date: Date,
        comment: String
    }]
});

var MediaModel = mongoose.model('Media', MediaSchema);

//var routes = require('./routes/index');
//var media = require('./routes/media');

var app = express();

app.use(bodyParser());

// Make our DB accessible
app.use(function(req, res, next) {
    req.db = db;
    console.log('Tapping into the database.');
    next();
});

//app.use('/api', routes);
//app.use('/api/media', media);

app.post('/api/media', function(req, res) {
    var media = new MediaModel();
    media.listing_id = req.body.listing_id;
    media.group_id = req.body.group_id;
    media.photos = req.body.photos;
    media.comments = req.body.comments;
    console.log("Comment:" + JSON.stringify(req.body));
    // save the media information and check for errors
    media.save(function (err) {
      if (err)
        res.send(err);
      res.json({ message: 'Media Information created!' });
    });
});

app.get('/api/media', function(req, res) {
    return MediaModel.find(function(err, images) {
      if (err)
        res.send(err);
      res.json(images);
    });
});

app.get('/api/media/listing/:listing_id', function(req, res) {
    MediaModel.find( {"listing_id" : req.params.listing_id }, function(err, images) {
      if (err)
        res.send(err);
      res.json(images);
    });
});

app.listen(port);
console.log('Magic happens on port ' + port);