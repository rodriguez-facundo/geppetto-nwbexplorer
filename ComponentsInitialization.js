global.jQuery = require("jquery");
global.GEPPETTO_CONFIGURATION = require('./GeppettoConfiguration.json');

jQuery(function () {
  require('geppetto-client-initialization');
  const ReactDOM = require('react-dom');
  const React = require('react');
  
  const Utils = require('./Utils').default;

  const App = require('./App').default;

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

  GEPPETTO.on('jupyter_geppetto_extension_ready', data => {
    console.log("Initializing Python extension");
    Utils.execPythonMessage('from nwb_explorer.nwb_main import main');
    Utils.execPythonMessage('main()');
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);


    /*
     * ReactDOM.render(
     * ReactDOM.render(<App  />, document.getElementById('mainContainer')));
     * Utils.evalPythonMessage('hnn_geppetto.getData', []).then(response => {
     * let data = Utils.convertToJSON(response);
     */


    // })
  });

  
});
