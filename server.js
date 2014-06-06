var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

// Database
var mongoose = require('mongoose');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost:27017/homedb3';

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

var CollectionSchema = new Schema({
    listing_id: Number,
    photos: [{
        image_url: String,
        date_taken: Date,
        annotations: [{
            annotation: String,
            x_coord: Number,
            y_coord: Number
        }],
        comments: [{
            user: String,
            comment_date: Date,
            comment: String
        }]
    }],
});

var Collection = mongoose.model('Collection', CollectionSchema);

// ROUTES FOR OUR API
// =======================================================
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:7000/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


// on routes that end in /bears
// ----------------------------------------------
router.route('/collections')

    // create a Media item (accessed at POST http://localhost:5000/api/collections)
    .post(function(req, res) {

        var listing_collection = new Collection();
        listing_collection.listing_id = req.body.listing_id;
        listing_collection.photos = req.body.photos;
        listing_collection.comments = req.body.comments;

        // save the listing collection and check for errors
        listing_collection.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Media collection created!' });
        });

    })

    // get all the Listing Collections (accessed at GET http://localhost:5000/api/collections)
    .get(function(req, res) {

        Collection.find(function(err, collections) {
            if (err)
                res.send(err);
            res.json(collections);
        });
    });

router.route('/collections/:listing_id')

    // get the collection with that listing id (accessed at GET http://localhost:7000/api/collections/:listing_id)
    .get(function(req, res) {
        Collection.find({ "listing_id" : req.params.listing_id}, function(err, collection) {
            if (err)
                res.send(err);
            res.json(collection);
        });
    });

router.route('/collections/:listing_id/photos')
    // update the photos in this collection with this listing id (accessed at PUT http://localhost:7000/api/collections/:listing_id/photos)
    .post(function(req, res) {
        Collection.update({ "listing_id" : req.params.listing_id}, {$push: { photos: req.body.photos }}, function(err, collection) {
            if (err)
                res.send(err);
            res.json(collection);
        });
    });

router.route('/collections/:listing_id/photos/:index/comments')
    // update the comments in this collection with this listing id and photo id (accessed at PUT http://localhost:7000/api/collections/:listing_id/photos/:_id/comments)
    .post(function(req, res) {
        var myPush = {};
        myPush['photos['+req.params.index+'].comments'] = req.body.comments;
        Collection.update({ "listing_id": req.params.listing_id }, {$push: myPush}, function(err, collection) {
            if (err)
                res.send(err);
            res.json(collection);
        });
    });

/*
var app = express();

app.use(bodyParser());

// Make our DB accessible
app.use(function(req, res, next) {
    req.db = db;
    console.log('Tapping into the database.');
    next();
});

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

app.put('/api/media/:_id', function(req, res) {
    MediaModel.findById( req.params._id, function(err, images) {
        if (err)
            res.send(err);
        images.photos = req.body.photos;
        images.comments = req.body.comments;

        images.save(function (err) {
            if (err)
                res.send(err)
            res.json({ message: 'Listing photos updated!'});
        });
    });
});
*/

// REGISTER OUR ROUTES --------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =======================================================
app.listen(port);
console.log('Magic happens on port ' + port);
