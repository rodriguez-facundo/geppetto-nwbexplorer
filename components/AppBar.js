import React, { Fragment } from 'react';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ControlPanel from 'geppetto-client/js/components/interface/controlPanel/controlpanel';

import MenuItem from '@material-ui/core/MenuItem';

import { 
  controlPanelConfig,
  controlPanelColMeta, 
  controlPanelControlConfigs, 
  controlPanelColumns 
} from './configuration/controlPanelConfiguration';

import GeppettoPathService from "../services/GeppettoPathService";

import { TS_STATUS } from '../actions/flexlayout';

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
    /*
     * color: 'white',
     * backgroundColor: 'black'
     */
  }
};

const IMAGES_PATH = '/styles/images/';

export default class Appbar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      controlPanelHidden: true,
      plotButtonOpen: false,
      openDialog: false,
    };
    
    this.plotsAvailable = (null);
    this.widgets = [];
    this.plotFigure = this.plotFigure.bind(this);
    this.newPlotWidget = this.newPlotWidget.bind(this);
    this.getOpenedWidgets = this.getOpenedWidgets.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
    // this.toggleInfoPanel = this.toggleInfoPanel.bind(this);
    window.controlPanelClickAction = this.clickAction.bind(this); // we don't like global variables but we like less putting the code in a string


  }
  
  componentDidUpdate (prevProps, prevState) {
    const {
      model, widgets, createWidget,
      changeDetailsWidgetInstancePath,
      currentSelectedPlotInstancePath,
      timeseriesDataRetrieveStatus, 
      requestDataRetrieve
    } = this.props;

    if (!prevProps.model && model) {
      this.initControlPanel();
    }
    const widget = widgets.find(({ id }) => id == currentSelectedPlotInstancePath);


    /*
     * if (prevProps.currentSelectedPlotInstancePath != currentSelectedPlotInstancePath) {    
     *   if (widget){
     *     changeDetailsWidgetInstancePath(currentSelectedPlotInstancePath)
     *   } else {
     *     requestDataRetrieve()
     *   }
     * }
     */

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

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

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

  plotInstance ($instance$) {
    const { widgets } = this.props;
    let instanceX = $instance$;
    let instanceType = $instance$.getVariable().getType();

    const instanceName = $instance$.getName();
    const instancePath = $instance$.getInstancePath();
    const widget = widgets.find(({ id }) => id == instanceName)
    if (!widget) {
      if (instanceType.getName() === 'timeseries') {
        this.retrieveAndPlotTimeSeries($instance$, instanceName, instancePath);
      } else if (instanceType === 'MDTimeSeries') {
        this.plotMDTimeSeries(instanceX);
      } 
    } else if (widget.status == "DESTROYED") {
      // plotInstance($instance$)
    }
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

  plotMDTimeSeries ($instance$) {
    let instanceX = Instances.getInstance($instance$.getPath());
    let instanceX_values = instanceX.getVariable().getWrappedObj().initialValues;
    if (typeof instanceX_values[0].value.value[0] !== 'undefined') {
      if (instanceX_values[0].value.value[0].eClass === 'Image') {
        G.addWidget('CAROUSEL', {
          files: ['data:image/png;base64,' + instanceX_values[0].value.value[0].data],
          onClick: function () {
            return 0;
          },
          onMouseEnter: function () {
            return 0;
          },
          onMouseLeave: function () {
            return 0;
          },
        });
      }
    }
  }

  getOpenedWidgets () {
    return this.widgets;
  }

  static isImage (instance) {
    return false
  }
  

  handleClick (event) {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      plotButtonOpen: true,
      anchorEl: event.currentTarget,
    });
  }


  handleRequestClose () {
    this.setState({ plotButtonOpen: false, });
  }

  /**
   * Handles plots generated on the backend with holoviews
   * Unused, should be revised both on the frontend and backend to work properly
   * @returns {Promise<void>}
   */
  async loadExternalPlots () {
    fetch(GeppettoPathService.serverPath("/api/plots_available"))
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(responseJson => {
        let response = responseJson;
        let plotsAvailable = response.map(function (plot) {
          /** fill plotsAvailable (controls) with the response and with onClick = fetch("api/plot?plot=plot_id") */
          return <MenuItem key={plot.id}
            style={styles.menuItem} innerDivStyle={styles.menuItemDiv}
            primaryText={plot.name}
            onClick={() => {
              this.plotExternalHTML(GeppettoPathService.serverPath('/api/plot?plot=' + plot.id, plot.name))
            }} />
        });
      })
      .catch(error => console.error(error)); //
  }
  newPlotWidget (name, image) {
    let that = this;
    G.addWidget(1).then(w => {
      w.setName(name);
      let file = IMAGES_PATH + image;
      w.$el.append("<img src='" + file + "'/>");
      /*
       * var svg = $(w.$el).find("svg")[0];
       * svg.removeAttribute('width');
       * svg.removeAttribute('height');
       * svg.setAttribute('width', '100%');
       * svg.setAttribute('height', '98%');
       */
      that.widgets.push(w);
      w.showHistoryIcon(false);
      w.showHelpIcon(false);
    });
  }

  /**
   * Injects .html plot in a iframe tag
   * @param name A string that is presented in the widget
   * @param url url to locate plot
   */
  newPlotWidgetIframe (name, url) {
    var that = this;
    G.addWidget(1).then(w => {
      w.setName(name);

      w.$el.append("<iframe src='" + url + "' width='100%' height='100%s'/>");
      that.widgets.push(w);
      w.showHistoryIcon(false);
      w.showHelpIcon(false);
    });
  }

  plotFigure (image, plotName) {
    this.newPlotWidget(plotName, image)
  }

  /**
   * Fetches url to retrieve plot external html
   * @param url url such as api/plot?plot=plot_id
   * @param plot_id
   */
  plotExternalHTML (url, plot_name) {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(responseJson => {
        let data = responseJson;
        this.newPlotWidgetIframe(plot_name, data.url);
      })
      .catch(error => console.error(error));
  }

  handleClickBack () {
    const { deleteAll } = this.props;
    deleteAll()
    let controller;

    Object.values(window.Widgets).forEach(async wtype => {
      controller = await GEPPETTO.WidgetFactory.getController(wtype);
      controller.getWidgets().forEach(w => w.destroy());
    });

    this.props.unloadNWBFile();
    
  }

  handleClose () {
    this.setState({ anchorEl: null })
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
                  onClick={this.handleClickBack}
                >
                  <Icon color="error" className='fa fa-arrow-left' />
                </IconButton>
                
                
                <IconButton 
                  onClick={() => this.refs.controlpanelref.open()}
                >
                  <Icon color="primary" className='fa fa-list' />
                </IconButton>
                
              </Grid>
            </Grid>
          </Toolbar>
          
        </AppBar>
      </Fragment>
    );
  }
}