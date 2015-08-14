var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser'),
    configureDB = require('./models/settings');

configureDB();

var router = require('./routes');

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.json(err);
  return next();
})

app.use(router);

http.listen(1337, function () {
  console.log("listening on *:1337");
});
