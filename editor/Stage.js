function Stage(tile, view) {
  this._tile = tile;
  this._view = view;
  this._3d = new Matrix();
  this._2d = new Matrix();
  this.selectedLayer = 0;
  this.layers = Object.create(null);
  this.layers[0] = true;
  this._setupNode();
}


Stage.prototype._setupNode = function () {
  const stage = this;

  Node.prototype.fetchLayer = function (k, i, j) {
    if (k < this.x) {
      this.right && this.right.fetchLayer(k, i, j);
    } else if (k > this.x) {
      this.left && this.left.fetchLayer(k, i, j);
    } else {
      this.left && this.left.fetchLayer(k, i, j);
      i.push(this.y);
      j.push(this.z);
      this.right && this.right.fetchLayer(k, i, j);
    }
  };

  Node.prototype.render = function () {
    const x = this.y;
    const y = this.z;
    if (x + 48 < stage._view.x0) {
      this.right && this.right.render();
    } else if (x > stage._view.x0 + stage._view.width) {
      this.left && this.left.render();
    } else if (y + 48 < stage._view.y0) {
      this.left && this.left.render();
      this.right && this.right.render();
    } else if (y > stage._view.y0 + stage._view.height) {
      this.left && this.left.render();
      this.right && this.right.render();
    } else {
      this.left && this.left.render();
      if (stage.layers[this.value.k]) {
        if (stage.selectedLayer !== this.value.k) {
          stage._view.context.globalAlpha = 0.5;
        } else {
          stage._view.context.globalAlpha = 1;
        }
        stage._view.context.drawImage(stage._tile, x, y);
      }
      this.right && this.right.render();
    }
  };

  Node.prototype.minLayer = function () {
    if (this.left) {
      return this.left.minLayer();
    } else {
      return this.x;
    }
  };

  Node.prototype.maxLayer = function () {
    if (this.right) {
      return this.right.maxLayer();
    } else {
      return this.x;
    }
  };

};


Stage.prototype.has = function (i, j, k) {
  return this._3d.has(k, i, j);
};

Stage.prototype.set = function (i, j, k, type) {
  const {x, y, z} = View.project(i, j, k);
  if (this._3d.has(k, i, j)) {
    this._2d.erase(z, x, y);
  }
  this._3d.set(k, i, j, type);
  this._2d.set(z, x, y, {
    i: i,
    j: j,
    k: k,
    type: type,
  });
};

Stage.prototype.erase = function (i, j, k) {
  const {x, y, z} = View.project(i, j, k);
  if (this._3d.has(k, i, j)) {
    this._3d.erase(k, i, j);
    this._2d.erase(z, x, y);
  }
};

Stage.prototype.eraseLayer = function (k, confirmCallback) {
  const i = [];
  const j = [];
  this._3d.execute('fetchLayer', k, i, j);
  if (confirmCallback(i.length)) {
    for (var index = 0; index < i.length; index++) {
      this.erase(i[index], j[index], k);
    }
  }
};

Stage.prototype.render = function () {
  const x0 = this._view.x0;
  const y0 = this._view.y0;
  const width = this._view.width;
  const height = this._view.height;
  this._view.context.setTransform(1, 0, 0, 1, -x0, -y0);
  this._view.context.clearRect(x0, y0, width, height);
  this._2d.execute('render');
};

Stage.prototype.minLayer = function () {
  return this._3d.execute('minLayer') || 0;
};

Stage.prototype.maxLayer = function () {
  return this._3d.execute('maxLayer') || 0;
};
