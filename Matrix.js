function Matrix() {
  this._store = new MemoryStore(['l', 'r', 'b', 'x', 'y', 'z', 't']);
  this._root = 0;
}

Matrix.prototype._cmp = function (x, y, z, i) {
  var xi = this._store.get(i, 'x');
  var yi = this._store.get(i, 'y');
  var zi = this._store.get(i, 'z');
  if (x < xi) {
    return -1;
  } else if (x > xi) {
    return 1;
  } else if (y < yi) {
    return -1;
  } else if (y > yi) {
    return 1;
  } else if (z < zi) {
    return -1;
  } else if (z > zi) {
    return 1;
  } else {
    return 0;
  }
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

Matrix.prototype._rotateLeft = function (index) {
  var i = index;
  var j = this._store.get(i, 'r');
  var k = this._store.get(j, 'l');
  this._store.set(i, 'r', k);
  this._store.set(j, 'l', i);
  return j;
};

Matrix.prototype._rotateRight = function (index) {
  var i = index;
  var j = this._store.get(i, 'l');
  var k = this._store.get(j, 'r');
  this._store.set(i, 'l', k);
  this._store.set(j, 'r', i);
  return j;
};

Matrix.prototype._rotateLeftRight = function (index) {
  var i = index;
  var j = this._store.get(i, 'l');
  this._store.set(i, 'l', this._rotateLeft(j));
  return this._rotateRight(i);
};

Matrix.prototype._rotateRightLeft = function (index) {
  var i = index;
  var j = this._store.get(i, 'r');
  this._store.set(i, 'r', this._rotateRight(j));
  return this._rotateLeft(i);
};

Matrix.prototype.get = function (x, y, z) {
  var i = this._root;
  while (i) {
    var cmp = this._cmp(x, y, z, i);
    if (cmp < 0) {
      i = this._store.get(i, 'l');
    } else if (cmp > 0) {
      i = this._store.get(i, 'r');
    } else {
      return this._store.get(i, 't');
    }
  }
};

Matrix.prototype.set = function (x, y, z, type) {
  if (this._root) {
    if (this._cmp(x, y, z, this._root)) {
      while (true) {
        // TODO
      }
    } else {
      this._store.set(this._root, 't', type);
    }
  } else {
    this._root = this._new(x, y, z, type);
  }
};

Matrix.prototype.erase = function (x, y, z) {
  if (this._root) {
    if (this._cmp(x, y, z, this._root)) {
      // TODO
    } else {
      this._store.delete(this._root);
      this._root = 0;
    }
  }
};
