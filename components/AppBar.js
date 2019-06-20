import React, { Fragment } from 'react';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ControlPanel from 'geppetto-client/js/components/interface/controlPanel/controlpanel';

import { 
  controlPanelConfig,
  controlPanelColMeta, 
  controlPanelControlConfigs, 
  controlPanelColumns 
} from './configuration/controlPanelConfiguration';


const styles = {
  modal: {
    position: 'absolute !important',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: '999',
    height: '100%',
    width: '100%',
    top: 0
  },
  
  menuItemDiv: {
    fontSize: '12px',
    lineHeight: '28px'
  },
  
  menuItem: {
    lineHeight: '28px',
    minHeight: '28px'
  },
  icon: {
    position: 'absolute',
    left: 15,
  }
};

export default class Appbar extends React.Component {
  constructor (props) {
    super(props);
    window.controlPanelClickAction = this.clickAction.bind(this); // we don't like global variables but we like less putting the code in a string
  }

  componentDidMount () {
    this.initControlPanel();
  }
  
  componentDidUpdate (prevProps, prevState) {
    const {
      widgets, createWidget,
      currentSelectedPlotInstancePath,
      timeseriesDataRetrieveStatus, 
    } = this.props;

    const widget = widgets.find(({ id }) => id == currentSelectedPlotInstancePath);

    if (!widget && timeseriesDataRetrieveStatus != prevProps.timeseriesDataRetrieveStatus) {
      switch (timeseriesDataRetrieveStatus) {

      case "START": {
        this.retrieveTimeSeries(currentSelectedPlotInstancePath)
        break;
      }

      case "COMPLETED": {
        const [ , , tsName ] = currentSelectedPlotInstancePath.split('.', );
        createWidget({
          instancePath: currentSelectedPlotInstancePath,
          id: currentSelectedPlotInstancePath,
          component: "Plot",
          name: tsName,
        })
        break;
      }

      default:
        break;
      }
    }
  }

  async initControlPanel () {
    if (this.refs.controlpanelref !== undefined) {
      this.refs.controlpanelref.setColumnMeta(controlPanelColMeta);
      this.refs.controlpanelref.setColumns(controlPanelColumns);
      this.refs.controlpanelref.setControlsConfig(controlPanelConfig);
      this.refs.controlpanelref.setControls(controlPanelControlConfigs);
    }

    /*
     * Create instances for all variables with getInstance
     * Instances.addInstances seems not to be working, we add with getInstance
     */

    let timeseriesInstances = GEPPETTO.ModelFactory.allPaths.
      // filter(pathobj => ~pathobj.type.indexOf('timeseries')).
      map(pathobj => Instances.getInstance(pathobj.path));


    /*
     * Change the data filter on the control panel
     * Note: await is needed because of setState in the control panel which is asyncronous
     */
    await this.refs.controlpanelref.setDataFilter(function (entities) { 
      /** adds all non-time instances to control panel */
      return entities.
        filter(
          instance => instance.getVariable().getType().getName() === 'timeseries'
        );
    });
    this.refs.controlpanelref.addData(timeseriesInstances);
    this.refs.controlpanelref.open();
  }

  /**
   * Operates on an instance of a state variable and plots in accordance
   */
  clickAction ($instance$) {
    const { 
      widgets, createWidget, requestDataRetrieve,
      currentSelectedPlotInstancePath, 
      changeInstancePathOfCurrentSelectedPlot,
    } = this.props;

    const instancePath = $instance$.getInstancePath();

    const widget = widgets.find(({ id }) => id == instancePath);

    if (currentSelectedPlotInstancePath != instancePath) {
      changeInstancePathOfCurrentSelectedPlot(instancePath)
    }
    
    if (widget){
      if (widget.status == 'DESTROYED') {
        const [ , , tsName ] = instancePath.split('.', );
        createWidget({
          name: tsName,
          instancePath,
          id: instancePath,
        })
      }
    } else {
      requestDataRetrieve()
    }

    this.refs.controlpanelref.close();
  }

  async retrieveTimeSeries (instancePath) {
    const { startDataRetrieve,finishDataRetrieve } = this.props;
    const data_path = instancePath + '.data';
    let data = Instances.getInstance(data_path);
    const time_path = instancePath + '.time';
    let time = Instances.getInstance(time_path);

    if (data.getValue().wrappedObj.value.eClass == 'ImportValue') {
      startDataRetrieve()
      
      // Trick to resolve with the instance path instead than the type path. TODO remove when fixed 
      data.getValue().getPath = () => data.getPath()
      time.getValue().getPath = () => time.getPath()
      GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, 'Loading timeseries data');
    
      // Using the resolve capability should be the proper way to resolve the values, but the paths coming from values are not correct
      data.getValue().resolve(dataValue => {
        time.getValue().resolve(timeValue => {      
          GEPPETTO.ModelFactory.deleteInstance(data),
          GEPPETTO.ModelFactory.deleteInstance(time),
          Instances.getInstance(data_path),
          Instances.getInstance(time_path)
          GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
          finishDataRetrieve()
        })
      })
       
    } else {
      finishDataRetrieve()
    }
    // TODO add the value coming from importValue to current data and time instances
  }

  handleClickBack () {
    const { resetFlexlayoutState, unloadNWBFile } = this.props;
    resetFlexlayoutState()
    unloadNWBFile();
  }
  
  render () {
    const { model } = this.props;
 
    if (!model) {
      return '';
    }
    return (
      <Fragment>
        <div id="controls">
          <div id="controlpanel" style={{ top: 0 }}>
            <ControlPanel
              icon={styles.modal}
              useBuiltInFilters={false}
              controlPanelColMeta={controlPanelColMeta}
              controlPanelConfig={controlPanelConfig}
              columns={controlPanelColumns}
              controlPanelControlConfigs={controlPanelControlConfigs}
              ref="controlpanelref"
            />
          </div>
        </div>
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
                  onClick={() => this.refs.controlpanelref.open()}
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