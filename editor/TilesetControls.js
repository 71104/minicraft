function TilesetControls() {
  const editorControls = new TileEditorControls();

  $('#add-tile').button({
    icon: 'ui-icon-plus',
    showLabel: false,
  }).click(function () {
    editorControls.show();
  });
  $('#remove-tile').button({
    icon: 'ui-icon-minus',
    showLabel: false,
  }).click(function () {
    // TODO
  });

}
