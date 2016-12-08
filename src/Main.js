var m = new Matrix();

m.set(0, 0, 0, 1);
m.set(1, 0, 0, 1);
m.set(-1, 0, 0, 1);
m.set(0, 1, 0, 1);
m.set(0, -1, 0, 1);

console.dir(m.toJSON());
