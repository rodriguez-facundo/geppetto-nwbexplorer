import React from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { grey, blueGrey } from '@material-ui/core/colors';

import NWBExplorer from '../NWBExplorer';

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
        { !this.props.embedded
          ? <Grid container className="{classes.root} container" spacing={16}>
            <Grid item sm={12} >
              <header id="main-header">
                <h1>NWB Explorer</h1>
              </header>
           
            </Grid>
          </Grid>
          : ''
        }
        <div className="mainContainer">
          <div className="midContainer">
            <div id="instantiatedContainer" style={{ height: '100%', width: '100%' }}>

              <NWBExplorer />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
       
    </div>;

   
  }
}
