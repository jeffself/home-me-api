var express = require('express');
var router = express.Router();
var Media = require('models/media');

router.route('/')

  // create some media
  .post(function(req, res) {
    var media = new Media();
    media.listing_id = req.body.listing_id;
    media.group_id = req.body.group_id;
    media.media_info.info.date_taken = req.body.media_info.info.date_taken;
    media.media_info.info.item_url = req.body.media_info.info.item_url;
    media.media_info.info.comments.body = req.body.media_info.info.comments.body;
    media.media_info.info.comments.user = req.body.media_info.info.comments.user;

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