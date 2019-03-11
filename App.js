import React from 'react';
import MainTemplate from './pages/MainTemplate';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { grey, blueGrey } from '@material-ui/core/colors';

import Console from 'geppetto-client/js/components/interface/console/Console';
import TabbedDrawer from 'geppetto-client/js/components/interface/drawer/TabbedDrawer';
import PythonConsole from 'geppetto-client/js/components/interface/pythonConsole/PythonConsole';

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

export default function App () {
  return <div>
    <MuiThemeProvider theme={theme}>
      <MainTemplate />
    </MuiThemeProvider>
    <div id="footer">
      <div id="footerHeader">
        <TabbedDrawer labels={["Console", "Python"]} iconClass={["fa fa-terminal", "fa fa-flask"]}>
          <Console />
          <PythonConsole pythonNotebookPath={"./notebooks/notebook.ipynb"} />
        </TabbedDrawer>
      </div>
    </div>
  </div>
}