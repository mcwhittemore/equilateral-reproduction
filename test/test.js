var equalRepo = require('../');
var path = require('path');

var imgFilePath = path.join(__dirname, './input.jpg');
var triangles = require('./triangles.json');

var opts = {
  img: imgFilePath,
  triangles: triangles,
  start: 0,
  edge: 5
};

equalRepo(opts, function(err, svg) {
  console.log(err, svg);
});

