function Grid(width, height) {
  this._width = width;
  this._height = height;
  this._matrix = new Matrix();
  this._sectors = Object.create(null);
}

Grid.prototype.render = function (context, x, y) {
  // TODO
};

Grid.prototype.set = function (i, j, k, type) {
  if (this._matrix.has(i, j, k)) {
    // TODO
  }
  this._matrix.set(i, j, k, type);
  // TODO
};

Grid.prototype.erase = function (id) {
  // TODO
};
