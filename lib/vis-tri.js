
module.exports = function(edge) {
  var half = Math.floor(edge / 2);
  edge = half * 2;
  var height = Math.floor(Math.sqrt((edge*edge) - (half * half)));

  var up = [
    [0, 0],
    [-half, height],
    [half, height]
  ];

  var down = [
    [0, 0],
    [edge, 0],
    [half, height]
  ];

  var model = {
    up, down
  };

  var drawn = {};

  var minX = Infinity;
  var minY = Infinity;
  var maxX = -Infinity;
  var maxY = -Infinity;

  var VisTri = function (x, y, dir) {
    
    var tri = {
      id: `${x}-${y}-${dir}`,
      edge: model[dir].map(p => {
        var o = [];
        o[0] = p[0] + x;
        o[1] = p[1] + y;
        return o;
      }),
      children: null,
      canDraw: function() {
        return drawn[tri.id] === true ? false : true;
      },
      draw: function() {
        drawn[tri.id] = true;
        tri.edge.forEach(p => {
          minX = Math.min(p[0], minX);
          minY = Math.min(p[1], minY);
          maxX = Math.max(p[0], maxX);
          maxY = Math.max(p[1], maxY);
        });
        return tri;
      },
      getChildren() {
        if (tri.children === null) {
          tri.children = [];
          var t = tri.edge;
          if (dir === 'up') {
            tri.children.push(VisTri(t[0][0], t[0][1], 'down'));
            tri.children.push(VisTri(t[1][0], t[1][1], 'down'));
            tri.children.push(VisTri(t[0][0]-edge, t[0][1], 'down'));
          }
          else {
            tri.children.push(VisTri(t[2][0], t[1][1]-height, 'up'));
            tri.children.push(VisTri(t[1][0], t[1][1], 'up'));
            tri.children.push(VisTri(t[0][0], t[0][1], 'up'));
          }
        }

        return tri.children.filter(c => c.canDraw());
      }
    };
  
    return tri;
  };

  VisTri.getBox = function() {
   return [minX, minY, maxX, maxY]; 
  };

  return VisTri;


};

