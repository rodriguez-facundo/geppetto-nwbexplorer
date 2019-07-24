import { connect } from 'react-redux';
import NWBListViewer from '../NWBListViewer';
import { showPlot, showImg, updateDetailsWidget } from '../../actions/flexlayout';

const mapStateToProps = state => ({ modelSettings: state.nwbfile.modelSettings });

const mapDispatchToProps = dispatch => ({ 
  showPlot: instanceDescriptor => dispatch(showPlot(instanceDescriptor)),
  showImg: instanceDescriptor => dispatch(showImg(instanceDescriptor)),
  updateDetailsWidget: path => dispatch(updateDetailsWidget(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NWBListViewer);