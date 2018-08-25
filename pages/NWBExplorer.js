import React, {Component} from 'react';
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

const nwbfile ="./test_data/brain_observatory.nwb"; //TODO: HardCoded for now

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

export default class NWBExplorer extends React.Component {

    constructor(props) {
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
        this.setState({openDialog: false});
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

    /**
     * Injects .html plot in a iframe tag
     * @param name A string that is presented in the widget
     * @param url url to locate plot
     */
    newPlotWidgetIframe(name, url) {
        var that = this;
        G.addWidget(1).then(w => {
            w.setName(name);

            w.$el.append("<iframe src='" + url + "' width='100%' height='100%s'/>");
            that.widgets.push(w);
            w.showHistoryIcon(false);
            w.showHelpIcon(false);
        });
    }

    plotFigure(image, plotName) {
        this.newPlotWidget(plotName, image)
    }

    /**
     * Fetches url to retrieve plot external html
     * @param url url such as api/plot?plot=plot_id
     * @param plot_id
     */
    plotExternalHTML(url, plot_id) {
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then((responseJson) => {
                let data = JSON.parse(responseJson);
                this.newPlotWidgetIframe(plot_id, data.url);
            })
            .catch(error => console.log(error));
    }

    getOpenedWidgets() {
        return this.widgets;
    }

    static isImage(instance) {
        return false
    }

    componentDidMount() {
        var that = this;
        GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Loading NWB file");
        fetch("/api/load/?nwbfile=" + nwbfile)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then((responseJson) => {
                GEPPETTO.Manager.loadModel(JSON.parse(responseJson));
                GEPPETTO.CommandController.log("The NWB file was loaded");
                GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);

                /**
                 * Retrieves instances of state variables
                 * Assuming a group structure such as
                 * nwb.group1
                 * nwb.group2

                 * group1.time
                 * group1.stimulus

                 * group2.time
                 * group2.df_over_f_01
                 * group2.df_over_f_02

                 * where each group entry contains the corresponding data from the nwb file.
                 */

                let groupsIDs = [];
                let groups = Instances.getInstance("nwb.getVariable().getType().getVariables()").map(function (g) {
                    let groupID = g.wrappedObj.id;
                    groupsIDs.push(groupID);
                    return Instances.getInstance(groupID + ".getVariable().getType().getVariables()")
                });

                groups.forEach((g, index) => g.map(x => Instances.getInstance(groupsIDs[index] + "." + x.wrappedObj.id)));

                GEPPETTO.ControlPanel.setColumnMeta([
                    {
                        "columnName": "path",
                        "order": 1,
                        "locked": false,
                        "displayName": "Path",
                        "source": "$entity$.getPath()"
                    },
                    {
                        "columnName": "sweep",
                        "order": 2,
                        "locked": false,
                        "displayName": "Sweep No.",
                        "source": "$entity$.getPath()"
                    },
                    {
                        "columnName": "controls",
                        "order": 3,
                        "locked": false,
                        "customComponent": GEPPETTO.ControlsComponent,
                        "displayName": "Controls",
                        "source": "",
                        "action": "GEPPETTO.FE.refresh();"
                    }]);
                GEPPETTO.ControlPanel.setColumns(['sweep', 'controls']);
                GEPPETTO.ControlPanel.setDataFilter(function (entities) {
                    /** adds all non-time instances to control panel */
                    return GEPPETTO.ModelFactory.getAllInstancesOfType(window.Model.common.StateVariable).filter(x => x.id !== "time")
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
                                            /**
                                             * Operates on an instance of a state variable and plots in accordance
                                             */
                                            "let instanceX = Instances.getInstance($instance$.getPath()); " +
                                            "let instanceX_values = instanceX.getVariable().getWrappedObj().initialValues;" +
                                            "if (typeof instanceX_values[0] !== 'undefined') {" +
                                            "if (instanceX_values[0].value.eClass === 'MDTimeSeries') {" +
                                            "if (typeof instanceX_values[0].value.value[0] !== 'undefined') {" +
                                            "if (instanceX_values[0].value.value[0].eClass === 'Image') {" +
                                            "G.addWidget('CAROUSEL', { " +
                                            "files:['data:image/png;base64,' + instanceX_values[0].value.value[0].data], " +
                                            "onClick:function() {return 0}, " + //Todo: this is a placeholder
                                            "onMouseEnter:function() {return 0}, " +
                                            "onMouseLeave:function() {return 0}, " +
                                            "})" +
                                            "}" +
                                            "}" +
                                            "}" +
                                            "else {" +
                                            "G.addWidget(0).then(w => {" +
                                            "w.plotXYData(Instances.getInstance($instance$.getPath()), Instances.getInstance($instance$.getPath().split('.')[0] + '.time')).setPosition(130, 35).setName($instance$.getPath());" +
                                            "});" +
                                            "}" +
                                            "}"
                                        ],
                                        "icon": "fa-area-chart",
                                        "label": "Plot",
                                        "tooltip": "Plot Sweep"
                                    }
                            }
                    });
                GEPPETTO.ControlPanel.setControls({"VisualCapability": [], "Common": ['plot']});
                GEPPETTO.ControlPanel.addData(Instances);

                fetch("/api/plots_available/")
                    .then((response) => {
                        if (response.ok) {
                            return response.json()
                        } else {
                            throw new Error('Something went wrong');
                        }
                    })
                    .then((responseJson) => {

                        let response = JSON.parse(responseJson);
                        this.plotsAvailable = response.map(function (plot) {
                            /** fill plotsAvailable (controls) with the response and with onClick = fetch("api/plot?plot=plot_id") */
                            return <MenuItem key={plot.id}
                                             style={styles.menuItem} innerDivStyle={styles.menuItemDiv}
                                             primaryText={plot.name}
                                             onClick={() => {
                                                 that.plotExternalHTML('/api/plot/?plot=' + plot.id, plot.id)
                                             }}/>
                        });
                    })
                    .catch(error => console.log(error));

            })
            .catch(error => console.log(error));

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
        var that = this;
        return (
            <div id="instantiatedContainer" style={{height: '100%', width: '100%'}}>
                <div id="logo"></div>
                <div id="controlpanel" style={{top: 0}}>
                    <ControlPanel
                        icon={"styles.Modal"}
                        useBuiltInFilters={false}
                    >
                    </ControlPanel>
                </div>
                <IconButton style={{position: 'absolute', left: 15, top: 100}} onClick={() => {
                    $('#controlpanel').show();
                }} icon={"fa-list"}/>
                <div>
                    <IconButton
                        onClick={this.handleClick}
                        style={{position: 'absolute', left: 15, top: 140}}
                        label="Plot"
                        icon={"fa-bar-chart"}

                    />
                    <Popover
                        open={this.state.plotButtonOpen}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        onRequestClose={this.handleRequestClose}
                    >
                        <Menu>
                            {that.plotsAvailable}
                        </Menu>
                    </Popover>
                </div>
            </div>

        );
    }
}