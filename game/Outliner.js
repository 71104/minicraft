function Outliner() {
  this._matrix = new Matrix();
}

Outliner.FACES = {
  front: 1,
  right: 2,
  up: 4,
  back: 8,
  left: 16,
  down: 32,
};

Outliner.OPPOSITE_FACES = {
  front: 8,
  right: 16,
  up: 32,
  back: 1,
  left: 2,
  down: 4,
};

Outliner.prototype.has = function (x, y, z) {
  return this._matrix.has(y, z, x);
};

Outliner.prototype._merge = function (x, y, z, face) {
  if (this._matrix.has(y, z, x)) {
    const voxel = this._matrix.get(y, z, x) & ~face;
    if (voxel) {
      this._matrix.set(y, z, x, voxel);
    } else {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype.set = function (x, y, z) {
  if (!this._matrix.has(y, z, x)) {
    var voxel = 0;
    if (!this._merge(x, y, z - 1, Outliner.OPPOSITE_FACES.front)) {
      voxel = voxel | Outliner.FACES.front;
    }
    if (!this._merge(x + 1, y, z, Outliner.OPPOSITE_FACES.right)) {
      voxel = voxel | Outliner.FACES.right;
    }
    if (!this._merge(x, y + 1, z, Outliner.OPPOSITE_FACES.up)) {
      voxel = voxel | Outliner.FACES.up;
    }
    if (!this._merge(x, y, z + 1, Outliner.OPPOSITE_FACES.back)) {
      voxel = voxel | Outliner.FACES.back;
    }
    if (!this._merge(x - 1, y, z, Outliner.OPPOSITE_FACES.left)) {
      voxel = voxel | Outliner.FACES.left;
    }
    if (!this._merge(x, y - 1, z, Outliner.OPPOSITE_FACES.down)) {
      voxel = voxel | Outliner.FACES.down;
    }
    this._matrix.set(y, z, x, voxel);
  }
};

Outliner.prototype._split = function (x, y, z, face) {
  if (this._matrix.has(y, z, x)) {
    this._matrix.set(y, z, x, this._matrix.get(y, z, x) & face);
  } else {
    this.set(x, y, z);
  }
};

Outliner.prototype.erase = function (x, y, z) {
  if (this._matrix.has(y, z, x)) {
    const voxel = this._matrix.get(y, z, x);
    if (!(voxel & Outliner._FACES.front)) {
      this._split(x, y, z - 1, Outliner.OPPOSITE_FACES.front);
    }
    if (!(voxel & Outliner._FACES.right)) {
      this._split(x + 1, y, z, Outliner.OPPOSITE_FACES.right);
    }
    if (!(voxel & Outliner._FACES.up)) {
      this._split(x, y + 1, z, Outliner.OPPOSITE_FACES.up);
    }
    if (!(voxel & Outliner._FACES.back)) {
      this._split(x, y, z + 1, Outliner.OPPOSITE_FACES.back);
    }
    if (!(voxel & Outliner._FACES.left)) {
      this._split(x - 1, y, z, Outliner.OPPOSITE_FACES.left);
    }
    if (!(voxel & Outliner._FACES.down)) {
      this._split(x, y - 1, z, Outliner.OPPOSITE_FACES.down);
    }
    this._matrix.erase(y, z, x);
  }
};

Node.prototype.inorder = function (callback) {
  this.left && this.left.inorder(callback);
  callback(this.z, this.x, this.y, this.value);
  this.right && this.right.inorder(callback);
};

Outliner.prototype.each = function (callback) {
  this._matrix.execute('inorder', callback);
};
