function Matrix() {
  this._map = Object.create(null);
}

Matrix.prototype._hash = function (x, y, z) {
  return x + ',' + y + ',' + z;
};

Matrix.prototype.has = function (x, y, z) {
  return this._hash(x, y, z) in this._map;
};

Matrix.prototype.get = function (x, y, z) {
  return this._map[this._hash(x, y, z)];
};

Matrix.prototype.set = function (x, y, z, type) {
  this._map[this._hash(x, y, z)] = type;
};

Matrix.prototype.erase = function (x, y, z) {
  delete this._map[this._hash(x, y, z)];
};
