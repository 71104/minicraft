$(function () {
  $('#toolbar #tool-group').controlgroup();
  $('#toolbar #tool-group input').checkboxradio({
    icon: false,
  });

  var canvas = $('canvas#canvas');
  var width = canvas.width();
  var height = canvas.height();
  canvas.attr({
    width: width,
    height: height,
  });

  var context = canvas.get(0).getContext('2d');

  var matrix = new Matrix();

  function render(tile) {
    context.clearRect(0, 0, width, height);
    matrix.each(function (k, i, j, type) {
      var coordinates = View.project(i, j, k);
      context.drawImage(tile, coordinates.x, coordinates.y - 36);
    });
  }

  $.loadImage('tile.png').then(function (tile) {
    canvas.click(function (event) {
      var coordinates = View.unproject(event.clientX, event.clientY)(0);
      matrix.set(
        coordinates.k,
        coordinates.i,
        coordinates.j,
        1
        );
      render(tile);
    });
  });

});
