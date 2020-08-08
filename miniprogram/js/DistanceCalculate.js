function getRad(d) {
  var PI = Math.PI;
  return d * PI / 180.0;
}

function Calculate(lat1, lng1, lat2, lng2) {
  console.log("lat1,lng1,lat2,lng2", lat1, lng1, lat2, lng2)
  var EARTH_RADIUS = 6378137.0; //单位M
  var PI = Math.PI;
  var f = this.getRad((lat1 + lat2) / 2);
  var g = this.getRad((lat1 - lat2) / 2);
  var l = this.getRad((lng1 - lng2) / 2);

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;
  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}

function toDecimal(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return;
  }
  f = Math.round(x * 10) / 10;
  return f;
}
module.exports = {
  Calculate:Calculate,
  toDecimal:toDecimal,
  getRad:getRad
}