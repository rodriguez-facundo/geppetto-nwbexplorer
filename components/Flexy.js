import React, { Component } from 'react'
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
    const { model } = this;
    const component = node.getComponent();
    const { nodes, activateNode, hideNode, maximizeNode } = this.props;

    if (!nodes.find(_node => _node.id == node.getId())){
      activateNode(node.getId())
    }

    node.setEventListener("visibility", event => {
      // Find if there is a tab maximized
      const currentMaximizedNode = nodes.find(node => node.status == "MAXIMIZED");      

      if (event.visible){
        if (currentMaximizedNode){
          // find if the tab to visualize is hosted by the node that is maximized
          const node2maximize = model.getMaximizedTabset().getChildren().find(tab => tab.getId() == node.getId())
          if (node2maximize) {
            maximizeNode(node.getId())
          } else {
            // activate in the background
            activateNode(node.getId())  
          }

        } else {
          activateNode(node.getId())
        }
      } else {
        // if event is visible == false, then hide the tab
        hideNode(node.getId())
      }
    })

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

  createTab (json) {
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

  componentDidUpdate (prevProps, prevState) {
    const { model } = this;
    const { newNode, createNode, activateNode } = this.props;
    if (newNode) {
      if (!model.getNodeById(newNode.id)){
        this.createTab(newNode);
        activateNode(newNode.id);
      }
      createNode(false);
    }
  }

  onAction (action) {
    const { model } = this;
    const { nodes, activateNode, maximizeNode, destroyNode } = this.props;
    if (action.type == Actions.DELETE_TAB) {
      // find if a node is maximized
      const maximizedNode = nodes.find(node => node.status == "MAXIMIZED")
      // change node status
      destroyNode(action.data.node)
      // check if the current maximized node is the same that is in the action dispatched
      if (maximizedNode && maximizedNode.id == action.data.node) {
        // find if there exists another tab in the maximized node that could take its place
        const children = model.getActiveTabset().getChildren();
        const index = children.findIndex(child => child.getId() == action.data.node)
        
        if (index != -1 && children.length > 1) {
          if (index == 0) {
            maximizeNode(children[1].getId())  
          } else {
            maximizeNode(children[index - 1].getId())  
          }
        } 
      }
    } else if (action.type == Actions.MAXIMIZE_TOGGLE){
      const node2maximize = model.getNodeById(action.data.node);
      const tabIndex2maximize = node2maximize.getSelected()
      const tabId2maximize = node2maximize.getChildren()[tabIndex2maximize].getId()
      const maximizedTab = nodes.find(node => node.status == "MAXIMIZED");

      if (maximizedTab) {
        if (maximizedTab.id !== tabId2maximize){
          maximizeNode(tabId2maximize)
        } 
        activateNode(maximizedTab.id)
      } else {
        maximizeNode(tabId2maximize)
      }
    }

    this.model.doAction(action)
  }

  clickOnBordersAction (node) {
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
  }

  onRenderTabSet (node, renderValues) {
    if (node.getType() === "tabset") {
      renderValues.buttons.push(<div key={node.getId()} className="fa fa-window-minimize customIconFlexLayout" onClick={() => {
        this.model.doAction(FlexLayout.Actions.moveNode(node.getSelectedNode().getId(), "border_bottom", FlexLayout.DockLocation.CENTER, 0));
      }} />);
    }
  }
  render () {
    

    return (
      <div >
        <FlexLayout.Layout
          ref="layout"
          model={this.model}
          factory={this.factory.bind(this)}
          onAction={action => this.onAction(action)}
          clickOnBordersAction={node => this.clickOnBordersAction(node)}
          onRenderTabSet={(node, renderValues) => this.onRenderTabSet(node, renderValues)}
        />
      </div>
    )
  }
}