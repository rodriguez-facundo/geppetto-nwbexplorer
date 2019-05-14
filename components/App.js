import React from 'react';
import { connect } from "react-redux";

import nwbFileService from '../services/NWBFileService';
import { setNWBFileAction, loadNWBFileAction, nwbFileLoadedAction } from '../actions/loadFileActions';
import { loadNWBFileInNotebookAction, notebookReadyAction, loadNotebookAction } from '../actions/notebookActions';
import FileExplorerPage from './pages/FileExplorerPage';
import SplashPage from './pages/SplashPage';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import ConsoleTabs from './ConsoleTabs';

class App extends React.Component{

  constructor (props, context) {
    super(props, context);
  }

  componentDidMount () {

    // A message from the parent frame can specify the file to load
    window.addEventListener('message', function (event) {

      // Here we would expect some cross-origin check, but we don't do anything more than load a nwb file here
      if (typeof (event.data) == 'string') {
        this.props.setNWBFileAction(event.data);
      }
    });

    if (nwbFileService.getNWBFileUrl()){
      this.props.setNWBFileAction(nwbFileService.getNWBFileUrl());
    }

    this.props.loadNotebookAction();
   
    // When the extension is ready we can communicate with the notebook kernel
    GEPPETTO.on('jupyter_geppetto_extension_ready', data => {
      console.log("Initializing Python extension");
      this.props.notebookReadyAction();
      // If the file url is set as parameter
      if (this.props.nwbFileUrl && !this.props.model && !this.props.nwbFileLoading){
        this.props.loadNWBFileAction(this.props.nwbFileUrl);
      }
      

      /*
       * 
       * Utils.execPythonMessage('utils.start_notebook_server()');
       */
    });
    GEPPETTO.on(GEPPETTO.Events.Model_loaded, () => {
      this.props.nwbFileLoadedAction(Model);
    });
       
  }

  componentDidUpdate () {
   
    if (!this.props.isLoadedInNotebook && this.props.nwbFileUrl && this.props.notebookReady && !this.props.isLoadingInNotebook) {

      this.props.loadNWBFileInNotebookAction(this.props.nwbFileUrl); // We may have missed the loading if notebook was not initialized at the time of the url change
    }

    // It would be better having the spinner as a parametrized react component
    if (this.props.loading) {
      let msg = this.props.loading;
      setTimeout( () => {
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, msg);
      }, 500);
    } else {
      GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
    }
  }

  isEmbeddedInIframe () {
    return window.location !== window.parent.location;
  }
 
  render () {
    let page = this.props.nwbFileUrl || this.isEmbeddedInIframe() ? FileExplorerPage : SplashPage;

    
    return <div id="main-container-inner">
          
      <Router basename={GEPPETTO_CONFIGURATION.contextPath}>
        <Switch>
          <Route path="/geppetto" component={ page } />
          {/* <Redirect from="/" to="/geppetto" /> */}
        </Switch>
      </Router>
      <div id="footer">
        <div id="footerHeader">
          <ConsoleTabs enabled={ this.props.showNotebook } hidden={ !this.props.isLoadedInNotebook } />
        </div>
      </div>
    </div>
  
  }
  
}

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
  setNWBFileAction: payload => dispatch(setNWBFileAction(payload)),
  loadNWBFileAction: payload => dispatch(loadNWBFileAction(payload)),
  nwbFileLoadedAction: payload => dispatch(nwbFileLoadedAction(payload)),
  loadNWBFileInNotebookAction: payload => dispatch(loadNWBFileInNotebookAction(payload, dispatch)),
  notebookReadyAction: () => dispatch(notebookReadyAction(dispatch)),
  loadNotebookAction: () => dispatch(loadNotebookAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);