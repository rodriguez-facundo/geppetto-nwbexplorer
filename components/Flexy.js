import React, { Component } from 'react'

import * as FlexLayout from 'geppetto-client/js/components/interface/flexLayout2/src/index';
import Actions from 'geppetto-client/js/components/interface/flexLayout2/src/model/Actions';
import FileExplorerPage from './pages/FileExplorerPage';

const json = {
  "global": { sideBorders: 8 },
  "layout": {
    "type": "row",
    "weight": 100,
    "id": "root",
    "children": [
      {
        "type": "row",
        "weight": 100,
        "children": [
          {
            "type": "tabset",
            "weight": 100,
            "id": "top",
            "children": [
              {
                "type": "tab",
                "name": "explorer",
                "component": "explorer",
                "id":"explorer",
              }
            ]
          }
        ]
      }
    ]
  },
  "borders": [
    {
      "type": "border",
      "location": "bottom",
      "size": 100,
      "children": [],
      "barSize": 10
    }
  ]
};

export default class Flexy extends Component {

  constructor (props) {
    super(props);

    this.model = FlexLayout.Model.fromJson(json);

  }

  factory (node) {
    let component = node.getComponent();
    node.setEventListener("close", () => {
      console.log("Click on close")
    });
    if (component === "explorer" ) { 
      return <FileExplorerPage />;
    }

  }


  render () {
    
    let clickOnBordersAction = function (node) {
      let idChild = 0;
      let bottomChild = 0;
      let tempModel = node.getModel();
      let modelChildren = tempModel.getRoot().getChildren();
      if (node instanceof FlexLayout.TabNode || node instanceof FlexLayout.TabSetNode) {

        for (let i = 0; i <= (modelChildren.length - 1); i++) {
          if (modelChildren[i].getRect().getBottom() > bottomChild) {
            bottomChild = modelChildren[i].getRect().getBottom();
            idChild = i;
          }
        }
      }
    };
    let key = 0;
    let onRenderTabSet = function (node, renderValues) {
      if (node.getType() === "tabset") {
        renderValues.buttons.push(<div key={key} className="fa fa-window-minimize customIconFlexLayout" onClick={() => {
          this.model.doAction(FlexLayout.Actions.moveNode(node.getSelectedNode().getId(), "border_bottom", FlexLayout.DockLocation.CENTER, 0));
        }} />);
        key++;
      }
    };
    

    return (
      <FlexLayout.Layout
        ref="layout"
        model={this.model}
        factory={this.factory.bind(this)}
        onRenderTabSet={onRenderTabSet}
        clickOnBordersAction={clickOnBordersAction}
      />
    )
  }
}