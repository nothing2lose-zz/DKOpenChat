var express = require('express');
var router = express.Router();

var roomCtrler = require('../controllers/room');
var categoryCtrler = require('../controllers/category');

var Room = require('../models/rooms');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

// route categories
router.get('/api/categories', function (req, res) {
    categoryCtrler.allCategories(function (err, results) {
        if (null === err) {
            res.status(200).send(JSON.stringify(results));
        } else {
            res.status(500).send(err.message);
        }
    })
});

// route rooms
router.get('/api/rooms', function (req, res) {
    var categoryType = req.query.category_type;
    if (categoryType === undefined || 0  == categoryType) {
        roomCtrler.allRooms(function (err, results) {
            if (null === err) {
                res.status(200).send(JSON.stringify(results));
            } else {
                res.status(500).send(err.message);
            }
        });

    } else {
        roomCtrler.allRoomsByCategoryType(categoryType, function (err, results) {
            if (null === err) {
                res.status(200).send(JSON.stringify(results));
            } else {
                res.status(500).send(err.message);
            }
        });
    }

});

router.post('/api/rooms', function (req, res) {
    var name = req.body.name;
    var url = req.body.url;
    var categoryType = req.body.category_type;
    roomCtrler.createRoom(name, url, categoryType, function (err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send(JSON.stringify(result));
        }
    });
});


// TODO?
router.get('/oauth', function (req, res, next) {
    console.log("======= called!");
    res.send(200);
});

router.post('/oauth', function (req, res, next) {
    console.log("======= called!");
    res.send(200);
});


module.exports = router;
