import React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { grey, blueGrey } from '@material-ui/core/colors';

import Console from 'geppetto-client/js/components/interface/console/Console';
import TabbedDrawer from 'geppetto-client/js/components/interface/drawer/TabbedDrawer';
import PythonConsole from 'geppetto-client/js/components/interface/pythonConsole/PythonConsole';
import NWBExplorer from './NWBExplorer'

const theme = createMuiTheme({
  typography: { 
    useNextVariants: true,
    suppressDeprecationWarnings: true
  },
  palette: {
    primary: { main: grey[500] },
    secondary: { main: blueGrey[900] },
    ternary: { main: '#b0ac9a' }
  }
});

export default class App extends React.Component{

  constructor (props) {
    super(props);
    this.state = { nwbFile: null };
  }

  render () {
    return <div>
      <MuiThemeProvider theme={theme}>
        <div className="mainContainer">
          <div className="midContainer">
            <div id="instantiatedContainer" style={{ height: '100%', width: '100%' }}>
              <div id="logo"></div>
              {this.state.nwbFile !== null ? <NWBExplorer model={this.state.nwbFile}/> : <div>No file specified</div> }
            </div>
          </div>
        </div>
      </MuiThemeProvider>
      <div id="footer">
        <div id="footerHeader">
          <TabbedDrawer labels={["Console", "Python"]} iconClass={["fa fa-terminal", "fa fa-flask"]}>
            <Console />
            <PythonConsole pythonNotebookPath={"notebooks/notebook.ipynb"} />
          </TabbedDrawer>
        </div>
      </div>
    </div>;
  }
  
}