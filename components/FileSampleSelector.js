import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import { loadNWBFileAction } from '../actions/loadFileActions';
const SAMPLE_LINK_FERGUSON = 'https://github.com/OpenSourceBrain/NWBShowcase/raw/master/FergusonEtAl2015/FergusonEtAl2015.nwb';
const SAMPLE_LINK_TIMESERIES = 'https://github.com/OpenSourceBrain/NWBShowcase/raw/master/NWB/time_series_data.nwb';
export class FileSampleSelector extends React.Component {

  constructor (props) {
    super(props);
    this.handleClickLoadFile = this.handleClickLoadFile.bind(this);

    this.state = {};
  } 

  componentDidMount (prevProps, prevState) {
    console.log("Props in FileSampleSelector", this.props);
  }
  componentDidUpdate (prevProps, prevState) {
    console.log("Props in FileSampleSelector", this.props);
  }
  handleClickLoadFile (url) {
    this.props.loadNWBFileAction(url);
  }
  render () {
    

    return (
      <div >
        <h2>Don't have a file to load?</h2>
        <p>Pick a sample and get started!</p>
        <Button
          id="loadFile"
          variant="outlined"
          onClick={ e => this.handleClickLoadFile(SAMPLE_LINK_TIMESERIES)}
          disabled={false}
        >
          Simple time series
        </Button>
        <br />
        <Button
          id="loadFile"
          variant="outlined"
          onClick={ e => this.handleClickLoadFile(SAMPLE_LINK_FERGUSON)}
          disabled={false}
        >
          Ferguson et al.
        </Button>

      </div>
    );
  }
}

FileSampleSelector.defaultProps = {};

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({ loadNWBFileAction: payload => dispatch(loadNWBFileAction(payload)) });

export default connect(mapStateToProps, mapDispatchToProps)(FileSampleSelector);

