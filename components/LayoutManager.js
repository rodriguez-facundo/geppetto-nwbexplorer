import React, { Component, lazy, Suspense } from 'react'
import * as FlexLayout from 'geppetto-client/js/components/interface/flexLayout2/src/index';
import Actions from 'geppetto-client/js/components/interface/flexLayout2/src/model/Actions';
import FileExplorerPage from './pages/FileExplorerPage';
import Metadata from './Metadata';

import { isEqual } from '../Utils';

const Plot = lazy(() => import('./Plot'));

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
    const configuration = this.props.configuration ? this.props.configuration : defaultLayoutConfiguration;
    this.model = FlexLayout.Model.fromJson(configuration);

  }
  componentDidMount () {
    const { widgets } = this.props;
    this.addWidgets(Object.values(widgets));
  }

  componentDidUpdate (prevProps, prevState) {
    const { model } = this;
    const { widgets, detailsWidgetInstancePath } = this.props;
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
        this.createPanel(newWidgetDescriptor);
      }
      // This updates plotly.js plots to new panel sizes
      
    }
    window.dispatchEvent(new Event('resize'));
  }

  updateWidgets (widgets) {

    for (let widget of widgets) {

      this.updateWidget(widget);
      // This updates plotly.js plots to new panel sizes
      if (widget.status == 'ACTIVE') {
        // this.model.getNodeById(widget.panelName)._setSelected(1)
        this.model.doAction(FlexLayout.Actions.selectTab(widget.id))
      }
      
    }
    window.dispatchEvent(new Event('resize'));
  }

  updateWidget (widget) {
    this.model.doAction(Actions.updateNodeAttributes(widget.id, this.createWidgetDescription(widget)));
  }

  activateWidget (nodeId) {
    console.warn("TODO activateWidget")
    // TODO
  }


  hideWidget (nodeId) {
    console.warn("TODO hideWidget")
    // TODO
  }


  destroyWidget (nodeId) {
    console.warn("TODO destroyWidget")
    // TODO
  }
  
  factory (node) {
    const { model } = this;
    const component = node.getComponent();
    const { widgets } = this.props;

    node.setEventListener("visibility", event => {
      /*
       * Find if there is a tab maximized
       * const currentMaximizedWidget = Object.vwidgets.find(widget => widget.status == "MAXIMIZED");      
       */

      /*
       * if (event.visible){
       *   if (currentMaximizedWidget){
       *     // find if the tab to visualize is hosted by the node that is maximized
       *     const widget2maximize = model.getMaximizedTabset().getChildren().find(tab => tab.getId() == node.getId())
       *     if (widget2maximize) {
       *       this.maximizeWidget(node.getId())
       *     } else {
       *       // activate in the background
       *       this.activateWidget(node.getId())  
       *     }
       */

      /*
       *   } else {
       *     this.activateWidget(node.getId())
       *   }
       * } else {
       *   // if event is visible == false, then hide the tab
       *   this.hideWidget(node.getId())
       * }
       */
      window.dispatchEvent(new Event('resize'));
    });

    
    // TODO move to WidgetFactory
    if (component === "Explorer" ) { 
      return <FileExplorerPage />;
      
    } else if (component === "Metadata" ) { 
      const { instancePath } = node.getConfig();
      return instancePath ? <Metadata instancePath = { instancePath } /> : '';

    } else if (component === "Plot" ) { 
      
      const { instancePath } = node.getConfig();
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <Plot instancePath={ instancePath}/>
        </Suspense>
      )
    }
  }
  

  /*
   * status could be one of:
   *  - ACTIVE:     the user can see the tab content.
   *  - HIDDEN:       the tab is minimized, or other tab in the node is currently selected.
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

  createPanel (widgetConfiguration) {
    this.refs.layout.addTabToTabSet(widgetConfiguration.panelName, this.createWidgetDescription(widgetConfiguration));
  }

  findNewWidgets (widgets, oldWidgets) {
    return oldWidgets ? Object.values(widgets).filter(({ id }) => !oldWidgets[id]) : Object.values(widgets);
  }

  findUpdatedWidgets (widgets, oldWidgets) {
    return oldWidgets 
      ? Object.values(widgets)
        .filter(widget => oldWidgets[widget.id] && !isEqual(widget, oldWidgets[widget.id])) 
      : Object.values(widgets);
  }
  

  onAction (action) {
    const { model } = this;
    const { detailsWidgetInstancePath, changeDetailsWidgetInstancePath } = this.props;

    if (action.type == Actions.SET_ACTIVE_TABSET){
      const activePanel = model.getActiveTabset();
      if (activePanel) {
        const widget = activePanel.getSelectedNode();
        if (widget) {
          const widgetConfig = widget.getConfig();
  
          if (widgetConfig && widgetConfig.instancePath != undefined && widgetConfig.instancePath != detailsWidgetInstancePath) {
            changeDetailsWidgetInstancePath(widgetConfig.instancePath)
          }
        }
      }
      
    } else if (action.type == Actions.DELETE_TAB) {
      this.deleteWidget(action);

    } else if (action.type == Actions.MAXIMIZE_TOGGLE) {
      this.maximizeWidget(action);

    } 
    if ( Actions.ADJUST_SPLIT == action.type || Actions.MOVE_NODE == action.type || Actions.ADD_NODE == action.type || Actions.MAXIMIZE_TOGGLE == action.type || Actions.DELETE_TAB == action.type){
      // All plots need to resize if panels are resized
      window.dispatchEvent(new Event('resize'));
    }
       
    this.model.doAction(action)
  }

  maximizeWidget (action) {
    const { model } = this;
    const { widgets, maximizeWidget, activateWidget } = this.props;
    const panel2maximize = model.getNodeById(action.data.node);
    
    if (panel2maximize.getChildren().length > 0) {
      const widgetId2maximize = panel2maximize.getSelectedNode().getId();
      const maximizedWidget = widgets.find(widget => widget.status == "MAXIMIZED");
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

  deleteWidget (action) {
    const { model } = this;
    const { widgets } = this.props;
    const maximizedWidget = Object.values(widgets).find(widget => widget.status == "MAXIMIZED");
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
          this.maximizeWidget(panelChildren[1].getId());
        } else {
          this.maximizeWidget(panelChildren[index - 1].getId());
        }
      }
    }
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