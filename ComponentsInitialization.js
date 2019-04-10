global.jQuery = require("jquery");
global.GEPPETTO_CONFIGURATION = require('./GeppettoConfiguration.json');


require('geppetto-client-initialization');
const ReactDOM = require('react-dom');
const React = require('react');

const Utils = require('./Utils').default;

const App = require('./components/App').default;

// The service is also called from the parent frame to change file
const nwbFileService = require('./services/NWBFileService').default;
const nwbManager = require('./services/NWBGeppettoManager').default;

window.updateFile = nwbFileService.setNWBFileUrl;
require('./styles/main.less');


G.enableLocalStorage(false);
G.setIdleTimeOut(-1);

let app = null;


(function init () {
  GEPPETTO.G.setIdleTimeOut(-1);
  GEPPETTO.G.debug(true); // Change this to true to see messages on the Geppetto console while loading
  GEPPETTO.Resources.COLORS.DEFAULT = "#008ea0";
  GEPPETTO.Manager = nwbManager; // Override standard Geppetto manager
  console.log(Utils);
  GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Initialising NWB explorer");
  console.log("Initializing NWB explorer");
  GEPPETTO.Manager.loadProject({ id:0 }, false);
  // Create router structure
  app = ReactDOM.render(
    <App />
    , document.getElementById('mainContainer')
  );
})();

(async function loadNWBFile () {
  // The first way to specify the file to load is the url parameter "nwbfile"
 

  // The second way is sending a message, for instance from the parent frame
  window.addEventListener('message', async function (event) {

    // Here we would expect some cross-origin check, but we don't do anything more than load a nwb file here
    if (typeof (event.data) == 'string') {
      // The data sent with postMessage is stored in event.data 
      console.debug(event.data);
      nwbFileService.setNWBFileUrl(event.data);
      /*
       * let nwbFileGeppettoModel = await nwbFileService.loadNWBFile();
       * initModel(nwbFileGeppettoModel);
       */

      GEPPETTO.CommandController.execute('Project.loadFromURL("' + nwbFileService.getNWBFileUrl() + '")');
      // GEPPETTO.Manager.resolveImportType(, initModel);
    }
  });
})();


// When the extension is ready we can communicate with the notebook kernel
GEPPETTO.on('jupyter_geppetto_extension_ready', data => {
  console.log("Initializing Python extension");

  Utils.execPythonMessage('from nwb_explorer.nwb_main import main');

  GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner); // Hide  "Initialising NWB explorer"
  if (nwbFileService.getNWBFileUrl() != undefined) {

    /*
     * let nwbFileGeppettoModel = await nwbFileService.loadNWBFile();
     * initModel(nwbFileGeppettoModel);
     */
    GEPPETTO.CommandController.execute('Project.loadFromURL("' + nwbFileService.getNWBFileUrl() + '")');
    // GEPPETTO.Manager.resolveImportType(nwbFileService.getNWBFileUrl(), initModel);
    
  }
  if (!nwbFileService.isLoadedInNotebook()) {
    nwbFileService.loadNWBFileInNotebook(); // We may have missed the loading if notebook was not initialized at the time of the url change
  }
});


GEPPETTO.on(GEPPETTO.Events.Model_loaded, () => {
  // 

  app.setState({ nwbFile: Model }); // triggers the component to reload
  if (Utils.isNotebookLoaded()) {
    this.loadNWBFileInNotebook();
  }


});
