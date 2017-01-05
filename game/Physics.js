function Physics(outliner) {
  this._outliner = outliner;
  this._min = {
    x: 0,
    y: 0,
    z: 0,
  };
  this._max = {
    x: 0,
    y: 0,
    z: 0,
  };
}

Physics.CAMERA_HEIGHT = 1.5;
Physics.PLAYER_RADIUS = 0.35;
Physics.PLAYER_HEIGHT = Physics.CAMERA_HEIGHT + Physics.PLAYER_RADIUS;
Physics.GRAVITY = -9.8;

Physics.prototype._clamp = function (position, x, y, z) {
  if (this._outliner.has(x, y, z)) {
    if (position.x + Physics.PLAYER_RADIUS > x + 1 &&
        position.x - Physics.PLAYER_RADIUS < x + 1 &&
        position.x - Physics.PLAYER_RADIUS > x)
    {
      position.x = x + 1 + Physics.PLAYER_RADIUS;
    } else if (position.x + Physics.PLAYER_RADIUS < x + 1 &&
        position.x + Physics.PLAYER_RADIUS > x &&
        position.x - Physics.PLAYER_RADIUS < x)
    {
      position.x = x - Physics.PLAYER_RADIUS;
    }
    if (position.y + Physics.PLAYER_RADIUS > y + 1 &&
        position.y - Physics.CAMERA_HEIGHT < y + 1 &&
        position.y - Physics.CAMERA_HEIGHT > y)
    {
      position.y = y + 1 + Physics.CAMERA_HEIGHT;
    } else if (position.y + Physics.PLAYER_RADIUS < y + 1 &&
        position.y + Physics.PLAYER_RADIUS > y &&
        position.y - Physics.CAMERA_HEIGHT < y)
    {
      position.y = y - Physics.PLAYER_RADIUS;
    }
    if (position.z + Physics.PLAYER_RADIUS > z + 1 &&
        position.z - Physics.PLAYER_RADIUS < z + 1 &&
        position.z - Physics.PLAYER_RADIUS > z)
    {
      position.z = z + 1 + Physics.PLAYER_RADIUS;
    } else if (position.z + Physics.PLAYER_RADIUS < z + 1 &&
        position.z + Physics.PLAYER_RADIUS > z &&
        position.z - Physics.PLAYER_RADIUS < z)
    {
      position.z = z - Physics.PLAYER_RADIUS;
    }
  }
};

Physics.prototype._clampCenters = function (x0, y0, z0, x1, y1, z1, position) {
  for (var y = y0 + 1; y < y1; y++) {
    for (var z = z0 + 1; z < z1; z++) {
      this._clamp(position, x0, y, z);
      this._clamp(position, x1, y, z);
    }
  }
  for (var x = x0 + 1; x < x1; x++) {
    for (var z = z0 + 1; z < z1; z++) {
      this._clamp(position, x, y0, z);
      this._clamp(position, x, y1, z);
    }
  }
  for (var x = x0 + 1; x < x1; x++) {
    for (var y = y0 + 1; y < y1; y++) {
      this._clamp(position, x, y, z0);
      this._clamp(position, x, y, z1);
    }
  }
};

Physics.prototype._clampEdges = function (x0, y0, z0, x1, y1, z1, position) {
  for (var x = x0 + 1; x < x1; x++) {
    this._clamp(position, x, y0, z0);
    this._clamp(position, x, y0, z1);
    this._clamp(position, x, y1, z0);
    this._clamp(position, x, y1, z1);
  }
  for (var y = y0 + 1; y < y1; y++) {
    this._clamp(position, x0, y, z0);
    this._clamp(position, x0, y, z1);
    this._clamp(position, x1, y, z0);
    this._clamp(position, x1, y, z1);
  }
  for (var z = z0 + 1; z < z1; z++) {
    this._clamp(position, x0, y0, z);
    this._clamp(position, x0, y1, z);
    this._clamp(position, x1, y0, z);
    this._clamp(position, x1, y1, z);
  }
};

Physics.prototype._clampCorners = function (x0, y0, z0, x1, y1, z1, position) {
  this._clamp(position, x0, y0, z0);
  this._clamp(position, x0, y0, z1);
  this._clamp(position, x0, y1, z0);
  this._clamp(position, x0, y1, z1);
  this._clamp(position, x1, y0, z0);
  this._clamp(position, x1, y0, z1);
  this._clamp(position, x1, y1, z0);
  this._clamp(position, x1, y1, z1);
};

Physics.prototype.tick = function (dt, position, velocity) {
  const x = position.x;
  const y = position.y;
  const z = position.z;
  position.x += velocity.x * dt / 1000;
  position.y += Physics.GRAVITY * dt * dt / 2000000 + velocity.y * dt / 1000;
  position.z += velocity.z * dt / 1000;
  velocity.y += Physics.GRAVITY * dt / 1000;
  const x0 = Math.floor(position.x - Physics.PLAYER_RADIUS);
  const x1 = Math.floor(position.x + Physics.PLAYER_RADIUS);
  const y0 = Math.floor(position.y - Physics.CAMERA_HEIGHT);
  const y1 = Math.floor(position.y + Physics.PLAYER_RADIUS);
  const z0 = Math.floor(position.z - Physics.PLAYER_RADIUS);
  const z1 = Math.floor(position.z + Physics.PLAYER_RADIUS);
  this._clampCenters(x0, y0, z0, x1, y1, z1, position);
  this._clampEdges(x0, y0, z0, x1, y1, z1, position);
  this._clampCorners(x0, y0, z0, x1, y1, z1, position);
  velocity.x = position.x - x;
  velocity.y = position.y - y;
  velocity.z = position.z - z;
};
