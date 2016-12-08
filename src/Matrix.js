function Matrix() {
  this._store = new MemoryStore(['l', 'r', 'h', 'x', 'y', 'z', 't']);
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
  this._store.set(index, 'h', 1);
  this._store.set(index, 'x', x);
  this._store.set(index, 'y', y);
  this._store.set(index, 'z', z);
  this._store.set(index, 't', type);
  return index;
};

Matrix.prototype._height = function (i) {
  if (i) {
    return this._store.get(i, 'h');
  } else {
    return 0;
  }
};

Matrix.prototype._updateHeight = function (i) {
  this._store.set(i, 'h', Math.max(this._height(this._store.get(i, 'l')),
        this._height(this._store.get(i, 'r'))) + 1);
};

Matrix.prototype._bf = function (i) {
  if (i) {
    return this._height(this._store.get(i, 'r')) -
        this._height(this._store.get(i, 'l'));
  } else {
    return 0;
  }
};

Matrix.prototype._rotateLeft = function (index) {
  var i = index;
  var j = this._store.get(i, 'r');
  var k = this._store.get(j, 'l');
  this._store.set(i, 'r', k);
  this._store.set(j, 'l', i);
  this._updateHeight(i);
  this._updateHeight(j);
  return j;
};

Matrix.prototype._rotateRight = function (index) {
  var i = index;
  var j = this._store.get(i, 'l');
  var k = this._store.get(j, 'r');
  this._store.set(i, 'l', k);
  this._store.set(j, 'r', i);
  this._updateHeight(i);
  this._updateHeight(j);
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

Matrix.prototype.has = function (x, y, z) {
  var i = this._root;
  while (i) {
    var cmp = this._cmp(x, y, z, i);
    if (cmp < 0) {
      i = this._store.get(i, 'l');
    } else if (cmp > 0) {
      i = this._store.get(i, 'r');
    } else {
      return true;
    }
  }
  return false;
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

Matrix.prototype._setLeft = function (i, x, y, z, type) {
  var j = this._set(this._store.get(i, 'l'), x, y, z, type);
  if (j) {
    this._store.set(i, 'l', j);
    var b = this._bf(i);
    if (b < -1) {
      if (this._bf(j) > 0) {
        return this._rotateLeftRight(i);
      } else {
        return this._rotateRight(i);
      }
    } else if (b) {
      return i;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

Matrix.prototype._setRight = function (i, x, y, z, type) {
  var j = this._set(this._store.get(i, 'r'), x, y, z, type);
  if (j) {
    this._store.set(i, 'r', j);
    var b = this._bf(i);
    if (b > 1) {
      if (this._bf(j) < 0) {
        return this._rotateRightLeft(i);
      } else {
        return this._rotateLeft(i);
      }
    } else if (b) {
      return i;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

Matrix.prototype._set = function (i, x, y, z, type) {
  if (i) {
    var cmp = this._cmp(x, y, z, i);
    if (cmp < 0) {
      return this._setLeft(i, x, y, z, type);
    } else if (cmp > 0) {
      return this._setRight(i, x, y, z, type);
    } else {
      this._store.set(i, 't', type);
      return 0;
    }
  } else {
    return this._new(x, y, z, type);
  }
};

Matrix.prototype.set = function (x, y, z, type) {
  this._root = this._set(this._root, x, y, z, type) || this._root;
};

Matrix.prototype._erase = function (i, x, y, z) {
  // TODO
};

Matrix.prototype.erase = function (x, y, z) {
  this._root = this._erase(this._root, x, y, z);
};

Matrix.prototype._each = function (i, callback) {
  if (i) {
    this._each(this._store.get(i, 'l'), callback);
    callback(
        this._store.get(i, 'x'),
        this._store.get(i, 'y'),
        this._store.get(i, 'z'),
        this._store.get(i, 't')
        );
    this._each(this._store.get(i, 'r'), callback);
  }
};

Matrix.prototype.each = function (callback) {
  this._each(this._root, callback);
};
