var express = require('express');
var router = express.Router();
var Media = require('media');

router.route('/')

  // create some media
  .post(function(req, res) {
    var media = new Media();
    media.listing_id = req.body.listing_id;
    media.group_id = req.body.group_id;
    media.photos = req.body.photos;
    console.log("Comment:" + JSON.stringify(req.body));
    // save the media information and check for errors
    media.save(function (err) {
      if (err)
        res.send(err);
      res.json({ message: 'Media Information created!' });
    });
  })

  // get all the media
  .get(function(req, res) {
    Media.find(function(err, images) {
      if (err)
        res.send(err);
      res.json(images);
    });
  });

module.exports = router;