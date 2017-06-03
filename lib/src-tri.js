var inPolygon = require('point-in-big-polygon');

var Tri = module.exports = function(edge) {
  this.edge = edge;

  this.points = edge.map(p => p.join('!'));

  this.id = this.points.join('?');

  this.index = this.points.reduce((m, p) => {
    m[p] = true;
    return m;
  }, {});

  this.children = [];
  this.done = false;
  this.drawn = false;
};

Tri.prototype.addChild = function(other) {
  for (var i=0; i<this.children.length; i++) {
    if (this.children[i].id === other.id) return;
  }
  this.children.push(other);
};

Tri.prototype.getChildren = function() {
  return this.children.filter(c => c.drawn === false);
};

Tri.prototype.draw = function() {
  this.drawn = true;
  return this;
};

Tri.prototype.sharesSide = function(other) {
  var share = this.points.reduce((m, p) => {
    if (other.hasPoint(p)) {
      return m+1;
    }
    return m;
  }, 0);

  return share === 2;
};

Tri.prototype.hasPoint = function(p) {
  return this.index[p] || false;
};

Tri.prototype.getColor = function(img) {
  var minX = Math.min(this.edge[0][0], this.edge[1][0], this.edge[2][0]);
  var minY = Math.min(this.edge[0][1], this.edge[1][1], this.edge[2][1]);
  var maxX = Math.max(this.edge[0][0], this.edge[1][0], this.edge[2][0]);
  var maxY = Math.max(this.edge[0][1], this.edge[1][1], this.edge[2][1]);

  var loop = this.edge.concat([this.edge[0]]);

  var hit = inPolygon([loop]);

  var r = 0;
  var g = 0;
  var b = 0;
  var c = 0;

  for (var x=minX; x<=maxX; x++) {
    for (var y=minY; y<=maxY; y++) {
      if (hit([x, y]) <= 0) {
        r += img.get(x, y, 0);
        g += img.get(x, y, 1);
        b += img.get(x, y, 2);
        c++;
      }
    }
  }

  r = Math.floor(r/c);
  b = Math.floor(b/c);
  g = Math.floor(g/c);

  return `rgb(${r}, ${g}, ${b})`;
};

