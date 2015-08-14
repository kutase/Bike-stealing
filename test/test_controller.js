var request = require('request'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser');

const PORT = 8080;

var BikeSchema = new mongoose.Schema({
  photo: String,
  date: Date,
  city: String,
  serial: {type: String, unique: true},
  model: String,
  color: String,
  special: String
})

var Bike = mongoose.model('Bike', BikeSchema);

mongoose.connect('mongodb://127.0.0.1/test');

var controller = require('../controller');

var router = express.Router();

router.route('/bikes')
  .get(controller.get_bikes)
  .post(controller.add_bike)
  .put(controller.update_bike)
  .delete(controller.del_bike);

var errHandle = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({status: 'fail', err: err});
  return next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errHandle);
app.use(router);

http.listen(PORT);

describe('Controller', function() {

  before((done) => {
    Bike.remove()
    .then(() => {
      done();
    })
  })

  after((done) => {
    mongoose.disconnect(() => {
      http.close();
      done();
    });
  });

  describe('HTTP request for /bikes', () => {
    it('GET /bikes должен возвращать список всех велосипедов', (done) => {
      var test_bikes = [{
        photo: 'http://bikes.com/mongoose.jpg',
        date: Date('25-05-2015'),
        city: 'Ekb',
        serial: '4657BS72D',
        model: 'Mongoose Meteore Comp',
        color: 'Green',
        special: 'New bike for $2k'      
      },{
        photo: 'http://bikes.com/mongoose1.jpg',
        date: Date('26-05-2015'),
        city: 'Ekb',
        serial: '4655ASG2D',
        model: 'Mongoose Meteore Comp',
        color: 'Yellow',
        special: 'Not new bike for $1k'     
      }];
      Bike.create(test_bikes)
      .then((bike) => {
        request.get('http://localhost:8080/bikes', (err, res, body) => {
          (JSON.parse(body)).should.doesNotThrow;
          var body = JSON.parse(body);
          body.should.be.instanceof(Array).and.have.lengthOf(2);
          var bike = body[0];
          bike.should.be.instanceof(Object).and.have.properties([
            'photo',
            'date',
            'city',
            'serial',
            'model',
            'color',
            'special'
          ]);
          bike['photo'].should.be.equal('http://bikes.com/mongoose.jpg');
          // bike['date'].should.be.equal('2015-08-08T15:00:05.000Z');
          bike['city'].should.be.equal('Ekb');
          bike['serial'].should.be.equal('4657BS72D');
          bike['model'].should.be.equal('Mongoose Meteore Comp');
          bike['color'].should.be.equal('Green');
          bike['special'].should.be.equal('New bike for $2k');
          done();
        })
      })
    });

    it('POST /bikes должен создавать велосипед', (done) => {
      done();
    });

    it('PUT /bikes должен обновлять велосипед по id', (done) => {
      done();
    });

    it('DELETE /bikes должен удалять велосипед по id', (done) => {
      done();
    });
  })
});