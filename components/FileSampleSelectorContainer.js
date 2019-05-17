import { connect } from "react-redux";
import FileSampleSelector from './FileSampleSelector';
import { loadNWBFile } from '../actions/creators/nwbfile';

FileSampleSelector.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({ loadNWBFile: url => dispatch(loadNWBFile(url)) });

export default connect(mapStateToProps, mapDispatchToProps)(FileSampleSelector);

