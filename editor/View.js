function View(context, width, height) {
  this._context = context;
  this.width = width;
  this.height = height;
  this.x0 = -width >> 1;
  this.y0 = -height >> 1;
}

View.prototype.project = function (i, j, k) {
  return {
    x: i * 24 + j * 24,
    y: j * 12 - i * 12 - k * 24,
    z: j - i + k,
  };
};

View.prototype.projectTile = function (i, j, k) {
  return {
    x: i * 24 + j * 24,
    y: j * 12 - i * 12 - k * 24 - 36,
    z: j - i + k,
  };
};

View.prototype.unproject = function (x, y) {
  x += this.x0;
  y += this.y0;
  return function (k) {
    return {
      i: (x - y * 2 - k * 48) / 48,
      j: (x + y * 2 + k * 48) / 48,
      k: k,
    };
  };
};

View.prototype.unprojectCell = function (x, y) {
  x += this.x0;
  y += this.y0;
  return function (k) {
    return {
      i: Math.floor((x - y * 2 - k * 48) / 48),
      j: Math.floor((x + y * 2 + k * 48) / 48),
      k: k,
    };
  };
};

View.prototype._drawLine = function (i0, j0, i1, j1, k) {
  const {x: x0, y: y0} = this.project(i0, j0, k);
  const {x: x1, y: y1} = this.project(i1, j1, k);
  this._context.moveTo(x0, y0);
  this._context.lineTo(x1, y1);
};

View.prototype.drawGrid = function (k) {
  this._context.setTransform(1, 0, 0, 1, -this.x0, -this.y0);
  this._context.clearRect(this.x0, this.y0, this.width, this.height);
  const p = [
    this.unproject(0, 0)(k),
    this.unproject(this.width, 0)(k),
    this.unproject(0, this.height)(k),
    this.unproject(this.width, this.height)(k),
  ];
  const minI = Math.floor(Math.min(p[0].i, p[1].i, p[2].i, p[3].i));
  const maxI = Math.ceil(Math.max(p[0].i, p[1].i, p[2].i, p[3].i));
  const minJ = Math.floor(Math.min(p[0].j, p[1].j, p[2].j, p[3].j));
  const maxJ = Math.ceil(Math.max(p[0].j, p[1].j, p[2].j, p[3].j));
  this._context.globalAlpha = 1;
  this._context.beginPath();
  this._context.lineWidth = 1;
  this._drawLine(0, minJ, 0, maxJ, k);
  this._drawLine(minI, 0, maxI, 0, k);
  this._context.stroke();
  this._context.lineWidth = 0.5;
  for (var i = minI; i <= maxI; i++) {
    if (i) {
      this._drawLine(i, minJ, i, maxJ, k);
    }
  }
  for (var j = minJ; j <= maxJ; j++) {
    if (j) {
      this._drawLine(minI, j, maxI, j, k);
    }
  }
  this._context.stroke();
  this._context.closePath();
};

View.prototype.drawImage = function (transparent, image, x, y) {
  if (transparent) {
    this._context.globalAlpha = 0.5;
  } else {
    this._context.globalAlpha = 1;
  }
  this._context.drawImage(image, x, y);
};
