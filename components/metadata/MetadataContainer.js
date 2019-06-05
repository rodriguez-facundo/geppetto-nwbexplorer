import { connect } from 'react-redux';
import Metadata from './Metadata';


const mapStateToProps = (state, ownProps) => ({ 
  instancePath: state.flexlayout.descriptionTabInstancePath,
  model: state.nwbfile.model,
  mode: ownProps.mode
});

const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps, mapDispatchToProps)(Metadata);