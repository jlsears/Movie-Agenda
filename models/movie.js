var mongoose = require('mongoose');

var movieSchema = mongoose.Schema({
    title: {type: String, required: true, default: ''},
    director: {type: String, required: false, default: ''},
    genre: {type: String, required: false, default: '' },
    theater: {type: String, required: false, default: '' },
    fellow_moviegoers: {type: String, required: false, default: '' },
    date_viewed: {type: Date, required: false, default: Date.now },
    seen: {type: Boolean, required: true, default: Date.now },
    favorite: {type: Boolean, required: true, default: false },
    user: {type: String, required: true}
});

var TheMovie = mongoose.model('TheMovie', movieSchema);

module.exports = TheMovie;
