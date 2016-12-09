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
    if (l && this._cmp(x, y, z, l) <= 0) {
      throw new Error();
    }
    var r = this._store.get(i, 'r');
    if (r && this._cmp(x, y, z, r) >= 0) {
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


Matrix.test = {};

Matrix.test.all = function () {
  for (var test in Matrix.test) {
    if (test.match(/^test[0-9]+$/)) {
      window.setTimeout(function () {
        Matrix.test[test]();
        console.log('Matrix.test.' + test + '() ok');
      }, 0);
    }
  }
};

Matrix.test._pyramid = function () {
  var values = arguments;
  return function () {
    var m = new Matrix();
    m.verifyAll();
    for (var i = 0; i < values.length; i++) {
      m.set(values[i], 0, 0, 1);
      m.verifyAll();
    }
    for (var i = 0; i < values.length; i++) {
      m.erase(values[i], 0, 0, 1);
      m.verifyAll();
    }
    if (m._store.size()) {
      throw new Error();
    }
  };
};

Matrix.test.test1 = Matrix.test._pyramid();
Matrix.test.test2 = Matrix.test._pyramid(1);
Matrix.test.test3 = Matrix.test._pyramid(1, 2);
Matrix.test.test4 = Matrix.test._pyramid(2, 1);
Matrix.test.test5 = Matrix.test._pyramid(1, 2, 3);
Matrix.test.test6 = Matrix.test._pyramid(1, 3, 2);
Matrix.test.test7 = Matrix.test._pyramid(2, 1, 3);
Matrix.test.test8 = Matrix.test._pyramid(2, 3, 1);
Matrix.test.test9 = Matrix.test._pyramid(3, 1, 2);
Matrix.test.test10 = Matrix.test._pyramid(3, 2, 1);
Matrix.test.test11 = Matrix.test._pyramid(1, 2, 3, 4);
Matrix.test.test12 = Matrix.test._pyramid(1, 2, 4, 3);
Matrix.test.test13 = Matrix.test._pyramid(1, 3, 2, 4);
Matrix.test.test14 = Matrix.test._pyramid(1, 3, 4, 2);
Matrix.test.test15 = Matrix.test._pyramid(1, 4, 2, 3);
Matrix.test.test16 = Matrix.test._pyramid(1, 4, 3, 2);
Matrix.test.test17 = Matrix.test._pyramid(2, 1, 3, 4);
Matrix.test.test18 = Matrix.test._pyramid(2, 1, 4, 3);
Matrix.test.test19 = Matrix.test._pyramid(2, 3, 1, 4);
Matrix.test.test20 = Matrix.test._pyramid(2, 3, 4, 1);
Matrix.test.test21 = Matrix.test._pyramid(2, 4, 1, 3);
Matrix.test.test22 = Matrix.test._pyramid(2, 4, 3, 1);
Matrix.test.test23 = Matrix.test._pyramid(3, 1, 2, 4);
Matrix.test.test24 = Matrix.test._pyramid(3, 1, 4, 2);
Matrix.test.test25 = Matrix.test._pyramid(3, 2, 1, 4);
Matrix.test.test26 = Matrix.test._pyramid(3, 2, 4, 1);
Matrix.test.test27 = Matrix.test._pyramid(3, 4, 1, 2);
Matrix.test.test28 = Matrix.test._pyramid(3, 4, 2, 1);
Matrix.test.test29 = Matrix.test._pyramid(4, 1, 2, 3);
Matrix.test.test30 = Matrix.test._pyramid(4, 1, 3, 2);
Matrix.test.test31 = Matrix.test._pyramid(4, 2, 1, 3);
Matrix.test.test32 = Matrix.test._pyramid(4, 2, 3, 1);
Matrix.test.test33 = Matrix.test._pyramid(4, 3, 1, 2);
Matrix.test.test34 = Matrix.test._pyramid(4, 3, 2, 1);
