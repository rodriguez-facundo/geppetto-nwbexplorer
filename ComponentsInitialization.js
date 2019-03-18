global.jQuery = require("jquery");
global.GEPPETTO_CONFIGURATION = require('./GeppettoConfiguration.json');


jQuery(function () {
  require('geppetto-client-initialization');
  const ReactDOM = require('react-dom');
  const React = require('react');
  
  const Utils = require('./Utils').default;

  const App = require('./App').default;

  // The service is also called from the parent frame to change file
  const nwbFileService = require('./services/NWBFileService').default;
  
  window.updateFile = nwbFileService.setNWBFileUrl;
  require('./styles/main.less');

  G.enableLocalStorage(false);
  G.setIdleTimeOut(-1);

  // Create router structure
  ReactDOM.render(
    <App />
    , document.getElementById('mainContainer')
  );

  GEPPETTO.G.setIdleTimeOut(-1);
  GEPPETTO.G.debug(true); // Change this to true to see messages on the Geppetto console while loading
  GEPPETTO.Resources.COLORS.DEFAULT = "#008ea0";
  console.log(Utils);
  GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Initialising NWB explorer");
  console.log("Initializing NWB explorer")

  // Support url parameter nwbfile
  if (nwbFileService.getNWBFileUrl() != undefined) {
    nwbFileService.loadNWBFile();
  }

  GEPPETTO.on('jupyter_geppetto_extension_ready', data => {
    console.log("Initializing Python extension");

    Utils.execPythonMessage('from nwb_explorer.nwb_main import main');
   
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);

    if (!nwbFileService.isLoadedInNotebook()) {
      nwbFileService.loadNWBFileInNotebook(); // We may have missed the loading if notebook was not initialized at the time of the url change
    }
  });


  // This allows to change the file from the outside frame
  window.addEventListener('message', function (event) { 

    // Here we would expect some cross-origin check, but we don't do anything more than load a nwb file here
    if (typeof(event.data) == 'string') {
      // The data sent with postMessage is stored in event.data 
      console.debug(event.data); 
      nwbFileService.setNWBFileUrl(event.data);
      nwbFileService.loadNWBFile();
      
    }

    
  }); 

  
});
