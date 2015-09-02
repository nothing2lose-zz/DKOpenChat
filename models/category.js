var mongoose = require('mongoose');

var schema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: Number,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        required: false
    }
});

schema.pre('save', function(next) {
    this.created = new Date();
    next();
});

/**
 * Module exports.
 */

module.exports = mongoose.model('Category', schema, 'categories');
