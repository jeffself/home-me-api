// models/media.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MediaSchema = new Schema({
    listing_id: Number,
    group_id: Number,
    photos: [{
        image_url: String,
        date_taken: Date,
        comments: [{
            comment: String,
            user: String,
            x_coord: Number,
            y_coord: Number
        }]
    }]
});

module.exports = mongoose.model('Media', MediaSchema);
