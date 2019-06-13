import { connect } from 'react-redux';
import Plot from './Plot';


const mapStateToProps = state => ({ model: state.nwbfile.model });

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Plot);