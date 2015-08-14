var mongoose = require('mongoose'),
    Bike = mongoose.model('Bike'),
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require("fs"));

exports.get_bikes = (req, res, next) => {
  Bike.find().lean().exec()
  .then((bikes) => {
    return res.json(bikes);
  })
  .then(null, (err) => {
    return next(err);
  })
}

exports.add_bike = (req, res, next) => {
  var bike = {
    photo: req.body.photo,
    date: req.body.date,
    city: req.body.city,
    serial: req.body.serial,
    model: req.body.model,
    color: req.body.color,
    special: req.body.special
  }
  Bike.create(bike)
  .then((bike) => {
    return res.json(bike);
  })
  .then(null, (err) => {
    return next(err);
  })
}

exports.update_bike = (req, res, next) => {
  Bike.findByIdAndUpdate(req.params.id, req.body.update)
  .exec()
  .then((bike) => {
    return res.json(bike);
  })
  .then(null, (err) => {
    return next(err);
  })
}

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

var makeRand = (len) => {
  var res = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for( var i=0; i < len; i++ )
      res += possible.charAt(Math.floor(Math.random() * possible.length));

  return res;
}

exports.get_img = (req, res, next) => {
  var img = decodeBase64Image(req.body.img);
  var name = makeRand(6)+'.'+img.type.slice(6);
  var path = '/public/upload/'+name;
  fs.writeFileAsync(__dirname+path, img.data)
  .then(() => {
    res.json({url: 'http://localhost:1337/upload/'+name});
  })
  .catch((err) => {
    return next(err);
  })
}