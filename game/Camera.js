function Camera(physics) {
  this._physics = physics;
  this.position = {
    x: 0.5,
    y: 1.5,
    z: 0.5,
  };
  this.velocity = {
    x: 0,
    y: 0,
    z: 0,
  };
  this.angle = {
    x: 0,
    y: 0,
  };
}

Camera.prototype.tick = function (dt, keys) {
  this.velocity.x = 0;
  this.velocity.z = 0;
  if (keys[87]) {  // W
    this.velocity.x -= Math.sin(this.angle.y) * Flags.velocity;
    this.velocity.z += Math.cos(this.angle.y) * Flags.velocity;
  }
  if (keys[65]) {  // A
    this.velocity.x -= Math.cos(this.angle.y) * Flags.velocity;
    this.velocity.z -= Math.sin(this.angle.y) * Flags.velocity;
  }
  if (keys[83]) {  // S
    this.velocity.x += Math.sin(this.angle.y) * Flags.velocity;
    this.velocity.z -= Math.cos(this.angle.y) * Flags.velocity;
  }
  if (keys[68]) {  // D
    this.velocity.x += Math.cos(this.angle.y) * Flags.velocity;
    this.velocity.z += Math.sin(this.angle.y) * Flags.velocity;
  }
  this._physics.tick(dt, this.position, this.velocity);
};
