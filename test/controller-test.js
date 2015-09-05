/**
 * Module dependencies.
 */

var async = require('async');
var rest = require('restler');
var Room = require('../models/rooms');
var api = require('../routes/index');

var server = require('../bin/www');

var API_URI = "http://localhost:3000/api"

var randomString = function () {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
}
var randomInteger = function () {
    return Math.floor((Math.random() * 10000000000) + 1);
}
describe('v1 rooms', function() {

    before(function(done) {
        // setup example data of rooms
        setTimeout(function(){
            for (var i =0; i < 100;  i ++ ) {
                setTimeout(function(){
                    var ranStr = randomString();
                    var dURL = "http://www." + ranStr;
                    var room = new Room({url: dURL, name:ranStr, author_id: randomInteger()});
                    room.save(function(){

                    });

                }, 300 * i)
            }

            setTimeout(function(){
                done();
            }, 30000);
        }, 300);
    });

    describe('POST /rooms', function(done) {
        it('should be 200 and return inserted a room', function(done) {
            rest.post(API_URI + "/rooms", {
                data: {
                    'url': "something url",
                    'name': "haha",
                    'author_id': randomInteger()
                }
            }).on('complete', function(data) {
                done();
            }).on('error', function(err){
                console.log(err);
                done();
            });

        });


    });

    describe('GET /', function(done) {

        it('should be 200 and return all rooms', function(done) {
            done();
        });
    });

    after(function(done) {
        done();
    });
});
