import React from 'react';
import Grid from '@material-ui/core/Grid';

import FileUrlSelectorContainer from '../FileUrlSelectorContainer';
import FileSampleSelectorContainer from '../FileSampleSelectorContainer';

import img from '../../resources/splash.jpg';
import logo_osb from '../../resources/logos/osb.png';
import logo_openworm from '../../resources/logos/openworm.png';
import logo_metacell from '../../resources/logos/metacell.png';
import logo_gsoc from '../../resources/logos/gsoc.png';
import logo_wellcome from '../../resources/logos/wellcome.png';

export default () => (
  <div id="splash">
    <Grid container className="{classes.root} container" spacing={16}>
      <Grid item sm={12} >
        <header id="main-header">
          <h1>Welcome to NWB Explorer</h1>
          <p>Visualise and understand your neurophysiology data</p>
        </header>
      </Grid>

      <Grid className="sidebar" item xs={12} sm={12} md={6} lg={5} xl={4} >
        <div className="greybox">
          <FileUrlSelectorContainer/>
        </div>
        <div className="greybox flex-filler">
          <FileSampleSelectorContainer/>
        </div>
      </Grid>
      
      <Grid item xs={12} sm={12} md={6} lg={7} xl={8} >
        <img src={img} />
      </Grid>
    </Grid>
  </div>
)
