function TilesetControls() {
  $('#tile-dialog').tabs().dialog({
    autoOpen: false,
    modal: true,
    buttons: {
      Cancel: function () {
        $(this).dialog('close');
      },
    },
  });
  $('#add-tile').button({
    icon: 'ui-icon-plus',
    showLabel: false,
  }).click(function () {
    $('#tile-dialog').dialog('open');
  });
  $('#remove-tile').button({
    icon: 'ui-icon-minus',
    showLabel: false,
  }).click(function () {
    // TODO
  });
}
