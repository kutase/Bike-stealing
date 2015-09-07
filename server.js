var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    configureDB = require('./models/settings');

configureDB();

var router = require('./routes');

const PORT = 1337;

app.use(express.static('public'));
app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use((err, req, res, next) => {
  console.error(err, err.stack);
  return res.json(err.stack);
  // return next();
})

app.use(router);

http.listen(PORT, function () {
  console.log("listening on *:1337");
});
