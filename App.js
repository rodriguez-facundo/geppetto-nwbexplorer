import React from 'react';
import MainTemplate from './pages/MainTemplate';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { grey, blueGrey } from '@material-ui/core/colors';

import Console from 'geppetto-client/js/components/interface/console/Console';
import TabbedDrawer from 'geppetto-client/js/components/interface/drawer/TabbedDrawer';
import PythonConsole from 'geppetto-client/js/components/interface/pythonConsole/PythonConsole';

/*
 * list of props here --> https://github.com/mui-org/material-ui/blob/master/src/styles/baseThemes/lightBaseTheme.js
 * const customTheme = {
 *   palette: {
 *     primary1Color: grey[500],
 *     primary2Color: blueGrey[900],
 *     primary3Color: '#b0ac9a',
 *     pickerHeaderColor: '#b0ac9a',
 *   }
 * };
 */

var customTheme = {
  typography: { useNextVariants: true },
  palette: {
    primary: { main: grey[500] },
    secondary: { main: blueGrey[900] },
    ternary: { main: '#b0ac9a' }
  }
}

const theme = createMuiTheme({ customTheme });

export default class App extends React.Component {

  render () {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <MainTemplate />
        </MuiThemeProvider>
        <div id="footer">
          <div id="footerHeader">
            <TabbedDrawer labels={["Console", "Python"]} iconClass={["fa fa-terminal", "fa fa-flask"]}>
              <Console />
              <PythonConsole pythonNotebookPath={"http://" + window.location.hostname + ":" + window.location.port + "/notebooks/notebook.ipynb"} />
            </TabbedDrawer>
          </div>
        </div>
      </div>
    )

  }

}