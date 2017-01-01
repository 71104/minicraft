function Flags() {}

// capacity of GL buffers (a new buffer is created every time the capacity is
// exceeded)
Flags.facesPerBuffer = 0x20000;

// player's walking velocity in units per tick - dynamic flag
Flags.velocity = 0.1;
