import { connect } from 'react-redux';
import NWBListViewer from '../NWBListViewer';
import { showPlot, updateDetailsWidget } from '../../actions/flexlayout';

const mapStateToProps = state => ({ modelSettings: state.nwbfile.modelSettings });

const mapDispatchToProps = dispatch => ({ 
  showPlot: instanceDescriptor => dispatch(showPlot(instanceDescriptor)),
  updateDetailsWidget: path => dispatch(updateDetailsWidget(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NWBListViewer);