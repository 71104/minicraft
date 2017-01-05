function Flags() {}

// capacity of GL buffers (a new buffer is created every time the capacity is
// exceeded)
Flags.facesPerBuffer = 0x20000;

// player's walking velocity in units per second - dynamic flag
Flags.velocity = 4;
