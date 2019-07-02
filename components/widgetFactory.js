import React, { lazy, Suspense } from 'react';
const Plot = lazy(() => import('./Plot'));
import FileExplorerPage from './pages/FileExplorerPage';
import Metadata from './Metadata';
import NWBListViewer from './NWBListViewer';

export default function widgetFactory (node) {
  const component = node.getComponent();
  if (component === "Explorer" ) { 
    return <FileExplorerPage />;
        
  } else if (component === "Metadata" ) { 
    const { instancePath } = node.getConfig();
    return instancePath ? <Metadata instancePath = { instancePath } /> : '';
  
  } else if (component === "Plot" ) { 
        
    const { instancePath } = node.getConfig();
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Plot instancePath={ instancePath }/>
      </Suspense>
    )
  } else if (component === "NWBListViewer") {
    const { instancePath } = node.getConfig();
    return <NWBListViewer basePath={instancePath}></NWBListViewer>
  }
}