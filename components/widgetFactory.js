import React, { lazy, Suspense } from 'react';
const Plot = lazy(() => import('./Plot'));
import FileExplorerPage from './pages/FileExplorerPage';
import Metadata from './Metadata';
import NWBListViewer from './reduxconnect/NWBListViewerContainer';

/**
 * Widget configuration is the same we are using in the flexlayout actions
 *
 * @param { id, name, component, panelName, [instancePath], * } widgetConfig 
 */
export default function widgetFactory (widgetConfig) {
  const component = widgetConfig.component;
  if (component === "Explorer" ) { 
    return <FileExplorerPage />;
        
  } else if (component === "Metadata" ) { 
    const { instancePath } = widgetConfig;
    return instancePath ? <Metadata instancePath = { instancePath } /> : '';
  
  } else if (component === "Plot" ) { 
        
    const { instancePath, color } = widgetConfig;
    if (!instancePath){
      throw new Error('Plot widget instancePath must be configured')
    }
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Plot instancePath={ instancePath } color={ color }/>
      </Suspense>
    )
  } else if (component.match("ListViewer")) {
    const { pathPattern } = widgetConfig;
    return <NWBListViewer pathPattern={pathPattern}></NWBListViewer>
  }
}