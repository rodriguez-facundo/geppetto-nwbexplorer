import App from './App';
import { connect } from "react-redux";
import { setNWBFile, loadNWBFile, nwbFileLoaded, loadNWBFileInNotebook } from '../actions/nwbfile';
import { notebookReady, loadNotebook } from '../actions/notebook';


const mapStateToProps = state => ({
  ...state.nwbfile,
  ...state.general
});

const mapDispatchToProps = dispatch => ({
  loadNotebook: () => dispatch(loadNotebook),
  notebookReady: () => dispatch(notebookReady()),
  loadNWBFileInNotebook: nwbFileUrl => dispatch(loadNWBFileInNotebook(nwbFileUrl, dispatch)),
  nwbFileLoaded: model => dispatch(nwbFileLoaded(model)),
  setNWBFile: nwbFileUrl => dispatch(setNWBFile(nwbFileUrl)),
  loadNWBFile: nwbFileUrl => dispatch(loadNWBFile(nwbFileUrl))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);