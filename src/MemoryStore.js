function MemoryStore(fields) {
  this._free = [1];
  this._data = Object.create(null);
  fields.forEach(function (field) {
    this._data[field] = Object.create(null);
  }, this);
}

MemoryStore.prototype.new = function () {
  var index = this._free.pop();
  if (!this._free.length) {
    this._free.push(index + 1);
  }
  return index;
};

MemoryStore.prototype.delete = function (index) {
  this._free.push(index);
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
