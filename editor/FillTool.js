function FillTool(view, stage) {
  this._view = view;
  this._stage = stage;
}

FillTool.prototype._flood = function (i, j, k) {
  if (!this._stage.has(i, j, k)) {
    this._stage.set(i, j, k, 1);
    this._flood(i - 1, j, k);
    this._flood(i + 1, j, k);
    this._flood(i, j - 1, k);
    this._flood(i, j + 1, k);
  }
};

FillTool.prototype.up = function (x, y) {
  const {i, j, k} = View.unproject(x, y)(0);
  this._flood(i, j, k);
  return true;
};
