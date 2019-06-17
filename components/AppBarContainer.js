import { connect } from 'react-redux';
import Appbar from './AppBar';
import { unloadNWBFile, unloadNWBFileInNotebook } from '../actions/nwbfile';
import { enableInfoPanel, disableInfoPanel } from '../actions/general';
import { 
  createWidget, 
  deleteAll, 
  changeDetailsWidgetInstancePath, 
  changeInstancePathOfCurrentSelectedPlot, 
  requestDataRetrieve,
  startDataRetrieve,
  finishDataRetrieve,
} from '../actions/flexlayout';

const mapStateToProps = ({ general, nwbfile, flexlayout }) => ({
  toggleInfoPanel: general.toggleInfoPanel,
  model: nwbfile.model,
  widgets: flexlayout.widgets,
  currentSelectedPlotInstancePath: flexlayout.currentSelectedPlotInstancePath,
  timeseriesDataRetrieveStatus: flexlayout.timeseriesDataRetrieveStatus
});

const mapDispatchToProps = dispatch => ({ 
  enableInfoPanel: () => dispatch(enableInfoPanel),
  disableInfoPanel: () => dispatch(disableInfoPanel),
  unloadNWBFile: () => {
    dispatch(unloadNWBFileInNotebook());
    dispatch(unloadNWBFile);
  },
  createWidget: json => dispatch(createWidget(json)),
  deleteAll: () => dispatch(deleteAll()),
  changeDetailsWidgetInstancePath: instancePath => dispatch(changeDetailsWidgetInstancePath(instancePath)),
  changeInstancePathOfCurrentSelectedPlot: instancePath => dispatch(changeInstancePathOfCurrentSelectedPlot(instancePath)),
  requestDataRetrieve: () => dispatch(requestDataRetrieve()),
  startDataRetrieve: () => dispatch(startDataRetrieve()),
  finishDataRetrieve: () => dispatch(finishDataRetrieve())
});

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);