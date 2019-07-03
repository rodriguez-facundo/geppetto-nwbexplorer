import React, { Fragment } from 'react';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { WidgetStatus } from './constants';


export default class Appbar extends React.Component {
  constructor (props) {
    super(props);
    this.exit = this.props.exit ? this.props.exit : () => console.debug('exit not defined in ' + typeof this);
    this.showList = this.props.showList ? this.props.showList : () => console.debug('showPlot not defined in ' + typeof this);
   
  
  }

  componentDidMount () {

  }
  
  componentDidUpdate (prevProps, prevState) {

  }

  
  handleClickBack () {
    this.exit();
  }

  handleShowLists () {
    this.showList('Acquisition', 'nwbfile.acquisition.');
    this.showList('Stimulus', 'nwbfile.stimulus.', WidgetStatus.HIDDEN);
  }
  
  render () {
 
    return (
      <Fragment>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Grid
              container 
              spacing={24}
              justify="space-between"
            >
              <Grid item >
                <Typography variant="h3" color="textSecondary">
                  NWB-Explorer
                </Typography>
              </Grid>

              <Grid item >

                <IconButton
                  onClick={() => this.handleClickBack()}
                >
                  <Icon color="error" className='fa fa-arrow-left' />
                </IconButton>
                
                
                <IconButton 
                  onClick={() => this.handleShowLists()}
                >
                  <Icon color="error" className='fa fa-list' />
                </IconButton>
                
              </Grid>
            </Grid>
          </Toolbar>
          
        </AppBar>
      </Fragment>
    );
  }
}