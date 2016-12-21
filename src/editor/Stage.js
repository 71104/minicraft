function Stage(tile, view) {
  this._tile = tile;
  this._view = view;
  this._3d = new Matrix();
  this._2d = new Matrix();
  this._setup();
}

Stage.prototype._setup = function () {
  const tile = this._tile;
  const view = this._view;
  Node.prototype.render = function (left, right) {
    const x = this.y;
    const y = this.z;
    if (x + 48 < view.x0) {
      right && this.right && this.right.render(false, true);
    } else if (x > view.x0 + view.width) {
      left && this.left && this.left.render(true, false);
    } else if (y + 48 < view.y0) {
      left && this.left && this.left.render(true, false);
      right && this.right && this.right.render(false, true);
    } else if (y > view.y0 + view.height) {
      left && this.left && this.left.render(true, false);
      right && this.right && this.right.render(false, true);
    } else {
      left && this.left && this.left.render(true, true);
      view.context.drawImage(tile, x, y);
      right && this.right && this.right.render(true, true);
    }
  };
};

Stage.prototype.set = function (i, j, k, type) {
  const {x, y, z} = View.project(i, j, k);
  if (this._3d.has(i, j, k)) {
    this._2d.erase(z, x, y);
  }
  this._3d.set(i, j, k, type);
  this._2d.set(z, x, y, type);
};

Stage.prototype.erase = function (i, j, k) {
  const {x, y, z} = View.project(i, j, k);
  if (this._3d.has(i, j, k)) {
    this._3d.erase(i, j, k);
    this._2d.erase(z, x, y);
  }
};

Stage.prototype.render = function () {
  const x0 = this._view.x0;
  const y0 = this._view.y0;
  const width = this._view.width;
  const height = this._view.height;
  this._view.context.setTransform(1, 0, 0, 1, -x0, -y0);
  this._view.context.clearRect(x0, y0, width, height);
  this._2d.execute('render', true, true);
};
