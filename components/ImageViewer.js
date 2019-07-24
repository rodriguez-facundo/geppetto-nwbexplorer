import React, { Component } from 'react';
import Icon from '@material-ui/core/Icon';
import Zoom from '@material-ui/core/Zoom';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    height: "100%",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-between",
  },
  img: {
    userSelect: "none",
    height: "100%",
    pointerEvents: "none"
  },
  arrowRight: { 
    opacity: 0.5,
    marginRight: "5px", 
    pointerEvents: "none"
  },
  arrowLeft: { 
    opacity: 0.5,
    marginLeft: "10px",
    pointerEvents: "none"
  },
  watermarkLeft:{
    position: "absolute",
    left: "15px",
    bottom: "5px" 
  },
  watermarkRight:{
    position: "absolute",
    right: "15px",
    bottom: "5px" 
  },
  spinner: {
    color: 'dimgray',
    animationDuration: '550ms',
    position: 'absolute',
    top: "20px",
    right: "13px"
  },
  download: { 
    top: "20px",
    left: "15px",
    opacity: 0.5,
    position: "absolute"
  },

});

class ImageViewer extends Component {
  state = { 
    activeStep: 0,
    imageLoading: true
  };

  handleNext = () => {
    this.setState(({ activeStep }) => ({ activeStep: activeStep + 1 }));
    this.setState({ imageLoading: true })
  };

  handleBack = () => {
    this.setState(({ activeStep }) => ({ activeStep:  activeStep - 1 }));
    this.setState({ imageLoading: true })
  };

  clickImage = (e, num_samples) => {
    const { activeStep } = this.state
    const { offsetX } = e.nativeEvent
    const { offsetWidth } = e.target

    if (!e.target.className.includes("download")) {
      if (offsetX > offsetWidth / 2) {
        if (activeStep < num_samples - 1) {
          this.handleNext()
        }
      } else {
        if (activeStep > 0) {
          this.handleBack()
        }
      }
    }
  }


  getTimestamps (instancePath) {
    const values = Instances.getInstance(`${instancePath}.timestamps`).getInitialValue()[0].value.value
    if (!values){
      // If no timestamps
      const num_samples_var = Instances.getInstance(instancePath).getType().getVariables().find(v => v.getName() == "num_samples")
      const num_samples = parseInt(num_samples_var.getInitialValue().value.text)
      return new Array(num_samples).fill(0).map((el, index) => index)
    }

    return values
  }

  newDate (timestamp) {
    return new Date(parseFloat(timestamp) * 1000).toString().replace(/\(.*\)/g, '')
  }

  
  render () {
    const { instancePath, classes } = this.props;
    const { activeStep, hoverImg, imageLoading } = this.state;

    const [ nwbfile, interfase, name ] = instancePath.split('.')
 
    const projectId = Project.getId()
    
    const timestamps = this.getTimestamps(instancePath)
 
    const files = timestamps.map((timestamp, index) => ({
      index,
      timestamp: this.newDate(timestamps[index]),
      path: `/api/image?name=${name}&interface=${interfase}&projectId=${projectId}&index=${index}`
    }))
    
    return (
      <div 
        className={classes.root}
        onClick={e => this.clickImage(e, files.length)}
        onMouseEnter={() => this.setState({ hoverImg: true })}
        onMouseLeave={() => this.setState({ hoverImg: false })}
      >

        <Zoom in={hoverImg} timeout={200}>
          <div className={classes.arrowLeft}>
            <Icon className='fa fa-chevron-left imgBtn' />
          </div>
        </Zoom>

        <img
          className={classes.img}
          src={files[activeStep].path}
          alt={`${name}-${interfase}-${files[activeStep].index}`}
          onLoad={() => this.setState({ imageLoading: false })}
        />

        {imageLoading && <CircularProgress
          size={24}
          thickness={4}
          className={classes.spinner}
        />}

        <p className={classes.watermarkRight}>{files[activeStep].timestamp}</p>
        <p className={classes.watermarkLeft}>{`${activeStep}/${files.length}`}</p>

        <Zoom in={hoverImg} timeout={{ enter: 1000, exit:1500 }}>
          <a download
            className={classes.download} 
            href={files[activeStep].path}
          >
            <Icon className='fa fa-download imgBtn' />
          </a>
        </Zoom>

        <Zoom in={hoverImg} timeout={200}>
          <div className={classes.arrowRight}>
            <Icon className='fa fa-chevron-right imgBtn' />
          </div>
        </Zoom>
        

      </div>
      
      
    );
  }
}

export default withStyles(styles)(ImageViewer);
