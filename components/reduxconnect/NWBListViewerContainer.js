import { connect } from 'react-redux';
import NWBListViewer from '../NWBListViewer';

import { showPlot, updateDetailsWidget } from '../../actions/flexlayout';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({ 
  showPlot: instanceDescriptor => dispatch(showPlot(instanceDescriptor)),
  updateDetailsWidget: path => dispatch(updateDetailsWidget(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(NWBListViewer);