var express = require('express');
var router = express.Router();

var roomCtrler = require('../controllers/room');
var categoryCtrler = require('../controllers/category');

var Room = require('../models/rooms');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.use('/api/rooms', roomCtrler);
router.use('/api/category', categoryCtrler);

router.post('/rooms', function(req, res, nexst) {
  var name = req.body.name;
  var url = req.body.url;
  var room = new Room({ name: name, url: url});
  room.save(function(err, result) {
    if (err) {
      if (err.code === 11000) {
        // dupplicated
        res.status(err.status || 500);
        res.render('error', {
          message: "이미 존재하는 링크입니다",
          error: err
        });
      } else {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      }
    } else {
      res.redirect('/');
      //res.send(200, JSON.stringify(result));
    }
  });
});

module.exports = router;
