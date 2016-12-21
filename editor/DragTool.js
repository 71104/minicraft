function DragTool(view, stage) {
  this._view = view;
  this._stage = stage;
  this._x0 = 0;
  this._y0 = 0;
}

DragTool.prototype.down = function (x, y) {
  this._x0 = x;
  this._y0 = y;
  return false;
};

DragTool.prototype.drag = function (x, y) {
  this._view.x0 += this._x0 - x;
  this._view.y0 += this._y0 - y;
  this._x0 = x;
  this._y0 = y;
  return true;
};
