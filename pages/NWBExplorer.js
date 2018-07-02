import React, { Component } from 'react';
import ControlPanel from '../../../js/components/interface/controlPanel/controlpanel';
import IconButton from '../../../js/components/controls/iconButton/IconButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

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

export default class NWBExplorer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            model: props.model,
            controlPanelHidden: true,
            plotButtonOpen: false,
            openDialog: false,
            plotsAvailable: []
        };
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

    newPlotWidget(name, image) {
        var that = this;
        G.addWidget(1).then(w => {
            w.setName(name);
            var file = 'http://localhost:8000/static/org.geppetto.frontend/src/main/webapp/extensions/geppetto-nwbexplorer/styles/images/' + image;
            w.$el.append("<img src='" + file + "'/>");
            // var svg = $(w.$el).find("svg")[0];
            // svg.removeAttribute('width');
            // svg.removeAttribute('height');
            // svg.setAttribute('width', '100%');
            // svg.setAttribute('height', '98%');
            that.widgets.push(w);
            w.showHistoryIcon(false);
            w.showHelpIcon(false);
        });
    }

    newPlotWidgetIframe(url) {
        var that = this;
        G.addWidget(1).then(w => {
            w.setName("holoviews prototype");

            w.$el.append("<iframe src='" + url + "' width='100%' height='100%s'/>");
            that.widgets.push(w);
            w.showHistoryIcon(false);
            w.showHelpIcon(false);
        });
    }

    plotFigure(image, plotName) {
        this.newPlotWidget(plotName, image)
    }

    plotHoloviews(url) {
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                let data = JSON.parse(responseJson);
                this.newPlotWidgetIframe(data.url);
            });
    }

    getOpenedWidgets() {
        return this.widgets;
    }

    componentDidMount() {
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Loading NWB file");
        fetch("/api/load")
            .then((response) => response.json())
            .then((responseJson) => {
                GEPPETTO.Manager.loadModel(JSON.parse(responseJson));
                GEPPETTO.CommandController.log("The NWB file was loaded");
                GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);

                let groupsIDs = [];
                let groups = Instances.getInstance("nwb.getVariable().getType().getVariables()").map(function(g){
                    let groupID = g.wrappedObj.id;
                    groupsIDs.push(groupID);
                    return Instances.getInstance(groupID + ".getVariable().getType().getVariables()")
                });

                groups.forEach((g, index) => g.map(x=> Instances.getInstance(groupsIDs[index] + "." + x.wrappedObj.id)));

                GEPPETTO.ControlPanel.setColumnMeta([
                    { "columnName": "path", "order": 1, "locked": false, "displayName": "Path", "source": "$entity$.getPath()" },
                    { "columnName": "sweep", "order": 2, "locked": false, "displayName": "Sweep No.", "source": "$entity$.getPath()" },
                    { "columnName": "controls", "order": 3, "locked": false, "customComponent": GEPPETTO.ControlsComponent, "displayName": "Controls", "source": "", "action": "GEPPETTO.FE.refresh();" }]);
                GEPPETTO.ControlPanel.setColumns(['sweep', 'controls']);
                GEPPETTO.ControlPanel.setDataFilter(function (entities) {
                    return GEPPETTO.ModelFactory.getAllInstancesOfType(window.Model.common.StateVariable).slice(1);
                });
                GEPPETTO.ControlPanel.setControlsConfig(
                    {
                        "VisualCapability": {},
                        "Common":
                            {
                                "plot":
                                    {
                                        "id": "plot",
                                        "actions": [
                                            "G.addWidget(0).then(w=>{w.plotXYData(Instances.getInstance($instance$.getPath()), Instances.getInstance($instance$.getPath().split('.')[0]+\".time\")).setPosition(130,35).setName($instance$.getPath());});"],
                                        "icon": "fa-area-chart",
                                        "label": "Plot",
                                        "tooltip": "Plot Sweep"
                                    }
                            }
                    });
                GEPPETTO.ControlPanel.setControls({ "VisualCapability": [], "Common": ['plot'] });
                GEPPETTO.ControlPanel.addData(Instances);

            });


    }

    handleClick(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            plotButtonOpen: true,
            anchorEl: event.currentTarget,
        });
    }

    handleRequestClose() {
        this.setState({
            plotButtonOpen: false,
        });
    }


    render() {

        var controls = (
            <Menu>
                <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Show mean response" onClick={() => { that.plotFigure('meanresponse.png', 'Mean response') }} />
                <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Show image series stimuli" onClick={() => { that.plotFigure('stimuli.png', 'Image series stimuli') }} />
                <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Show confusion matrix" onClick={() => { that.plotFigure('cm.png', 'Confusion matrix') }} />
                <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Show plots" onClick={() => { that.plotFigure('plots.png', 'Plots') }} />
                <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Show raster" onClick={() => { that.plotFigure('raster.png', 'Raster plot') }} />

                <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Show holoviews" onClick={() => { that.plotHoloviews('/api/holoviews') }} />
            </Menu>
        );

        var that = this;
        return (
            <div id="instantiatedContainer" style={{ height: '100%', width: '100%' }}>
                <div id="logo"></div>
                <div id="controlpanel" style={{ top: 0 }}>
                    <ControlPanel
                        icon={"styles.Modal"}
                        useBuiltInFilters={false}
                    >
                    </ControlPanel>
                </div>
                <IconButton style={{ position: 'absolute', left: 15, top: 100 }} onClick={() => { $('#controlpanel').show(); }} icon={"fa-list"} />
                <div>
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
                        {controls}
                    </Popover>
                </div>
            </div>

        );
    }
}