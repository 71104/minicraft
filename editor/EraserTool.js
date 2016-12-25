function EraserTool(view, stage) {
  this._view = view;
  this._stage = stage;
}

EraserTool.prototype.down = function (x, y) {
  const {i, j, k} = View.unprojectCell(
      this._view.x0 + x, this._view.y0 + y)(this._stage.selectedLayer);
  this._stage.erase(i, j, k);
  return true;
};

EraserTool.prototype.drag = function (x, y) {
  const {i, j, k} = View.unprojectCell(
      this._view.x0 + x, this._view.y0 + y)(this._stage.selectedLayer);
  this._stage.erase(i, j, k);
  return true;
};
