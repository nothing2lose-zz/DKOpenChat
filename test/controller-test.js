/**
 * Module dependencies.
 */

var async = require('async');
var rest = require('restler');
var Room = require('../models/rooms');
var api = require('../routes/index');

var server = require('../bin/www');

var API_URI = "http://127.0.0.1:3000"

describe('v1 rooms', function() {

    before(function(done) {
        // setup example data of rooms
        setTimeout(function(){
            done();
        }, 300);
    });

    describe('POST /rooms', function(done) {
        it('should be 200 and return inserted a room', function(done) {
            rest.post(API_URI + "/rooms", {
                data: {
                    'url': "something url",
                    'name': "haha"
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
