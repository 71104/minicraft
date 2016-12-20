function Matrix() {
  this._store = new MemoryStore(['t', 'f0', 'f1', 'f2', 'f3', 'f4', 'f5']);
  this._map = Object.create(null);
}

Matrix.prototype._hash = function (x, y, z) {
  return x + ',' + y + ',' + z;
};

Matrix.prototype.has = function (x, y, z) {
  return this._hash(x, y, z) in this._map;
};

Matrix.prototype.get = function (x, y, z) {
  var hash = this._hash(x, y, z);
  if (hash in this._map) {
    var i = this._map[hash];
    return [
      this._store.get(i, 't'),
      this._store.get(i, 'f0'),
      this._store.get(i, 'f1'),
      this._store.get(i, 'f2'),
      this._store.get(i, 'f3'),
      this._store.get(i, 'f4'),
      this._store.get(i, 'f5'),
    ];
  }
};

Matrix.prototype._index = function (x, y, z) {
  var hash = this._hash(x, y, z);
  if (hash in this._map) {
    return this._map[hash];
  } else {
    return this._map[hash] = this._store.new();
  }
};

Matrix.prototype.set = function (x, y, z, t, f0, f1, f2, f3, f4, f5) {
  var i = this._index(x, y, z);
  this._store.set(i, 't', t);
  this._store.set(i, 'f0', f0);
  this._store.set(i, 'f1', f1);
  this._store.set(i, 'f2', f2);
  this._store.set(i, 'f3', f3);
  this._store.set(i, 'f4', f4);
  this._store.set(i, 'f5', f5);
};

Matrix.prototype.erase = function (x, y, z) {
  var hash = this._hash(x, y, z);
  if (hash in this._map) {
    this._store.delete(this._map[hash]);
    delete this._map[hash];
  }
};
