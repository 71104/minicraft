function Node(x, y, z, value) {
  this.left = null;
  this.right = null;
  this.height = 1;
  this.x = x;
  this.y = y;
  this.z = z;
  this.value = value;
}

Node.prototype.cmp = function (x, y, z) {
  if (x < this.x) {
    return -1;
  } else if (x > this.x) {
    return 1;
  } else if (y < this.y) {
    return -1;
  } else if (y > this.y) {
    return 1;
  } else if (z < this.z) {
    return -1;
  } else if (z > this.z) {
    return 1;
  } else {
    return 0;
  }
};

Node.height = function (node) {
  if (node) {
    return node.height;
  } else {
    return 0;
  }
};

Node.prototype.updateHeight = function () {
  this.height = 1 + Math.max(Node.height(this.left), Node.height(this.right));
};

Node.prototype.bf = function () {
  return Node.height(this.right) - Node.height(this.left);
};

Node.prototype.rotateLeft = function () {
  const root = this.right;
  this.right = root.left;
  root.left = this;
  this.updateHeight();
  root.updateHeight();
  return root;
};

Node.prototype.rotateRight = function () {
  const root = this.left;
  this.left = root.right;
  root.right = this;
  this.updateHeight();
  root.updateHeight();
  return root;
};

Node.prototype.rotateLeftRight = function () {
  this.left = this.left.rotateLeft();
  this.updateHeight();
  return this.rotateRight();
};

Node.prototype.rotateRightLeft = function () {
  this.right = this.right.rotateRight();
  this.updateHeight();
  return this.rotateLeft();
};

Node.prototype.rebalanceLeft = function () {
  if (this.bf() < -1) {
    if (this.left.bf() > 0) {
      return this.rotateLeftRight();
    } else {
      return this.rotateRight();
    }
  } else {
    return this;
  }
};

Node.prototype.rebalanceRight = function () {
  if (this.bf() > 1) {
    if (this.right.bf() < 0) {
      return this.rotateRightLeft();
    } else {
      return this.rotateLeft();
    }
  } else {
    return this;
  }
};

Node.set = function (node, x, y, z, value) {
  if (node) {
    const cmp = node.cmp(x, y, z);
    if (cmp < 0) {
      node.left = Node.set(node.left, x, y, z, value);
      node.updateHeight();
      node = node.rebalanceLeft();
    } else if (cmp > 0) {
      node.right = Node.set(node.right, x, y, z, value);
      node.updateHeight();
      node = node.rebalanceRight();
    } else {
      node.value = value;
    }
    return node;
  } else {
    return new Node(x, y, z, value);
  }
};

Node.prototype.next = function () {
  var next = this.right;
  if (next) {
    while (next.left) {
      next = next.left;
    }
    return next;
  } else {
    return null;
  }
};

Node._swapField = function (node1, node2, field) {
  const temp = node1[field];
  node1[field] = node2[field];
  node2[field] = temp;
};

Node._swap = function (node1, node2) {
  Node._swapField(node1, node2, 'x');
  Node._swapField(node1, node2, 'y');
  Node._swapField(node1, node2, 'z');
  Node._swapField(node1, node2, 'value');
};

Node.erase = function (node, x, y, z) {
  if (node) {
    const cmp = node.cmp(x, y, z);
    if (cmp < 0) {
      node.left = Node.erase(node.left, x, y, z);
      node.updateHeight();
      return node.rebalanceLeft();
    } else if (cmp > 0) {
      node.right = Node.erase(node.right, x, y, z);
      node.updateHeight();
      return node.rebalanceRight();
    } else if (node.right) {
      const next = node.next();
      Node._swap(node, next);
      node.right = Node.erase(node.right, x, y, z);
      node.updateHeight();
      return node.rebalanceRight();
    } else {
      return node.left;
    }
  } else {
    return null;
  }
};


function Matrix() {
  this._root = null;
};

Matrix.prototype.has = function (x, y, z) {
  var node = this._root;
  while (node) {
    const cmp = node.cmp(x, y, z);
    if (cmp < 0) {
      node = node.left;
    } else if (cmp > 0) {
      node = node.right;
    } else {
      return true;
    }
  }
  return false;
};

Matrix.prototype.get = function (x, y, z) {
  var node = this._root;
  while (node) {
    const cmp = node.cmp(x, y, z);
    if (cmp < 0) {
      node = node.left;
    } else if (cmp > 0) {
      node = node.right;
    } else {
      return node.value;
    }
  }
};

Matrix.prototype.set = function (x, y, z, value) {
  this._root = Node.set(this._root, x, y, z, value);
};

Matrix.prototype.erase = function (x, y, z) {
  this._root = Node.erase(this._root, x, y, z);
};

Matrix.prototype.execute = function (method) {
  if (this._root) {
    return this._root[method]([].shift.call(arguments));
  }
};
