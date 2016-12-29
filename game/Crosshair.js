function Crosshair(matrix, camera) {
  this._matrix = matrix;
  this._camera = camera;
  this._heading = {};
  this._active = null;
}

Crosshair.prototype.pick = function () {
  const position = this._camera.position;
  const heading = this._heading;
  heading.x = -Math.sin(this._camera.angle.y);
  heading.y = Math.sin(this._camera.angle.x);
  heading.z = Math.cos(this._camera.angle.y) * Math.cos(this._camera.angle.x);
  const x = Math.floor(position.x);
  const y = Math.floor(position.y);
  const z = Math.floor(position.z);
  var x0 = Math.floor(position.x);
  var y0 = Math.floor(position.y);
  var z0 = Math.floor(position.z);
  var x1 = Math.ceil(position.x);
  var y1 = Math.ceil(position.y);
  var z1 = Math.ceil(position.z);
  while (true) {
    if (heading.x < 0 && x0 >= x - 2) {
      const y2 = position.y + heading.y * (x0 - position.x) / heading.x;
      const z2 = position.z + heading.z * (x0 - position.x) / heading.x;
      if (y2 >= y0 && y2 <= y1 && z2 >= z0 && z2 <= z1) {
        const y3 = Math.floor(y2);
        const z3 = Math.floor(z2);
        if (this._matrix.has(y3, z3, x0 - 1)) {
          return this._active = {
            x: x0 - 1,
            y: y3,
            z: z3,
          };
        } else {
          x0--;
          continue;
        }
      }
    }
    if (heading.x > 0 && x1 <= x + 3) {
      const y2 = position.y + heading.y * (x1 - position.x) / heading.x;
      const z2 = position.z + heading.z * (x1 - position.x) / heading.x;
      if (y2 >= y0 && y2 <= y1 && z2 >= z0 && z2 <= z1) {
        const y3 = Math.floor(y2);
        const z3 = Math.floor(z2);
        if (this._matrix.has(y3, z3, x1)) {
          return this._active = {
            x: x1,
            y: y3,
            z: z3,
          };
        } else {
          x1++;
          continue;
        }
      }
    }
    if (heading.y < 0 && y0 >= y - 2) {
      const x2 = position.x + heading.x * (y0 - position.y) / heading.y;
      const z2 = position.z + heading.z * (y0 - position.y) / heading.y;
      if (x2 >= x0 && x2 <= x1 && z2 >= z0 && z2 <= z1) {
        const x3 = Math.floor(x2);
        const z3 = Math.floor(z2);
        if (this._matrix.has(y0 - 1, z3, x3)) {
          return this._active = {
            x: x3,
            y: y0 - 1,
            z: z3,
          };
        } else {
          y0--;
          continue;
        }
      }
    }
    if (heading.y > 0 && y1 <= y + 3) {
      const x2 = position.x + heading.x * (y1 - position.y) / heading.y;
      const z2 = position.z + heading.z * (y1 - position.y) / heading.y;
      if (x2 >= x0 && x2 <= x1 && z2 >= z0 && z2 <= z1) {
        const x3 = Math.floor(x2);
        const z3 = Math.floor(z2);
        if (this._matrix.has(y1, z3, x3)) {
          return this._active = {
            x: x3,
            y: y1,
            z: z3,
          };
        } else {
          y1++;
          continue;
        }
      }
    }
    if (heading.z < 0 && z0 >= z - 2) {
      const x2 = position.x + heading.x * (z0 - position.z) / heading.z;
      const y2 = position.y + heading.y * (z0 - position.z) / heading.z;
      if (x2 >= x0 && x2 <= x1 && y2 >= y0 && y2 <= y1) {
        const x3 = Math.floor(y2);
        const y3 = Math.floor(y2);
        if (this._matrix.has(y3, z0 - 1, x3)) {
          return this._active = {
            x: x3,
            y: y3,
            z: z0 - 1,
          };
        } else {
          z0--;
          continue;
        }
      }
    }
    if (heading.z > 0 && z1 <= z + 3) {
      const x2 = position.x + heading.x * (z1 - position.z) / heading.z;
      const y2 = position.y + heading.y * (z1 - position.z) / heading.z;
      if (x2 >= x0 && x2 <= x1 && y2 >= y0 && y2 <= y1) {
        const x3 = Math.floor(y2);
        const y3 = Math.floor(y2);
        if (this._matrix.has(y3, z1, x3)) {
          return this._active = {
            x: x3,
            y: y3,
            z: z1,
          };
        } else {
          z1++;
          continue;
        }
      }
    }
    return this._active = null;
  }
};

Crosshair.prototype.isActive = function (x, y, z) {
  return this._active &&
    this._active.x === x &&
    this._active.y === y &&
    this._active.z === z;
};
