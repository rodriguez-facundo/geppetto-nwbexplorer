import React, { Component, lazy, Suspense } from 'react'
import * as FlexLayout from 'geppetto-client/js/components/interface/flexLayout2/src/index';
import Actions from 'geppetto-client/js/components/interface/flexLayout2/src/model/Actions';


import { WidgetStatus } from './constants';
import { isEqual } from '../Utils';
import widgetFactory from './widgetFactory';


const defaultLayoutConfiguration = {
  "global": { sideBorders: 8 },
  "layout": {
    "type": "row",
    "weight": 100,
    "id": "root",
    "children": [
      {
        "type": "row",
        "weight": 20,
        "children": [
          {
            "type": "tabset",
            "weight": 100,
            "id": "leftPanel",
            "enableDeleteWhenEmpty": false,
            "enableDrop": false,
            "enableDrag": false,
            "enableDivide": false,
            "enableMaximize": false,
            "children": [
            
            ]
          }
        ]
      },
      {
        "type": "row",
        "weight": 80,
        "children": [
          {
            "type": "tabset",
            "weight": 50,
            "id": "rightPanel",
            "enableDeleteWhenEmpty": false,
            "children": [
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

export default class LayoutManager extends Component {

  constructor (props) {
    super(props);
    const layout = this.props.layout ? this.props.layout : defaultLayoutConfiguration;
    this.model = FlexLayout.Model.fromJson(layout);
    this.destroyWidget = this.props.destroyWidget ? this.props.destroyWidget : () => console.debug('destroyWidget not defined');
    this.activateWidget = this.props.activateWidget ? this.props.activateWidget : () => console.debug('activateWidget not defined');
    this.maximizeWidget = this.props.maximizeWidget ? this.props.maximizeWidget : () => console.debug('maximizeWidget not defined');
    this.minimizeWidget = this.props.minimizeWidget ? this.props.minimizeWidget : () => console.debug('minimizeWidget not defined');
    this.widgetFactory = this.props.widgetFactory ? this.props.widgetFactory : widgetFactory;
  }
  componentDidMount () {
    const { widgets } = this.props;
    this.addWidgets(Object.values(widgets));
  }

  componentDidUpdate (prevProps, prevState) {
    const { widgets } = this.props;
    const oldWidgets = prevProps.widgets;
    const newWidgets = this.findNewWidgets(widgets, oldWidgets);
    if (newWidgets) {
      this.addWidgets(newWidgets);
    }
    
    const updatedWidgets = this.findUpdatedWidgets(widgets, oldWidgets);
    if (updatedWidgets) {
      this.updateWidgets(updatedWidgets);
    }


  }

  addWidgets (widgets) {
    const { model } = this;
    for (let newWidgetDescriptor of widgets) {

      if (!model.getNodeById(newWidgetDescriptor.id)) {
        this.addWidget(newWidgetDescriptor);
      } else {
        console.warn('Should not be here in addWidgets...');
      }
      // This updates plotly.js plots to new panel sizes
      
    }
    window.dispatchEvent(new Event('resize'));
  }

  addWidget (widgetConfiguration) {
    this.refs.layout.addTabToTabSet(widgetConfiguration.panelName, this.createWidgetDescription(widgetConfiguration));
  }

  updateWidgets (widgets) {

    for (let widget of widgets) {

      this.updateWidget(widget);
      // This updates plotly.js plots to new panel sizes
      if (widget.status == WidgetStatus.ACTIVE) {
        // this.model.getNodeById(widget.panelName)._setSelected(1)
        this.model.doAction(FlexLayout.Actions.selectTab(widget.id))
      }
      
    }
    window.dispatchEvent(new Event('resize'));
  }

  updateWidget (widget) {
    this.model.doAction(Actions.updateNodeAttributes(widget.id, this.createWidgetDescription(widget)));
  }

  
  factory (node) {
    return this.widgetFactory(node);
  }
  

  /*
   * status could be one of:
   *  - ACTIVE:     the user can see the tab content.
   *  - MINIMIZED:       the tab is minimized, or other tab in the node is currently selected.
   *  - DESTROYED:  the tab was deleted from flexlayout.
   *  - MAXIMIZED:  the tab is maximized (only one tab can be maximized simultaneously)
   */
  createWidgetDescription ({ id, name, component, instancePath, status, panelName }) {
    return {
      id,
      name,
      status,
      component,
      type: "tab",
      enableRename: false,
      // attr defined inside config, will also be available from within flexlayout nodes.  For example:  node.getNodeById(id).getConfig()
      config: { instancePath, panel: panelName },
    };
  }


  findNewWidgets (widgets, oldWidgets) {
    return oldWidgets ? Object.values(widgets).filter(widget => widget && !oldWidgets[widget.id]) : Object.values(widgets);
  }

  findUpdatedWidgets (widgets, oldWidgets) {
    return oldWidgets 
      ? Object.values(widgets)
        .filter(widget => widget && oldWidgets[widget.id] && !isEqual(widget, oldWidgets[widget.id])) 
      : Object.values(widgets);
  }
  

  onAction (action) {
    const { model } = this;
    switch (action.type){
    case FlexLayout.Actions.SET_ACTIVE_TABSET: { // Not clear its use
      const activePanel = model.getActiveTabset();
      if (activePanel) {
        const widget = activePanel.getSelectedNode();
        if (widget) {
          this.activateWidget(action.data.tabNode);
        }
      }
    }
      break;
    case Actions.SELECT_TAB: 
      this.activateWidget(action.data.tabNode);
      break;
    case Actions.DELETE_TAB:
      this.onActionDeleteWidget(action);
      break;
    case Actions.MAXIMIZE_TOGGLE:
      this.onActionMaximizeWidget(action);
      break;
    case Actions.ADJUST_SPLIT:
    case Actions.MOVE_NODE :
    case Actions.ADD_NODE:
      window.dispatchEvent(new Event('resize'));
      break;
    }
       
    this.model.doAction(action)
  }

  onActionMaximizeWidget (action) {
    const { model } = this;
    const { widgets } = this.props;
    const { maximizeWidget, activateWidget } = this;
    const panel2maximize = model.getNodeById(action.data.node);
    
    if (panel2maximize.getChildren().length > 0) {
      const widgetId2maximize = panel2maximize.getSelectedNode().getId();
      const maximizedWidget = this.findMaximizedWidget(widgets);
      if (maximizedWidget) {
        if (maximizedWidget.id !== widgetId2maximize) {
          maximizeWidget(widgetId2maximize);
        }
        activateWidget(maximizedWidget.id);
      
      } else {
        maximizeWidget(widgetId2maximize);
      }
    }
    
  }

  findMaximizedWidget (widgets) {
    return Object.values(widgets).find(widget => widget && widget.status == WidgetStatus.MAXIMIZED);
  }

  onActionDeleteWidget (action) {
    const { model } = this;
    const { widgets } = this.props;
    const maximizedWidget = this.findMaximizedWidget(widgets);
    // change widget status
    this.destroyWidget(action.data.node);
    // check if the current maximized widget is the same than in the action dispatched
    if (maximizedWidget && maximizedWidget.id == action.data.node) {
      // find if there exists another widget in the maximized panel that could take its place
      const panelChildren = model.getActiveTabset().getChildren();
      const index = panelChildren.findIndex(child => child.getId() == action.data.node);
      // Understand if the tab to the left or right of the destroyed tab will be the next one to be maximized
      if (index != -1 && panelChildren.length > 1) {
        if (index == 0) {
          this.onActionMaximizeWidget(panelChildren[1].getId());
        } else {
          this.onActionMaximizeWidget(panelChildren[index - 1].getId());
        }
      }
    }
    window.dispatchEvent(new Event('resize'));
  }


  clickOnBordersAction (node) {
    this.model.doAction(FlexLayout.Actions.moveNode(node.getId(), 'rightPanel', FlexLayout.DockLocation.CENTER, 0));
  }

  onRenderTabSet (panel, renderValues) {
    if (panel.getType() === "tabset") {
      if (panel.getId() != 'leftPanel' && panel.getChildren().length > 0){
        renderValues.buttons.push(<div key={panel.getId()} className="fa fa-window-minimize customIconFlexLayout" onClick={() => {
          this.model.doAction(FlexLayout.Actions.moveNode(panel.getSelectedNode().getId(), "border_bottom", FlexLayout.DockLocation.CENTER, 0));
        }} />);
      }
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