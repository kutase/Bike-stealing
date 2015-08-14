var mongoose = require('mongoose');
var Bike = mongoose.model('Bike');

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

exports.get_img = (req, res, next) => {
  console.log(req.files);
  res.json({status: 'File was successfully uploaded.'})
}