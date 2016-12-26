function View(context, width, height) {
  this.context = context;
  this.width = width;
  this.height = height;
  this.x0 = -width >> 1;
  this.y0 = -height >> 1;
}

View.prototype.project = function (i, j, k) {
  return {
    x: i * 24 + j * 24,
    y: j * 12 - i * 12 - k * 24,
    z: j - i + k,
  };
};

View.prototype.projectTile = function (i, j, k) {
  return {
    x: i * 24 + j * 24,
    y: j * 12 - i * 12 - k * 24 - 36,
    z: j - i + k,
  };
};

View.prototype.unproject = function (x, y) {
  x += this.x0;
  y += this.y0;
  return function (k) {
    return {
      i: (x - y * 2 - k * 48) / 48,
      j: (x + y * 2 + k * 48) / 48,
      k: k,
    };
  };
};

View.prototype.unprojectCell = function (x, y) {
  x += this.x0;
  y += this.y0;
  return function (k) {
    return {
      i: Math.floor((x - y * 2 - k * 48) / 48),
      j: Math.floor((x + y * 2 + k * 48) / 48),
      k: k,
    };
  };
};
