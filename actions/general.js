const createWidget = async () => {
  const w = await G.addWidget(1, { isStateless: true });
  w.setName('Metadata');
  w.setData(window.Instances.nwbfile.metadata);
}

export const toggleInfoPanel = async (state, action) => {
  let infoWidgetVisibility = undefined;
  const popUpController = await GEPPETTO.WidgetFactory.getController(1)
  const widgets = popUpController.getWidgets();

  widgets.forEach(w => {
    if (w.getName() == 'Metadata') {
      infoWidgetVisibility = w.visible;
      infoWidgetVisibility ? w.hide() : w.show()
    }
  })
  
  if (infoWidgetVisibility === undefined) {
    createWidget()
    return { ...state, toggleInfoPanel: true }
  }

  return { ...state, toggleInfoPanel: !infoWidgetVisibility }

}