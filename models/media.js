// models/media.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MediaSchema = new Schema({
    listing_id: Number,
    group_id: Number,
    media_info: [{
        date_taken: { type: Date, default: Date.now },
        item_url: String,
        comments: [{ body: String, user: String, x_coord: Number, y_coord: Number }],
    }]
});

module.exports = mongoose.model('Media', MediaSchema);
