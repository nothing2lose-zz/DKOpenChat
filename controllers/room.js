var Room = require('../models/rooms');

var allRooms = function(cb) {
    Room.find({}).sort([['created', 'descending']]).exec(function(err, results) {
        cb(err, results);
    });
}

var createRoom =  function(name, url, cb) {
    var room = new Room({ name: name, url: url});
    room.save(function(err, result) {
        if (err) {
            if (err.code === 11000) {
                // duplicated
                var error = new Error("이미 존재하는 링크입니다.");
                cb(error, null);
            } else {
                cb(err, null);
            }
        } else {
            cb(null, room);
        }
    });
}
/**
 * Module exports.
 */

module.exports = {
    createRoom: createRoom,
    allRooms: allRooms
}
