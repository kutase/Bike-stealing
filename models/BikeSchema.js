var mongoose = require('mongoose');

var BikeSchema = new mongoose.Schema({
  photo: String,
  date: Date,
  city: String,
  serial: {type: String, unique: true},
  model: String,
  color: String,
  special: String
});

module.exports = BikeSchema;