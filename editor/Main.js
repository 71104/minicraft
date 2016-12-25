$(function () {
  $('#toolbar #tool-group').controlgroup({
    direction: 'vertical',
  });
  $('#toolbar #tool-group input').checkboxradio({
    icon: false,
  });

  const canvas = $('canvas#canvas');
  const width = canvas.width();
  const height = canvas.height();
  canvas.attr({
    width: width,
    height: height,
  });

  const context = canvas.get(0).getContext('2d');

  const view = new View(context, width, height);

  $.loadImage('tile.png').then(function (tile) {
    const stage = new Stage(tile, view);
    stage.render();

    const layerControls = new LayerControls(stage);
    layerControls.renderAll();

    const tilesetControls = new TilesetControls();

    const tools = {
      drag: new DragTool(view, stage),
      stamp: new StampTool(view, stage),
      eraser: new EraserTool(view, stage),
      fill: new FillTool(view, stage),
    };

    var tool = tools.drag;

    $('#tool-group input[name=tool]').click(function () {
      tool = tools[$(this).data('tool')];
    });

    var dragging = false;

    canvas.on('mousedown', function (event) {
      dragging = true;
      tool.down && tool.down(event.clientX, event.clientY) && stage.render();
    }).on('mousemove', function (event) {
      if (dragging) {
        tool.drag && tool.drag(event.clientX, event.clientY) && stage.render();
      } else {
        tool.move && tool.move(event.clientX, event.clientY) && stage.render();
      }
    }).on('mouseup', function (event) {
      dragging = false;
      tool.up && tool.up(event.clientX, event.clientY) && stage.render();
    });

    var overriddenTool = null;

    $(window).on('keydown', function (event) {
      if (event.which === 32 && !dragging && !overriddenTool) {
        overriddenTool = tool;
        tool = tools.drag;
      }
    }).on('keyup', function (event) {
      if (event.which === 32 && overriddenTool) {
        tool = overriddenTool;
        overriddenTool = null;
      }
    });
  });

});
