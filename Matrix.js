function Matrix() {
  this._store = new MemoryStore(['l', 'r', 'b', 'x', 'y', 'z', 't']);
  this._root = 0;
}

Matrix.prototype._less = function (x0, y0, z0, x1, y1, z1) {
  return x0 <= x1 || !(x0 >= x1) && (y0 <= y1 || !(y0 >= y1) && (z0 <= z1));
};

Matrix.prototype._new = function (x, y, z, type) {
  var index = this._store.new();
  this._store.set(index, 'l', 0);
  this._store.set(index, 'r', 0);
  this._store.set(index, 'b', 0);
  this._store.set(index, 'x', x);
  this._store.set(index, 'y', y);
  this._store.set(index, 'z', z);
  this._store.set(index, 't', type);
  return index;
};

Matrix.prototype._insert = function (x, y, z, type) {
  // TODO
};

Matrix.prototype._remove = function (x, y, z) {
  // TODO
};

Matrix.prototype.get = function (x, y, z) {
  var i = this._root;
  while (i) {
    var xi = this._store.get(i, 'x');
    var yi = this._store.get(i, 'y');
    var zi = this._store.get(i, 'z');
    if (this._less(x, y, z, xi, yi, zi)) {
      i = this._store.get(i, 'l');
    } else if (this._less(xi, yi, zi, x, y, z)) {
      i = this._store.get(i, 'r');
    } else {
      return this._store.get(i, 't');
    }
  }
};

Matrix.prototype.set = function (x, y, z, type) {
  var i = this._root;
  while (i) {
    var xi = this._store.get(i, 'x');
    var yi = this._store.get(i, 'y');
    var zi = this._store.get(i, 'z');
    if (this._less(x, y, z, xi, yi, zi)) {
      i = this._store.get(i, 'l');
    } else if (this._less(xi, yi, zi, x, y, z)) {
      i = this._store.get(i, 'r');
    } else {
      this._store.set(i, 't', type);
      return;
    }
  }
  this._insert(x, y, z, type);
};

Matrix.prototype.erase = function (x, y, z) {
  var i = this._root;
  while (i) {
    var xi = this._store.get(i, 'x');
    var yi = this._store.get(i, 'y');
    var zi = this._store.get(i, 'z');
    if (this._less(x, y, z, xi, yi, zi)) {
      i = this._store.get(i, 'l');
    } else if (this._less(xi, yi, zi, x, y, z)) {
      i = this._store.get(i, 'r');
    } else {
      this._remove(x, y, z);
      return;
    }
  }
};
