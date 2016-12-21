function View(context, width, height) {
  this.context = context;
  this.width = width;
  this.height = height;
  this.x0 = 0;
  this.y0 = 0;
}

View.project = function (i, j, k) {
  return {
    x: i * 24 + j * 24,
    y: j * 12 - i * 12 - k * 24 - 36,
    z: j - i + k,
  };
};

View.unproject = function (x, y) {
  return function (k) {
    return {
      i: Math.floor((x - y * 2 - k * 48) / 48),
      j: Math.floor((x + y * 2 + k * 48) / 48),
      k: k,
    };
  };
};
