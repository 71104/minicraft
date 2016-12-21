function EraserTool(view, stage) {
  this._view = view;
  this._stage = stage;
}

EraserTool.prototype.down = function (x, y) {
  const {i, j, k} = View.unproject(this._view.x0 + x, this._view.y0 + y)(0);
  this._stage.erase(i, j, k);
  return true;
};

EraserTool.prototype.drag = function (x, y) {
  const {i, j, k} = View.unproject(this._view.x0 + x, this._view.y0 + y)(0);
  this._stage.erase(i, j, k);
  return true;
};
