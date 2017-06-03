var getPixels = require('get-pixels');
var Tri = require('./lib/src-tri');

module.exports = function(opts, callback) {
  var tris = opts.triangles.map(t => new Tri(t));
  var visTri = require('./lib/vis-tri')(opts.edge || 5);

  var index = tris.reduce((m, t) => {
    return t.points.reduce((m, p) => {
      m[p] = m[p] || [];
      m[p].push(t);
      return m;
    }, m);
  }, {});

  tris.forEach(t => {
    t.done = true;
    t.points.forEach(p => {
      index[p].filter(tt => t.sharesSide(tt)).forEach(tt => {
        t.addChild(tt);
      });
    });
  });

  var out = [];

  var stack = [
    {s: tris[opts.start || 0].draw(), v: visTri(40, 40, 'up').draw()}
  ];

  getPixels(opts.img, function(err, img) {
    if (err) return callback(err);
    while(stack.length) {
      var n = stack.splice(0, 1)[0];
      var sc = n.s.getChildren();
      var vc = n.v.getChildren();
      var nc = Math.min(sc.length, vc.length);
      for (var i=0; i<nc; i++) {
        stack.push({s: sc[i].draw(), v: vc[i].draw() });
      }
      out.push(`<polygon id='${n.s.id}' fill='${n.s.getColor(img)}' points='${n.v.edge.join(' ')}'/>`);
    }

    var box = visTri.getBox();

    var vb = [box[0], box[1]];
    vb[2] = box[2]-box[0];
    vb[3] = box[3]-box[1];

    callback(null, `<svg viewBox='${vb.join(' ')}' xmlns='http://www.w3.org/2000/svg'>${out.join('\n')}</svg>`);
  });
}






