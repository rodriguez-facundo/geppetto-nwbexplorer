import { connect } from 'react-redux';
import DropDownMenu from '../DropDownMenu';

const mapStateToProps = (state, ownProps) => ({ 
  icon: ownProps.icon,
  widgets: state.flexlayout.widgets
});

export default connect(mapStateToProps)(DropDownMenu)