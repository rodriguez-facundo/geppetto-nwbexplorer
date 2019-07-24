import React, { lazy, Suspense } from 'react';
const NWBPlot = lazy(() => import('./NWBPlot'));
import FileExplorerPage from './pages/FileExplorerPage';
import Metadata from './Metadata';
import NWBListViewer from './reduxconnect/NWBListViewerContainer';
import ImageViewer from './ImageViewer';

export default class WidgetFactory{

  constructor () {

    this.widgets = {};
  }

  /**
   * Widget configuration is the same we are using in the flexlayout actions
   *
   * @param { id, name, component, panelName, [instancePath], * } widgetConfig 
   */
  factory (widgetConfig) {

    // With this lazy construction we avoidto trigger an update on every layout event.
    if (!this.widgets[widgetConfig.id]) {
      this.widgets[widgetConfig.id] = this.newWidget(widgetConfig);
    }
    
    return this.widgets[widgetConfig.id];
  }
  
  updateWidget (widgetConfig) {
    this.widgets[widgetConfig.id] = this.newWidget(widgetConfig);
    return this.widgets[widgetConfig.id];
  }
  
  newWidget (widgetConfig) {
    const component = widgetConfig.component;
    
    if (component === "Explorer" ) { 
      return <FileExplorerPage />;
          
    } else if (component === "Metadata" ) { 
      const { instancePath } = widgetConfig;
      return instancePath ? <Metadata instancePath = { instancePath } /> : '';
    
    } else if (component === "Image" ) { 
      const { instancePath } = widgetConfig;
      if (!instancePath){
        throw new Error('Image widget instancePath must be configured')
      }
      return <ImageViewer instancePath = { instancePath } />;
    
    } else if (component === "Plot" ) { 
      const { instancePath, color } = widgetConfig;
      if (!instancePath){
        throw new Error('Plot widget instancePath must be configured')
      }
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <NWBPlot instancePath={ instancePath } color={ color }/>
        </Suspense>
      )
    } else if (component.match("ListViewer")) {
      const { pathPattern } = widgetConfig;
   
      return <NWBListViewer pathPattern={pathPattern}></NWBListViewer>;
  
    }
  }

} 