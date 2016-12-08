Matrix.prototype._verifyHeight = function (i) {
  if (i) {
    var l = this._verifyHeight(this._store.get(i, 'l'));
    var r = this._verifyHeight(this._store.get(i, 'r'));
    var h = Math.max(l, r) + 1;
    if (this._store.get(i, 'h') !== h) {
      throw new Error();
    } else {
      return h;
    }
  } else {
    return 0;
  }
};

Matrix.prototype.verifyHeight = function () {
  return this._verifyHeight(this._root);
};

Matrix.prototype._verifyBST = function (i) {
  if (i) {
    var x = this._store.get(i, 'x');
    var y = this._store.get(i, 'y');
    var z = this._store.get(i, 'z');
    var l = this._store.get(i, 'l');
    if (l && this._cmp(x, y, z, l) >= 0) {
      throw new Error();
    }
    var r = this._store.get(i, 'r');
    if (r && this._cmp(x, y, z, r) <= 0) {
      throw new Error();
    }
    return true;
  } else {
    return true;
  }
};

Matrix.prototype.verifyBST = function () {
  return this._verifyBST(this._root);
};

Matrix.prototype._verifyAVL = function (i) {
  if (i) {
    var b = this._height(this._store.get(i, 'r')) -
        this._height(this._store.get(i, 'l'));
    if (b < -1 || b > 1) {
      throw new Error();
    } else {
      return true;
    }
  } else {
    return true;
  }
};

Matrix.prototype.verifyAVL = function () {
  return this._verifyAVL(this._root);
};

Matrix.prototype.verifyAll = function () {
  this.verifyHeight();
  this.verifyBST();
  this.verifyAVL();
};
