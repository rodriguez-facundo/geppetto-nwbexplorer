import React, { Component, lazy, Suspense } from 'react'
import * as FlexLayout from 'geppetto-client/js/components/interface/flexLayout2/src/index';
import Actions from 'geppetto-client/js/components/interface/flexLayout2/src/model/Actions';
import FileExplorerPage from './pages/FileExplorerPage';
import MetadataContainer from './metadata/MetadataContainer'

const PlotContainer = lazy(() => import('./PlotContainer'));

const json = {
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
              {
                "type": "tab",
                "name": "General",
                "component": "General",
                "id":"general",
                "enableClose":false,
                "enableDrag": false,
                "enableRename": false,
                "enableRenderOnDemand": false,
                "enableMinimize": false,
              },
              {
                "type": "tab",
                "name": "Details",
                "component": "Details",
                "id": "details",
                "enableClose":false,
                "enableDrag": false,
                "enableRename": false,
                "enableRenderOnDemand": false,
                "enableMinimize": false,
              }
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

export default class Flexy extends Component {

  constructor (props) {
    super(props);

    this.model = FlexLayout.Model.fromJson(json);

  }
  
  factory (node) {
    const { model } = this;
    const component = node.getComponent();
    const { widgets, createWidget, activateWidget, hideWidget, maximizeWidget } = this.props;

    node.setEventListener("visibility", event => {
      // Find if there is a tab maximized
      const currentMaximizedWidget = widgets.find(widget => widget.status == "MAXIMIZED");      

      if (event.visible){
        if (currentMaximizedWidget){
          // find if the tab to visualize is hosted by the node that is maximized
          const widget2maximize = model.getMaximizedTabset().getChildren().find(tab => tab.getId() == node.getId())
          if (widget2maximize) {
            maximizeWidget(node.getId())
          } else {
            // activate in the background
            activateWidget(node.getId())  
          }

        } else {
          activateWidget(node.getId())
        }
      } else {
        // if event is visible == false, then hide the tab
        hideWidget(node.getId())
      }
      window.dispatchEvent(new Event('resize'));
    })

    if (component === "Explorer" ) { 
      return <FileExplorerPage />;

    } else if (component === "General" ) { 
      return <MetadataContainer mode="general"/>

    } else if (component === "Details" ) { 
      return <MetadataContainer mode="details"/>

    } else if (component === "Plot" ) { 
      const instancePath = node.getConfig().instancePath;

      return (
        <Suspense fallback={<div>Loading...</div>}>
          <PlotContainer instancePath={{ x: `${instancePath}.time`, y:`${instancePath}.data` }}/>
        </Suspense>
      )
    }
  }

  createPanel (jsonDescription) {
    /*
     * keep code in case we need it later
     * new FlexLayout.TabSetNode(model, { type: "tabset" });
     * const max = Math.max(...panels.map(child => child.getRect().getRight()))
     * panel = panels.find(child => child.getRect().getRight() == max);
     * model.doAction(FlexLayout.Actions.addNode(jsonDescription, panel.getId(), FlexLayout.DockLocation.BOTTOM, 0));
     */
    // TODO: rather than rightPanel, we will have Plot panel, image panel
    this.refs.layout.addTabToTabSet("rightPanel", jsonDescription);
  }

  componentDidUpdate (prevProps, prevState) {
    const { model } = this;
    const { newWidgetDescriptor, finishWidgetCreation, detailsWidgetInstancePath, changeDetailsWidgetInstancePath } = this.props;
    if (newWidgetDescriptor) {
      if (!model.getNodeById(newWidgetDescriptor.id)){
        this.createPanel(newWidgetDescriptor);
        // activateWidget(newWidgetDescriptor.id);
      }
      finishWidgetCreation();
      changeDetailsWidgetInstancePath(newWidgetDescriptor.id)
      // TODO: this updates plotly.js plots to new panel sizes
      window.dispatchEvent(new Event('resize'));
    }
    if (detailsWidgetInstancePath != prevProps.detailsWidgetInstancePath) {
      model.getNodeById('leftPanel')._setSelected(1)
      model.doAction(FlexLayout.Actions.setActiveTabset('details'))
    }
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
    const { widgets, destroyWidget, maximizeWidget } = this.props;
    const maximizedWidget = widgets.find(widget => widget.status == "MAXIMIZED");
    // change widget status
    destroyWidget(action.data.node);
    // check if the current maximized widget is the same than in the action dispatched
    if (maximizedWidget && maximizedWidget.id == action.data.node) {
      // find if there exists another widget in the maximized panel that could take its place
      const panelChildren = model.getActiveTabset().getChildren();
      const index = panelChildren.findIndex(child => child.getId() == action.data.node);
      // Understand if the tab to the left or right of the destroyed tab will be the next one to be maximized
      if (index != -1 && panelChildren.length > 1) {
        if (index == 0) {
          maximizeWidget(panelChildren[1].getId());
        } else {
          maximizeWidget(panelChildren[index - 1].getId());
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