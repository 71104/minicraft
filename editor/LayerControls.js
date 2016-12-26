function LayerControls(stage) {
  this._stage = stage;
  this._min = stage.minLayer();
  this._max = stage.maxLayer();
  this._setup();
}

LayerControls.prototype._setup = function() {
  const that = this;
  const stage = this._stage;
  $('#layer-transparency').checkboxradio().change(function () {
    stage.transparency = $(this).is(':checked');
    stage.render();
  });
  $('#add-layer-above').button().click(function () {
    const k = ++that._max;
    stage.layers[k] = true;
    $('#layer-controls table').prepend(that.renderOne(k));
  });
  $('#add-layer-below').button().click(function () {
    const k = --that._min;
    stage.layers[k] = true;
    $('#layer-controls table').append(that.renderOne(k));
  });
};

LayerControls.prototype.renderOne = function (k) {
  const stage = this._stage;
  const button = $('<button>').button({
    icon: 'ui-icon-close',
    showLabel: false,
  }).click(function () {
    stage.eraseLayer(k, function (count) {
      return !count || window.confirm(
        `Layer ${k} contains ${count} tiles. Do you want to erase all of them?`
        );
    });
    stage.render();
  });
  return $('<tr>')
    .addClass('layer-control')
    .append($('<td>').append($('<input>', {
      type: 'checkbox',
      name: 'enabled',
      checked: true,
    }).change(function () {
      if ($(this).is(':checked')) {
        stage.layers[k] = true;
      } else {
        delete stage.layers[k];
      }
      stage.render();
    })))
    .append($('<td>').addClass('flex').text('Layer ' + k))
    .append($('<td>').append(button))
    .toggleClass('ui-state-active', k === stage.selectedLayer)
    .click(function () {
      $('.layer-control').removeClass('ui-state-active');
      stage.selectedLayer = k;
      $(this).addClass('ui-state-active');
      stage.render();
    });
};

LayerControls.prototype.renderAll = function () {
  const table = $('#layer-controls table').empty();
  for (var k = this._max; k >= this._min; k--) {
    table.append(this.renderOne(k));
  }
  return table;
};
