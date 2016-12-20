function Grid(width, height) {
  this._width = width;
  this._height = height;
  this._matrix = new Matrix();
  this._sectors = Object.create(null);
}

Grid.prototype.set = function (i, j, k) {
  const {x, y} = View.project(i, j, k);
  if (this._matrix.has(i, j, k)) {
    // TODO
  }
  this._matrix.set(i, j, k, type);
  // TODO
};

Grid.prototype.erase = function (i, j, k) {
  if (this._matrix.has(i, j, k)) {
    // TODO
    this._matrix.erase(i, j, k);
  }
};

Grid.prototype.each = function (x, y, callback) {
  x = Math.floor(x / this._width);
  y = Math.floor(y / this._height);
  if (y in this._sectors && x in this._sectors[y]) {
    // TODO
  }
};
