function Camera() {
  this.position = {
    x: 0,
    y: 1.5,
    z: 0,
  };
  this.angle = {
    x: 0,
    y: 0,
  };
};

Camera.prototype.tick = function (keys) {
  const vx = -Math.sin(this.angle.y) * Flags.velocity;
  const vz = Math.cos(this.angle.y) * Flags.velocity;
  if (keys[87]) {  // W
    this.position.x += vx;
    this.position.z += vz;
  }
  if (keys[65]) {  // A
    this.position.x -= vz;
    this.position.z += vx;
  }
  if (keys[83]) {  // S
    this.position.x -= vx;
    this.position.z -= vz;
  }
  if (keys[68]) {  // D
    this.position.x += vz;
    this.position.z -= vx;
  }
};
