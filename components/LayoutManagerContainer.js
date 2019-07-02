import { connect } from 'react-redux';
import LayoutManager from './LayoutManager';


const mapStateToProps = state => state.flexlayout;

const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps, mapDispatchToProps)(LayoutManager);