function MemoryStore(fields) {
  this._size = 0;
  this._free = [1];
  this._data = Object.create(null);
  fields.forEach(function (field) {
    this._data[field] = Object.create(null);
  }, this);
}

MemoryStore.prototype.size = function () {
  return this._size;
};

MemoryStore.prototype.new = function () {
  var index = this._free.pop();
  if (!this._free.length) {
    this._free.push(index + 1);
  }
  this._size++;
  return index;
};

MemoryStore.prototype.delete = function (index) {
  this._free.push(index);
  this._size--;
  for (var field in this._data) {
    delete this._data[field][index];
  }
};

MemoryStore.prototype.get = function (index, field) {
  return this._data[field][index];
};

MemoryStore.prototype.set = function (index, field, value) {
  var old = this._data[field][index];
  this._data[field][index] = value;
  return old;
};
