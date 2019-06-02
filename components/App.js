import React from 'react';
import FlexyContainer from './FlexyContainer';
import ConsoleTabs from './ConsoleTabs';
import SplashPage from './pages/SplashPage';
import nwbFileService from '../services/NWBFileService';
import FileExplorerPage from './pages/FileExplorerPage';
// import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';


import { grey } from '@material-ui/core/colors';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import AppbarContainer from './AppBarContainer'

const theme = createMuiTheme({
  typography: { 
    useNextVariants: true,
    suppressDeprecationWarnings: true
  },
  palette: {
    primary: { main: grey[500] },
    secondary: { main: '#202020' },
    error: { main: '#b0ac9a' },
    text: { secondary: "white" }
  }
});


export default class App extends React.Component{

  constructor (props, context) {
    super(props, context);
  }

  componentDidMount () {
    const { setNWBFile, loadNotebook, notebookReady, nwbFileLoaded } = this.props;
    self = this;
    // A message from the parent frame can specify the file to load
    window.addEventListener('message', event => {

      // Here we would expect some cross-origin check, but we don't do anything more than load a nwb file here
      if (typeof (event.data) == 'string') {
        setNWBFile(event.data);
        // The message may be triggered after the notebook was ready

      }
    });

    if (nwbFileService.getNWBFileUrl()){
      setNWBFile(nwbFileService.getNWBFileUrl());

    }

    loadNotebook();
   
    // When the extension is ready we can communicate with the notebook kernel
    GEPPETTO.on('jupyter_geppetto_extension_ready', data => {
      console.log("Initializing Python extension");
      notebookReady();   

      /*
       * 
       * Utils.execPythonMessage('utils.start_notebook_server()');
       */
    });
    GEPPETTO.on(GEPPETTO.Events.Model_loaded, () => {
      nwbFileLoaded(Model);
    });
       
  }

  componentDidUpdate () {
    const {
      notebookReady, nwbFileUrl, model, nwbFileLoading, loading, 
      loadNWBFile, isLoadedInNotebook, isLoadingInNotebook, loadNWBFileInNotebook
    } = this.props;

    if (notebookReady && nwbFileUrl && !model && !nwbFileLoading ){
      loadNWBFile(nwbFileUrl);
    }

    if (!isLoadedInNotebook && nwbFileUrl && notebookReady && !isLoadingInNotebook) {
      loadNWBFileInNotebook(nwbFileUrl); // We may have missed the loading if notebook was not initialized at the time of the url change
    }

    // It would be better having the spinner as a parametrized react component
    if (loading) {
      const msg = loading;
      setTimeout( () => {
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, msg);
      }, 500);
    } else {
      GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
    }
  }
 
 
  render () {
    const { nwbFileUrl, embedded, showNotebook, isLoadedInNotebook } = this.props;
    
    var page;
    if (nwbFileUrl || embedded) {
      page = (
        <MuiThemeProvider theme={theme}>
          <AppbarContainer/>
          <FlexyContainer />
        </MuiThemeProvider>
      )
    } else {
      page = <SplashPage />
    }

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div id="main-container-inner">
          { page }
          <div id="footer">
            <div id="footerHeader">
              <ConsoleTabs 
                enabled={ showNotebook } 
                hidden={ !isLoadedInNotebook } 
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
}