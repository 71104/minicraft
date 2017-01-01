function Outliner(pipeline) {
  this._matrix = new Matrix();
  this._faces = new Faces(pipeline);
}

Outliner.prototype.has = function (x, y, z) {
  return this._matrix.has(y, z, x);
};

Outliner.prototype._mergeFront = function (x, y, z) {
  if (this._matrix.has(y, --z, x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeBack(voxel);
    if (voxel.internal()) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype._mergeRight = function (x, y, z) {
  if (this._matrix.has(y, z, ++x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeLeft(voxel);
    if (voxel.internal()) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype._mergeTop = function (x, y, z) {
  if (this._matrix.has(++y, z, x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeBottom(voxel);
    if (voxel.internal()) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype._mergeLeft = function (x, y, z) {
  if (this._matrix.has(y, z, --x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeRight(voxel);
    if (voxel.internal()) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype._mergeBottom = function (x, y, z) {
  if (this._matrix.has(--y, z, x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeTop(voxel);
    if (voxel.internal()) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype._mergeBack = function (x, y, z) {
  if (this._matrix.has(y, ++z, x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeFront(voxel);
    if (voxel.internal()) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype.set = function (x, y, z) {
  if (!this._matrix.has(y, z, x)) {
    const voxel = new Voxel(x, y, z);
    if (!this._mergeFront(x, y, z)) {
      this._faces.addFront(x, y, z, voxel);
    }
    if (!this._mergeRight(x, y, z)) {
      this._faces.addRight(x, y, z, voxel);
    }
    if (!this._mergeTop(x, y, z)) {
      this._faces.addTop(x, y, z, voxel);
    }
    if (!this._mergeLeft(x, y, z)) {
      this._faces.addLeft(x, y, z, voxel);
    }
    if (!this._mergeBottom(x, y, z)) {
      this._faces.addBottom(x, y, z, voxel);
    }
    if (!this._mergeBack(x, y, z)) {
      this._faces.addBack(x, y, z, voxel);
    }
    this._matrix.set(y, z, x, voxel);
  }
};

Outliner.prototype._splitFront = function (x, y, z) {
  if (this._matrix.has(y, --z, x)) {
    this._faces.addBack(x, y, z, this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z);
  }
};

Outliner.prototype._splitRight = function (x, y, z) {
  if (this._matrix.has(y, z, ++x)) {
    this._faces.addLeft(x, y, z, this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z);
  }
};

Outliner.prototype._splitTop = function (x, y, z) {
  if (this._matrix.has(++y, z, x)) {
    this._faces.addBottom(x, y, z, this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z);
  }
};

Outliner.prototype._splitLeft = function (x, y, z) {
  if (this._matrix.has(y, z, --x)) {
    this._faces.addRight(x, y, z, this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z);
  }
};

Outliner.prototype._splitBottom = function (x, y, z) {
  if (this._matrix.has(--y, z, x)) {
    this._faces.addTop(x, y, z, this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z);
  }
};

Outliner.prototype._splitBack = function (x, y, z) {
  if (this._matrix.has(y, ++z, x)) {
    this._faces.addFront(x, y, z, this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z);
  }
};

Outliner.prototype.erase = function (x, y, z) {
  if (this._matrix.has(y, z, x)) {
    const voxel = this._matrix.get(y, z, x);
    this._matrix.erase(y, z, x);
    if (voxel.front < 0) {
      this._splitFront(x, y, z);
    } else {
      this._faces.removeFront(voxel);
    }
    if (voxel.right < 0) {
      this._splitRight(x, y, z);
    } else {
      this._faces.removeRight(voxel);
    }
    if (voxel.top < 0) {
      this._splitTop(x, y, z);
    } else {
      this._faces.removeTop(voxel);
    }
    if (voxel.left < 0) {
      this._splitLeft(x, y, z);
    } else {
      this._faces.removeLeft(voxel);
    }
    if (voxel.back < 0) {
      this._splitBack(x, y, z);
    } else {
      this._faces.removeBack(voxel);
    }
    if (voxel.bottom < 0) {
      this._splitBottom(x, y, z);
    } else {
      this._faces.removeBottom(voxel);
    }
  }
};
