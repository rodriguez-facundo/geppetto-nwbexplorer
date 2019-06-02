import React, { Component } from 'react'
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import * as FlexLayout from 'geppetto-client/js/components/interface/flexLayout2/src/index';
import Actions from 'geppetto-client/js/components/interface/flexLayout2/src/model/Actions';
import FileExplorerPage from './pages/FileExplorerPage';
import MetadataContainer from './metadata/MetadataContainer'

const json = {
  "global": { sideBorders: 8 },
  "layout": {
    "type": "row",
    "weight": 100,
    "id": "root",
    "children": [
      {
        "type": "row",
        "weight": 30,
        "children": [
          {
            "type": "tabset",
            "weight": 100,
            "id": "top2",
            "children": [
              {
                "type": "tab",
                "name": "Description",
                "component": "Description",
                "id":"Description",
                "enableRename": false,
              }
            ]
          }
        ]
      },
      {
        "type": "row",
        "weight": 70,
        "children": [
          {
            "type": "tabset",
            "weight": 100,
            "id": "top3",
            "children": [
              {
                "type": "tab",
                "name": "Plot1",
                "component": "Plot",
                "id":"Plot1",
                "enableRename": false
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
    const component = node.getComponent();
    const { nodes, destroyNode, activateNode, minimizeNode } = this.props;
    
    node.setEventListener("close", () => {
      destroyNode(node.getId())
    });
    node.setEventListener("resize", e => {
      node
    });
    node.setEventListener("visibility", event => {
      if (event.visible){
        activateNode(node.getId())
      } else {
        minimizeNode(node.getId())
      }
    }
    
    )
    if (!nodes.find(_node => _node.id == node.getId())){
      activateNode(node.getId())
    }

    if (component === "Explorer" ) { 
      return <FileExplorerPage />;
    } else if (component === "Description" ) { 
      return <MetadataContainer instancePath='nwbfile.metadata' />
    } else if (component === "Plot" ) { 
      return <h3 style={{ marginLeft: '15px' }}>Stay tuned</h3>;
    } else if (component === "Others" ) { 
      return <h3 style={{ marginLeft: '15px' }}>More to come!</h3>;
    }
  }

  reopenUIComponent (json) {
    console.log("CLICK ON REOPEN UI COMPONENT")
    const { model } = this;
    const children = model.getRoot().getChildren();
    let node = new FlexLayout.TabSetNode(model, { type: "tabset", weight: 50 });
    
    if (children.length <= 1) {
      model.getRoot()._addChild(node);
    } else {
      const max = Math.max(...children.map(child => child.getRect().getRight()))
      node = children.find(child => child.getRect().getRight() == max);
    }

    if (node instanceof FlexLayout.TabSetNode || node instanceof FlexLayout.BorderNode || node instanceof FlexLayout.RowNode) {
      model.doAction(FlexLayout.Actions.addNode(json, node.getId(), FlexLayout.DockLocation.BOTTOM, 0));
    }
  }


  restoreUIComponent (componentName) {
    console.log("CLICK ON RESTORE UI COMPONENT")
    const { model } = this;
    const children = model.getRoot().getChildren();
    const borders = model.getBorderSet().getBorders();

    let node = new FlexLayout.TabSetNode(model, { type: "tabset", weight: 50 });

    if (children.length <= 1) {
      model.getRoot()._addChild(node);
    } else {
      const max = Math.max(...children.map(child => child.getRect().getRight()))
      node = children.find(child => child.getRect().getRight() == max);
    }

    borders.forEach(border => {
      border.getChildren().forEach(child => {
        if (child.getComponent() === componentName) {
          if (node instanceof FlexLayout.TabSetNode || node instanceof FlexLayout.BorderNode || node instanceof FlexLayout.RowNode) {
            model.doAction(FlexLayout.Actions.moveNode(child.getId(), node.getId(), FlexLayout.DockLocation.BOTTOM, 0));
          }
          return;
        }
      })
    })
  }
  shouldComponentUpdate (){
    return false;
  }
  

  render () {
    const { nodes, createNode, activateNode, maximizeNode } = this.props;
    const clickOnBordersAction = function (node) {
      const model = node.getModel();
      const children = model.getRoot().getChildren();
      let tabSet = new FlexLayout.TabSetNode(model, { type: "tabset" });

      if (node instanceof FlexLayout.TabNode || node instanceof FlexLayout.TabSetNode) {
        if (children.length <= 1) {
          model.getRoot()._addChild(tabSet);
        } else {
          const max = Math.max(...children.map(child => child.getRect().getRight()))
          tabSet = children.find(child => child.getRect().getRight() == max);
        }
      }
      if (tabSet instanceof FlexLayout.TabSetNode || tabSet instanceof FlexLayout.BorderNode || tabSet instanceof FlexLayout.RowNode) {
        this.model.doAction(FlexLayout.Actions.moveNode(node.getId(), tabSet.getId(), FlexLayout.DockLocation.BOTTOM, 0));
      }
    };

    
    let onAction = function (action) {
      const current = nodes.find(node => node.status == "MAXIMIZED")
      if (current) {
        if (action.type == "FlexLayout_SelectTab"){
          createNode(current.id)
          maximizeNode(action.data.tabNode)
        } else if (action.type == "FlexLayout_MaximizeToggle") {
          createNode(current.id)
        }
      } else if (action.type == "FlexLayout_MaximizeToggle"){
        const { model } = this
        const node = model.getNodeById(action.data.node)
        const activeTab = node.getSelected()
        const name = node.getChildren()[activeTab].getId()

        maximizeNode(name)
        console.log("ACTION DISPATCHING")
        console.log(action)
        console.log("ACTION ")
      }
      
      this.model.doAction(action)
      
      
    };

    let key = 0;
    let onRenderTabSet = function (node, renderValues) {
      console.log("CLICK ON RENDER TAB SET")
      if (node.getType() === "tabset") {
        renderValues.buttons.push(<div key={key} className="fa fa-window-minimize customIconFlexLayout" onClick={() => {
          this.model.doAction(FlexLayout.Actions.moveNode(node.getSelectedNode().getId(), "border_bottom", FlexLayout.DockLocation.CENTER, 0));
        }} />);
        key++;
      }
    };

    return (
      <div >
        <IconButton
          style={{ zIndex: 9999 }}
          onClick={ event => {
            this.reopenUIComponent({
              type: "tab",
              name: "Plot3",
              id: "Plot3",
              component: "Plot",
              enableRename: false
            })
            activateNode("Plot3")
          }}
        >
          <Icon color="primary" className='fa fa-grav' />
        </IconButton>
        <IconButton
          style={{ zIndex: 9999 }}
          onClick={ event => {
            this.restoreUIComponent("Description")
            maximizeNode("Description")
          }}
        >
          <Icon color="primary" className='fa fa-meetup' />
        </IconButton>
        <FlexLayout.Layout
          ref="layout"
          model={this.model}
          factory={this.factory.bind(this)}
          onRenderTabSet={onRenderTabSet}
          clickOnBordersAction={clickOnBordersAction}
          onAction={onAction}
        />
      </div>
      
    )
  }
}