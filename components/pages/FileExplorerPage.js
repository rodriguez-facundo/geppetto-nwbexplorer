import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import NWBExplorerContainer from '../NWBExplorerContainer';

const theme = createMuiTheme({
  typography: { 
    useNextVariants: true,
    suppressDeprecationWarnings: true
  },
  palette: {
    primary: { main: grey[500] },
    secondary: { main: '#3E3264' },
    ternary: { main: '#b0ac9a' }
  }
});
export default class FileExplorerPage extends React.Component{


  render () {
    return <div>
      <MuiThemeProvider theme={theme}>
        <div className="mainContainer">
          <div className="midContainer">
            <div id="instantiatedContainer" style={{ height: '100%', width: '100%' }}>
              <NWBExplorerContainer />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
       
    </div>;

   
  }
}
