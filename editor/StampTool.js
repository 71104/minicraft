function StampTool(view, stage) {
  this._view = view;
  this._stage = stage;
}

StampTool.prototype.down = function (x, y) {
  const {i, j, k} = this._view.unprojectCell(x, y)(this._stage.selectedLayer);
  this._stage.set(i, j, k, 1);
  return true;
};

StampTool.prototype.drag = function (x, y) {
  const {i, j, k} = this._view.unprojectCell(x, y)(this._stage.selectedLayer);
  this._stage.set(i, j, k, 1);
  return true;
};
