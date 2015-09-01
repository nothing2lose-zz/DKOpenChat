var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
    url: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: false
    }
});
roomSchema.pre('save', function(next) {
    this.created = new Date();
    next();
});

//roomSchema.index({ url: 1 }, { unique: true });
//roomSchema.index({ name: 1 }, { unique: true });

/* Disable auto indexing. */
// roomSchema.set('autoIndex', false);

/**
 * Module exports.
 */

module.exports = mongoose.model('Room', roomSchema, 'rooms');
