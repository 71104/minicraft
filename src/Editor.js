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

  // TODO

});
