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

/**
 * Operates on an instance of a state variable and plots in accordance
 */
function clickAction ($instance$) {
  let instanceX = Instances.getInstance($instance$.getPath());
  let instanceX_values = instanceX.getVariable().getWrappedObj().initialValues;
  if (typeof instanceX_values[0] !== 'undefined') {
    if (instanceX_values[0].value.eClass === 'MDTimeSeries') {
      if (typeof instanceX_values[0].value.value[0] !== 'undefined') {
        if (instanceX_values[0].value.value[0].eClass === 'Image') {
          G.addWidget('CAROUSEL', {
            files: ['data:image/png;base64,' + instanceX_values[0].value.value[0].data],
            onClick: function () {
              return 0;
            },
            onMouseEnter: function () {
              return 0;
            },
            onMouseLeave: function () {
              return 0;
            },
          });
        }
      }
    } else {
      G.addWidget(0).then(w => {
        w.plotXYData(Instances.getInstance($instance$.getPath()), Instances.getInstance($instance$.getPath().split('.')[0] + '.time')).setPosition(130, 35).setName($instance$.getPath());
      });
    }
  }
}
window.controlPanelClickAction = clickAction; // we don't like global variables but this saves us from putting the code in a string 

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
