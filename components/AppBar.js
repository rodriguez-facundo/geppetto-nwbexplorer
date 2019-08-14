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
  
  clearCookie(url, token) {
    fetch(url, { 
      method: 'get', 
      headers: new Headers({ 'Authorization': `token ${token}` })
    });
  }

  async componentDidMount () {
    try {
      const response = await fetch('api/clearcookie')
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
      } else {
        const data = await response.json()
        if (data != "empty") {
          setTimeout(this.clearCookie, 15000, 'http://nwb-explorer.com/hub/logout', data.token)
        }
      }    
    } catch (err) {
      console.log('Fetch Error :-S', err);
    }
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
          <Toolbar classes={{ gutters: 'toolbar-gutters' }}>
            <Grid
              container 
              spacing={8}
              justify="space-between"
            >
              <Grid item >
                <header id="main-header">
                  <h1>NWB Explorer<sub>beta</sub></h1>
           
                </header>
              </Grid>

              <Grid item className="icon-container">

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