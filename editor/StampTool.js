function StampTool(view, stage) {
  this._view = view;
  this._stage = stage;
}

StampTool.prototype.down = function (x, y) {
  const {i, j, k} = View.unproject(
      this._view.x0 + x, this._view.y0 + y)(this._stage.selectedLayer);
  this._stage.set(i, j, k, 1);
  return true;
};

StampTool.prototype.drag = function (x, y) {
  const {i, j, k} = View.unproject(
      this._view.x0 + x, this._view.y0 + y)(this._stage.selectedLayer);
  this._stage.set(i, j, k, 1);
  return true;
};
