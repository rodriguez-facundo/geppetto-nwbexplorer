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
      model: props.model,
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
    this.toggleInfoPanel = this.toggleInfoPanel.bind(this);
    window.controlPanelClickAction = this.clickAction.bind(this); // we don't like global variables but we like less putting the code in a string


  }
  
  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.model && this.props.model) {
      this.initControlPanel();
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
    const { changeDetailsWidgetInstancePath } = this.props;
    // TODO handle time series loading with redux actions
    
    // get path for selected timeseries metadata
    changeDetailsWidgetInstancePath($instance$.getInstancePath())    
    
    this.plotInstance($instance$);

    this.refs.controlpanelref.close();
  }

  plotInstance ($instance$) {
    let instanceX = $instance$;
    let instanceType = $instance$.getVariable().getType();
    if (instanceType.getName() === 'timeseries') {
      this.retrieveAndPlotTimeSeries($instance$);
    } else if (instanceType === 'MDTimeSeries') {
      this.plotMDTimeSeries(instanceX);
    } 
    
  }

  async retrieveAndPlotTimeSeries ($instance$) {
    const data_path = $instance$.getPath() + '.data';
    let data = Instances.getInstance(data_path);
    const time_path = $instance$.getPath() + '.time';
    let time = Instances.getInstance(time_path);

    if (data.getValue().wrappedObj.value.eClass == 'ImportValue') {
    // Trick to resolve with the instance path instead than the type path. TODO remove when fixed 
      data.getValue().getPath = () => data.getPath()
      time.getValue().getPath = () => time.getPath()
      GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, 'Loading timeseries data');
    
      // Using the resolve capability should be the proper way to resolve the values, but the paths coming from values are not correct
      data.getValue().resolve(dataValue => {
        time.getValue().resolve(timeValue => {
          G.addWidget(0).then(w => {
            GEPPETTO.ModelFactory.deleteInstance(data);
            GEPPETTO.ModelFactory.deleteInstance(time);
            w.plotOptions.xaxis.title.font.color = '#3E3264'
            w.plotOptions.yaxis.title.font.color = '#3E3264'
            w.plotXYData(Instances.getInstance(data_path), Instances.getInstance(time_path)).setPosition(130, 100).setName($instance$.getPath());
            if (!w.plotOptions.yaxis.title.text) {
              w.setOptions({ yaxis: { title: { text: 'Arbitrary unit (Au)' } }, margin: { l: 40 } })
            }
            GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
          });
        });
      });
    } else {
      G.addWidget(0).then(w => {
        w.plotOptions.xaxis.title.font.color = '#3E3264'
        w.plotOptions.yaxis.title.font.color = '#3E3264'
        w.plotXYData(data, time).setPosition(130, 100).setName($instance$.getPath());
        if (!w.plotOptions.yaxis.title.text) {
          w.setOptions({ yaxis: { title: { text: 'Arbitrary unit (Au)' } }, margin: { l: 40 } })
        }
      });
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


  async createWidget () {
    const w = await G.addWidget(1, { isStateless: true });
    w.setName('Metadata');
    w.setData(window.Instances.nwbfile.metadata);
  }

  async toggleInfoPanel () {
    // TODO move info panel visualization to proper react component logic
    let infoWidgetVisibility = undefined;
    const popUpController = await GEPPETTO.WidgetFactory.getController(1)
    const widgets = popUpController.getWidgets();
    
    widgets.forEach(w => {
      if (w.getName() == 'Metadata') {
        infoWidgetVisibility = w.visible;
        infoWidgetVisibility ? w.hide() : w.show()
      }
    })
      
    if (infoWidgetVisibility === undefined) {
      this.createWidget();
      this.props.enableInfoPanel();
      return;
    }
    
    this.props.disableInfoPanel();
    
  }

  handleClose () {
    this.setState({ anchorEl: null })
  }
  
  render () {
    const { model, createWidget } = this.props;
    

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
                  onClick={ event => {
                    createWidget({
                      type: "tab",
                      name: "General",
                      id: "general",
                      component: "Description",
                      enableRename: false
                    })
                  }}
                >
                  <Icon color="primary" className='fa fa-info' />
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