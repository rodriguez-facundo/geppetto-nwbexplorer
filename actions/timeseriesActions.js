export function plotTimeSeriesAction ($instance$, dispatch){

  let instanceType = $instance$.getVariable().getType();
  if (instanceType.getName() === 'timeseries') {
    const data_path = $instance$.getPath() + '.data';
    let data = Instances.getInstance(data_path);
    const time_path = $instance$.getPath() + '.time';
    let time = Instances.getInstance(time_path);
    if (data.getValue().wrappedObj.value.eClass == 'ImportValue') {
      dispatch(retrieveTimeSeriesAction(data, time));
      return {
        type: "loadingtimeseries",
        payload: { loading: 'Loading time series data' }
      };
    }
    
  } else if (instanceType === 'MDTimeSeries') {
    plotMDTimeSeries($instance$);
  } 
  return {
    type: "plottimeseries",
    payload: { loading: 'Loading file in notebook' }
  };
}

export function retrieveTimeSeriesAction ($instance$) {
  const data_path = $instance$.getPath() + '.data';
  let dataInstance = Instances.getInstance(data_path);
  const time_path = $instance$.getPath() + '.time';
  let timeInstance = Instances.getInstance(time_path);
  dataInstance.getValue().getPath = () => dataInstance.getPath();
  timeInstance.getValue().getPath = () => timeInstance.getPath();


  // Using the resolve capability should be the proper way to resolve the values, but the paths coming from values are not correct
  dataInstance.getValue().resolve(dataValue => {
    timeInstance.getValue().resolve(timeValue => {
      GEPPETTO.ModelFactory.deleteInstance(dataInstance);
      GEPPETTO.ModelFactory.deleteInstance(timeInstance);
      /*
       * w.plotOptions.xaxis.title.font.color = '#2d5a88';
       * w.plotOptions.yaxis.title.font.color = '#2d5a88';
       */
      return {
        type: "plottimeseries",
        payload: { loading: false, timeseries: [{ data: Instances.getInstance(data_path), time: Instances.getInstance(time_path) }] }
      };

    });
  });
}

async function retrieveAndPlotTimeSeries ($instance$) {
  const data_path = $instance$.getPath() + '.data';
  let data = Instances.getInstance(data_path);
  const time_path = $instance$.getPath() + '.time';
  let time = Instances.getInstance(time_path);

  if (data.getValue().wrappedObj.value.eClass == 'ImportValue') {
  // Trick to resolve with the instance path instead than the type path. TODO remove when fixed 
    data.getValue().getPath = () => data.getPath();
    time.getValue().getPath = () => time.getPath();

  
    // Using the resolve capability should be the proper way to resolve the values, but the paths coming from values are not correct
    data.getValue().resolve(dataValue => {
      time.getValue().resolve(timeValue => {
        G.addWidget(0).then(w => {
          GEPPETTO.ModelFactory.deleteInstance(data);
          GEPPETTO.ModelFactory.deleteInstance(time);
          w.plotOptions.xaxis.title.font.color = '#2d5a88';
          w.plotOptions.yaxis.title.font.color = '#2d5a88';
          w.plotXYData(Instances.getInstance(data_path), Instances.getInstance(time_path)).setPosition(130, 100).setName($instance$.getPath());
          if (!w.plotOptions.yaxis.title.text) {
            w.setOptions({ yaxis: { title: { text: 'Arbitrary unit (Au)' } }, margin: { l: 40 } })
          }
        });
      });
    });
  } else {
    G.addWidget(0).then(w => {
      w.plotOptions.xaxis.title.font.color = '#2d5a88'
      w.plotOptions.yaxis.title.font.color = '#2d5a88'
      w.plotXYData(data, time).setPosition(130, 100).setName($instance$.getPath());
      if (!w.plotOptions.yaxis.title.text) {
        w.setOptions({ yaxis: { title: { text: 'Arbitrary unit (Au)' } }, margin: { l: 40 } })
      }
    });
  }
   

  // TODO add the value coming from importValue to current data and time instances
  
}

function plotMDTimeSeries ($instance$) {
  let instanceX = Instances.getInstance($instance$.getPath());
  let instanceX_values = instanceX.getVariable().getWrappedObj().initialValues;
  if (typeof instanceX_values[0].value.value[0] !== 'undefined') {
    if (instanceX_values[0].value.value[0].eClass === 'Image') {
      G.addWidget('CAROUSEL', {
        files: ['data:image/png;base64,' + instanceX_values[0].value.value[0].data],
        onClick: function () {
          return 0;
        },
        onMouseEnter: function () {
          return 0;
        },
        onMouseLeave: function () {
          return 0;
        },
      });
    }
  }
}