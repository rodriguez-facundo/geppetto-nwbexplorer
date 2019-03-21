import React, { Component } from 'react';
import ControlPanel from 'geppetto-client/js/components/interface/controlPanel/controlpanel';
import IconButton from 'geppetto-client/js/components/controls/iconButton/IconButton';
import { controlPanelConfig, controlPanelColMeta, controlPanelControlConfigs, controlPanelColumns } from './configuration/controlPanelConfiguration';
/*
 * Temporarely disabled the popover with holoviews plots
 * import Popover from '@material-ui/core/Popover';
 * import MenuItem from '@material-ui/core/MenuItem';
 */
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
  }
};


const IMAGES_PATH = '/styles/images/';


export default class NWBExplorer extends React.Component {

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
  }

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };


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
      .catch(error => console.error(error))
    ;
  }


  getOpenedWidgets () {
    return this.widgets;
  }

  static isImage (instance) {
    return false
  }

  componentDidMount () {
    let that = this;
    if (this.refs.controlpanelref !== undefined) {
      this.refs.controlpanelref.setColumnMeta(controlPanelColMeta);
      this.refs.controlpanelref.setColumns(controlPanelColumns);
      this.refs.controlpanelref.setControlsConfig(controlPanelConfig);
      this.refs.controlpanelref.setControls(controlPanelControlConfigs);
    }


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


  render () {
    var that = this;
    return (
      <div id="instantiatedContainer" style={{ height: '100%', width: '100%' }}>
        <div id="logo"></div>
        <div id="controlpanel" style={{ top: 0 }}>
          <ControlPanel
            icon={"styles.Modal"}
            useBuiltInFilters={false}
            controlPanelColMeta={controlPanelColMeta}
            controlPanelConfig={controlPanelConfig}
            columns={controlPanelColumns}
            controlPanelControlConfigs={controlPanelControlConfigs}
            ref="controlpanelref"
          >
          </ControlPanel>
        </div>
        <IconButton style={{ position: 'absolute', left: 15, top: 100 }} onClick={() => {
          $('#controlpanel').show();
        }} icon={"fa-list"} />
        {/* <div>
          <IconButton
            onClick={this.handleClick}
            style={{ position: 'absolute', left: 15, top: 140 }}
            label="Plot"
            icon={"fa-bar-chart"}

          />
          <Popover
            open={this.state.plotButtonOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={this.handleRequestClose}
          >
            <Menu>
              {that.plotsAvailable}
            </Menu>
          </Popover>
        </div> */}
      </div>

    );
  }
}
