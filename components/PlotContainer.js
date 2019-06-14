import { connect } from 'react-redux';
import Plot from './Plot';


const mapStateToProps = ({ nwbfile }, { instancePath }) => ({ 
  instancePath,
  model: nwbfile.model
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Plot);