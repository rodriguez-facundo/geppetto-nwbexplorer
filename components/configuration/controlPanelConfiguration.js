let controlPanelColMeta = [
  {
    "columnName": "path",
    "order": 1,
    "locked": false,
    "displayName": "Path",
    "source": "$entity$.getPath()"
  },
  {
    "columnName": "controls",
    "order": 3,
    "locked": false,
    "customComponent": GEPPETTO.ControlsComponent,
    "displayName": "Controls",
    "source": "",
    "action": "GEPPETTO.FE.refresh();"
  }
];

let controlPanelConfig = {
  "VisualCapability": {},
  "Common": {
    "plot": {
      "id": "plot",
      "actions": ['controlPanelClickAction($instance$)'],
      "icon": "fa-area-chart",
      "label": "Plot",
      "tooltip": "Plot time series"
    }
  }
};

let controlPanelControlConfigs = {
  "VisualCapability": [],
  "Common": ['plot']
};

let controlPanelColumns = ['path', 'controls'];

module.exports = {
  controlPanelColMeta,
  controlPanelConfig,
  controlPanelControlConfigs,
  controlPanelColumns
};

