var path = require('path');
var fs = require('fs');

var equalRepo = require('../');

var imgFilePath = path.join(__dirname, './input.jpg');
var triangles = require('./triangles.json');

var opts = {
  img: imgFilePath,
  triangles: triangles,
  start: 0,
  edge: 5
};

equalRepo(opts, function(err, svg) {
  if (err) throw err;
  fs.writeFileSync(path.join(__dirname, 'result.svg'), svg);
});

