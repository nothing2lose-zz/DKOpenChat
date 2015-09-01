/**
 * Created by nothing on 15. 9. 1..
 */
var express = require('express');
// create a router
var router = express.Router();

var Room = require('../models/rooms');

router.get('/', function(req, res) {
    Room.find({}).sort([['created', 'descending']]).exec(function(err, results) {
        res.send(200, JSON.stringify(results));
    });
});

/**
 * Module exports.
 */

module.exports = router;
