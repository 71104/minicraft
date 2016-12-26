function Stage(tile, view) {
  this._tile = tile;
  this._view = view;
  this._3d = new Matrix();
  this._2d = new Matrix();
  this.selectedLayer = 0;
  this.layers = Object.create(null);
  this.layers[0] = true;
  this.transparency = true;
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
      this.renderLeft();
      this.right && this.right.render();
    } else if (x > stage._view.x0 + stage._view.width) {
      this.left && this.left.render();
      this.renderRight();
    } else if (y + 48 < stage._view.y0) {
      this.renderLeft();
      this.right && this.right.render();
    } else if (y > stage._view.y0 + stage._view.height) {
      this.left && this.left.render();
      this.renderRight();
    } else {
      this.left && this.left.render();
      stage._drawTile(x, y, this.value);
      this.right && this.right.render();
    }
  };

  Node.prototype.renderLeft = function () {
    if (this.left) {
      if (this.left.x < this.x) {
        this.left.render();
      } else {
        this.left.renderLeft();
      }
    }
  };

  Node.prototype.renderRight = function () {
    if (this.right) {
      if (this.right.x > this.x) {
        this.right.render();
      } else {
        this.right.renderRight();
      }
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


Stage.prototype._drawLine = function (i0, j0, i1, j1) {
  const {x: x0, y: y0} = View.project(i0, j0, this.selectedLayer);
  const {x: x1, y: y1} = View.project(i1, j1, this.selectedLayer);
  this._view.context.moveTo(x0, y0);
  this._view.context.lineTo(x1, y1);
};

Stage.prototype._drawTile = function (x, y, tile) {
  if (this.layers[tile.k]) {
    if (this.transparency && this.selectedLayer !== tile.k) {
      this._view.context.globalAlpha = 0.5;
    } else {
      this._view.context.globalAlpha = 1;
    }
    this._view.context.drawImage(this._tile, x, y);
  }
};

Stage.prototype.has = function (i, j, k) {
  return this._3d.has(k, i, j);
};

Stage.prototype.set = function (i, j, k, type) {
  const {x, y, z} = View.projectTile(i, j, k);
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
  const {x, y, z} = View.projectTile(i, j, k);
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
  const k = this.selectedLayer;
  this._view.context.setTransform(1, 0, 0, 1, -x0, -y0);
  this._view.context.clearRect(x0, y0, width, height);
  const p = [
    View.unproject(x0, y0)(k),
    View.unproject(x0 + width, y0)(k),
    View.unproject(x0, y0 + height)(k),
    View.unproject(x0 + width, y0 + height)(k),
  ];
  const minI = Math.floor(Math.min(p[0].i, p[1].i, p[2].i, p[3].i));
  const maxI = Math.ceil(Math.max(p[0].i, p[1].i, p[2].i, p[3].i));
  const minJ = Math.floor(Math.min(p[0].j, p[1].j, p[2].j, p[3].j));
  const maxJ = Math.ceil(Math.max(p[0].j, p[1].j, p[2].j, p[3].j));
  this._view.context.beginPath();
  this._view.context.lineWidth = 1;
  this._drawLine(0, minJ, 0, maxJ);
  this._drawLine(minI, 0, maxI, 0);
  this._view.context.stroke();
  this._view.context.lineWidth = 0.5;
  for (var i = minI; i <= maxI; i++) {
    if (i) {
      this._drawLine(i, minJ, i, maxJ);
    }
  }
  for (var j = minJ; j <= maxJ; j++) {
    if (j) {
      this._drawLine(minI, j, maxI, j);
    }
  }
  this._view.context.stroke();
  this._view.context.closePath();
  this._2d.execute('render');
};

Stage.prototype.minLayer = function () {
  return this._3d.execute('minLayer') || 0;
};

Stage.prototype.maxLayer = function () {
  return this._3d.execute('maxLayer') || 0;
};
