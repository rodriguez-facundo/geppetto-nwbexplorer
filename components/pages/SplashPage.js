import React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { grey, blueGrey } from '@material-ui/core/colors';

import Grid from '@material-ui/core/Grid';

import FileUrlSelector from '../FileUrlSelector';
import FileSampleSelector from '../FileSampleSelector';

import img from '../../resources/splash.jpg';

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

export default class SplashPage extends React.Component{

  render () {
    return <div id="splash">
      <MuiThemeProvider theme={theme}>
        <Grid container className="{classes.root} container" spacing={16}>
          <Grid item sm={12} >
            <header id="main-header">
              <h1>Welcome to NWB Explorer</h1>
              <p>Visualise and understand your neurophysiology data</p>
            </header>
          </Grid>

          <Grid className="sidebar" item xs={12} sm={12} md={6} lg={5} xl={4} >
            <div className="greybox">
              <FileUrlSelector></FileUrlSelector>
            </div>
            <div className="greybox flex-filler">
              <FileSampleSelector></FileSampleSelector>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={7} xl={8} >
            <img src={img} />
          </Grid>
        

        </Grid>
      </MuiThemeProvider>
    </div>;
  }
}