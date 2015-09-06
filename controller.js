var Promise = require('bluebird'),
    mongoose = Promise.promisifyAll(require('mongoose')),
    Bike = mongoose.model('Bike'),
    fs = Promise.promisifyAll(require("fs")),
    _ = require('lodash');

exports.get_bikes = Promise.coroutine(function * (req, res, next) {
  try {
    var bikes = yield Bike.findAsync();
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
  // var img = decodeBase64Image(req.body.img);
  // var name = makeRand(6)+'.'+img.type.slice(6);
  // var path = '/public/upload/'+name;
  // fs.writeFileAsync(__dirname+path, img.data)
  // .then(() => {
  //   res.json({url: 'http://localhost:1337/upload/'+name});
  // })
  // .catch((err) => {
  //   return next(err);
  // })
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