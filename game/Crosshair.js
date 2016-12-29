function Crosshair(matrix, camera) {
  this._matrix = matrix;
  this._camera = camera;
  this._heading = {};
  this._box = {
    init: {},
    min: {},
    max: {},
  };
  this._far = true;
  this._active = {};
}

Crosshair.prototype._setActive = function (x, y, z) {
  this._far = false;
  this._active.x = x;
  this._active.y = y;
  this._active.z = z;
  return true;
};

Crosshair.prototype._setFar = function () {
  this._far = true;
  return false;
};

Crosshair.prototype._pickLeft = function () {
  const heading = this._heading;
  const init = this._box.init;
  const min = this._box.min;
  const max = this._box.max;
  if (heading.x < 0 && min.x >= init.x - 2) {
    const position = this._camera.position;
    const y = position.y + heading.y * (min.x - position.x) / heading.x;
    const z = position.z + heading.z * (min.x - position.x) / heading.x;
    if (y >= min.y && y <= max.y && z >= min.z && z <= max.z) {
      const y_ = Math.floor(y);
      const z_ = Math.floor(z);
      if (this._matrix.has(y_, z_, min.x - 1)) {
        return this._setActive(min.x - 1, y_, z_);
      } else {
        min.x--;
        return this._pickLeft();
      }
    }
  }
  return this._pickRight();
};

Crosshair.prototype._pickRight = function () {
  const heading = this._heading;
  const init = this._box.init;
  const min = this._box.min;
  const max = this._box.max;
  if (heading.x > 0 && max.x <= init.x + 3) {
    const position = this._camera.position;
    const y = position.y + heading.y * (max.x - position.x) / heading.x;
    const z = position.z + heading.z * (max.x - position.x) / heading.x;
    if (y >= min.y && y <= max.y && z >= min.z && z <= max.z) {
      const y_ = Math.floor(y);
      const z_ = Math.floor(z);
      if (this._matrix.has(y_, z_, max.x)) {
        return this._setActive(max.x, y_, z_);
      } else {
        max.x++;
        return this._pickLeft();
      }
    }
  }
  return this._pickDown();
};

Crosshair.prototype._pickDown = function () {
  const heading = this._heading;
  const init = this._box.init;
  const min = this._box.min;
  const max = this._box.max;
  if (heading.y < 0 && min.y >= init.y - 2) {
    const position = this._camera.position;
    const x = position.x + heading.x * (min.y - position.y) / heading.y;
    const z = position.z + heading.z * (min.y - position.y) / heading.y;
    if (x >= min.x && x <= max.x && z >= min.z && z <= max.z) {
      const x_ = Math.floor(x);
      const z_ = Math.floor(z);
      if (this._matrix.has(min.y - 1, z_, x_)) {
        return this._setActive(x_, min.y - 1, z_);
      } else {
        min.y--;
        return this._pickLeft();
      }
    }
  }
  return this._pickUp();
};

Crosshair.prototype._pickUp = function () {
  const heading = this._heading;
  const init = this._box.init;
  const min = this._box.min;
  const max = this._box.max;
  if (heading.y > 0 && max.y <= init.y + 3) {
    const position = this._camera.position;
    const x = position.x + heading.x * (max.y - position.y) / heading.y;
    const z = position.z + heading.z * (max.y - position.y) / heading.y;
    if (x >= min.x && x <= max.x && z >= min.z && z <= max.z) {
      const x_ = Math.floor(x);
      const z_ = Math.floor(z);
      if (this._matrix.has(max.y, z_, x_)) {
        return this._setActive(x_, max.y, z_);
      } else {
        max.y++;
        return this._pickLeft();
      }
    }
  }
  return this._pickBack();
};

Crosshair.prototype._pickBack = function () {
  const heading = this._heading;
  const init = this._box.init;
  const min = this._box.min;
  const max = this._box.max;
  if (heading.z < 0 && min.z >= init.z - 2) {
    const position = this._camera.position;
    const x = position.x + heading.x * (min.z - position.z) / heading.z;
    const y = position.y + heading.y * (min.z - position.z) / heading.z;
    if (x >= min.x && x <= max.x && y >= min.y && y <= max.y) {
      const x_ = Math.floor(x);
      const y_ = Math.floor(y);
      if (this._matrix.has(y_, min.z - 1, x_)) {
        return this._setActive(x_, y_, min.z - 1);
      } else {
        min.z--;
        return this._pickLeft();
      }
    }
  }
  return this._pickFront();
};

Crosshair.prototype._pickFront = function () {
  const heading = this._heading;
  const init = this._box.init;
  const min = this._box.min;
  const max = this._box.max;
  if (heading.z > 0 && max.z <= init.z + 3) {
    const position = this._camera.position;
    const x = position.x + heading.x * (max.z - position.z) / heading.z;
    const y = position.y + heading.y * (max.z - position.z) / heading.z;
    if (x >= min.x && x <= max.x && y >= min.y && y <= max.y) {
      const x_ = Math.floor(x);
      const y_ = Math.floor(y);
      if (this._matrix.has(y_, max.z, x_)) {
        return this._setActive(x_, y_, max.z);
      } else {
        max.z++;
        return this._pickLeft();
      }
    }
  }
  return this._setFar();
};

Crosshair.prototype.pick = function () {
  const position = this._camera.position;
  const heading = this._heading;
  heading.x = -Math.sin(this._camera.angle.y);
  heading.y = Math.sin(this._camera.angle.x);
  heading.z = Math.cos(this._camera.angle.y) * Math.cos(this._camera.angle.x);
  const init = this._box.init;
  const min = this._box.min;
  const max = this._box.max;
  init.x = Math.floor(position.x);
  init.y = Math.floor(position.y);
  init.z = Math.floor(position.z);
  min.x = Math.floor(position.x);
  min.y = Math.floor(position.y);
  min.z = Math.floor(position.z);
  max.x = Math.ceil(position.x);
  max.y = Math.ceil(position.y);
  max.z = Math.ceil(position.z);
  return this._pickLeft();
};

Crosshair.prototype.isActive = function (x, y, z) {
  return !this._far &&
    this._active.x === x &&
    this._active.y === y &&
    this._active.z === z;
};
