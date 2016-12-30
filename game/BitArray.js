function BitArray() {
  this._data = Object.create(null);
}

BitArray.prototype.get = function (i) {
  const index = i >>> 5;
  if (index in this._data) {
    return this._data[index] & (1 << (i & 31)) !== 0;
  } else {
    return false;
  }
};

BitArray.prototype.set = function (i, value) {
  const index = i >>> 5;
  const word = this._data[index] || 0;
  if (value) {
    this._data[index] = word & (1 << (i & 31));
  } else {
    this._data[index] = word & ~(1 << (i & 31));
  }
  return this;
};
