var mongoose = require('mongoose'),
    BikeSchema = require('./BikeSchema');

// configure mongoose schemas
var configure = () => {
  mongoose.model('Bike', BikeSchema);
  mongoose.connect('mongodb://127.0.0.1/bs');
}

module.exports = configure;