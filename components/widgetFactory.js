import React, { lazy, Suspense } from 'react';
const Plot = lazy(() => import('./Plot'));
import FileExplorerPage from './pages/FileExplorerPage';
import Metadata from './Metadata';

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
        <Plot instancePath={ instancePath}/>
      </Suspense>
    )
  }
}