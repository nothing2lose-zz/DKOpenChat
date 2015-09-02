var mongoose = require('mongoose');

var schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: Number,
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

//roomSchema.index({ url: 1 }, { unique: true });
//roomSchema.index({ name: 1 }, { unique: true });

/* Disable auto indexing. */
// roomSchema.set('autoIndex', false);

/**
 * Module exports.
 */

module.exports = mongoose.model('Category', schema, 'rooms');
