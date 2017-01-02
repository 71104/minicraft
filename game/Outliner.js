function Outliner(pipeline) {
  this._matrix = new Matrix();
  this._faces = new Faces(pipeline);
}

Outliner.prototype.has = function (x, y, z) {
  return this._matrix.has(y, z, x);
};

Outliner.prototype.get = function (x, y, z) {
  const voxel = this._matrix.get(y, z, x);
  if (voxel) {
    return voxel.type;
  }
};

Outliner.prototype._mergeFront = function (x, y, z, type) {
  if (this._matrix.has(y, --z, x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeBack(voxel);
    if (voxel.internal(type)) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype._mergeRight = function (x, y, z, type) {
  if (this._matrix.has(y, z, ++x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeLeft(voxel);
    if (voxel.internal(type)) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype._mergeTop = function (x, y, z, type) {
  if (this._matrix.has(++y, z, x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeBottom(voxel);
    if (voxel.internal(type)) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype._mergeLeft = function (x, y, z, type) {
  if (this._matrix.has(y, z, --x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeRight(voxel);
    if (voxel.internal(type)) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype._mergeBottom = function (x, y, z, type) {
  if (this._matrix.has(--y, z, x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeTop(voxel);
    if (voxel.internal(type)) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype._mergeBack = function (x, y, z, type) {
  if (this._matrix.has(y, ++z, x)) {
    const voxel = this._matrix.get(y, z, x);
    this._faces.removeFront(voxel);
    if (voxel.internal(type)) {
      this._matrix.erase(y, z, x);
    }
    return true;
  } else {
    return false;
  }
};

Outliner.prototype.set = function (x, y, z, type) {
  if (this._matrix.has(y, z, x)) {
    const voxel = this._matrix.get(y, z, x);
    const previousType = voxel.type;
    if (type !== previousType) {
      voxel.type = type;
      if (voxel.front < 0) {
        this.set(x, y, z - 1, previousType);
      } else {
        this._faces.updateFront(voxel);
      }
      if (voxel.right < 0) {
        this.set(x + 1, y, z, previousType);
      } else {
        this._faces.updateRight(voxel);
      }
      if (voxel.top < 0) {
        this.set(x, y + 1, z, previousType);
      } else {
        this._faces.updateTop(voxel);
      }
      if (voxel.left < 0) {
        this.set(x - 1, y, z, previousType);
      } else {
        this._faces.updateLeft(voxel);
      }
      if (voxel.bottom < 0) {
        this.set(x, y - 1, z, previousType);
      } else {
        this._faces.updateBottom(voxel);
      }
      if (voxel.back < 0) {
        this.set(x, y, z + 1, previousType);
      } else {
        this._faces.updateBack(voxel);
      }
    }
  } else {
    const voxel = new Voxel(x, y, z, type);
    if (!this._mergeFront(x, y, z, type)) {
      this._faces.addFront(voxel);
    }
    if (!this._mergeRight(x, y, z, type)) {
      this._faces.addRight(voxel);
    }
    if (!this._mergeTop(x, y, z, type)) {
      this._faces.addTop(voxel);
    }
    if (!this._mergeLeft(x, y, z, type)) {
      this._faces.addLeft(voxel);
    }
    if (!this._mergeBottom(x, y, z, type)) {
      this._faces.addBottom(voxel);
    }
    if (!this._mergeBack(x, y, z, type)) {
      this._faces.addBack(voxel);
    }
    this._matrix.set(y, z, x, voxel);
  }
};

Outliner.prototype._splitFront = function (x, y, z, type) {
  if (this._matrix.has(y, --z, x)) {
    this._faces.addBack(this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z, type);
  }
};

Outliner.prototype._splitRight = function (x, y, z, type) {
  if (this._matrix.has(y, z, ++x)) {
    this._faces.addLeft(this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z, type);
  }
};

Outliner.prototype._splitTop = function (x, y, z, type) {
  if (this._matrix.has(++y, z, x)) {
    this._faces.addBottom(this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z, type);
  }
};

Outliner.prototype._splitLeft = function (x, y, z, type) {
  if (this._matrix.has(y, z, --x)) {
    this._faces.addRight(this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z, type);
  }
};

Outliner.prototype._splitBottom = function (x, y, z, type) {
  if (this._matrix.has(--y, z, x)) {
    this._faces.addTop(this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z, type);
  }
};

Outliner.prototype._splitBack = function (x, y, z, type) {
  if (this._matrix.has(y, ++z, x)) {
    this._faces.addFront(this._matrix.get(y, z, x));
  } else {
    this.set(x, y, z, type);
  }
};

Outliner.prototype.erase = function (x, y, z) {
  if (this._matrix.has(y, z, x)) {
    const voxel = this._matrix.get(y, z, x);
    this._matrix.erase(y, z, x);
    if (voxel.front < 0) {
      this._splitFront(x, y, z, voxel.type);
    } else {
      this._faces.removeFront(voxel);
    }
    if (voxel.right < 0) {
      this._splitRight(x, y, z, voxel.type);
    } else {
      this._faces.removeRight(voxel);
    }
    if (voxel.top < 0) {
      this._splitTop(x, y, z, voxel.type);
    } else {
      this._faces.removeTop(voxel);
    }
    if (voxel.left < 0) {
      this._splitLeft(x, y, z, voxel.type);
    } else {
      this._faces.removeLeft(voxel);
    }
    if (voxel.back < 0) {
      this._splitBack(x, y, z, voxel.type);
    } else {
      this._faces.removeBack(voxel);
    }
    if (voxel.bottom < 0) {
      this._splitBottom(x, y, z, voxel.type);
    } else {
      this._faces.removeBottom(voxel);
    }
  }
};
