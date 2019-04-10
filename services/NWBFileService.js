import GeppettoPathService from './GeppettoPathService';
import Utils from '../Utils';
const NWB_FILE_URL_PARAM = 'nwbfile';
// const NWB_FILE_DEFAULT_URL = "https://github.com/OpenSourceBrain/NWBShowcase/raw/master/NWB/time_series_data.nwb";

class NWBFileService {

  constructor () {
    this.nwbfile = undefined;
    this.notebookloaded = false;
  }

  getNWBFileUrl () {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get(NWB_FILE_URL_PARAM)) {
      this.nwbfile = urlParams.get(NWB_FILE_URL_PARAM);
    }
    return this.nwbfile;
  }

  setNWBFileUrl (nwbfile) {
    this.nwbfile = nwbfile;
    console.log("new file", nwbfile);
    this.notebookloaded = false;

  }

  isLoadedInNotebook () {
    return this.notebookloaded;
  }

  async loadNWBFile () {
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Loading NWB file");
    let responseJson = await fetch(GeppettoPathService.serverPath("/api/load/?nwbfile=" + this.nwbfile))
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch(error => console.error(error));

    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);

    return responseJson;
  }

  async importValue (instance) {
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Loading data for " + instance.getPath());
    let instanceValue = await fetch(GeppettoPathService.serverPath("/api/importvalue/?path=" + instance.getPath()))
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong while retrieving ' + instance.getPath());
        }
      })
      .catch(error => console.error(error));
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
    GEPPETTO.Manager.swapResolvedValue(instanceValue);
  }

  /**
   * Like importValue but it's not meant to update the model. Just returns the value
   * @param {} instance 
   */
  async retrieveValue (instance) {
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Loading data for " + instance.getPath());
    let instanceValue = await fetch(GeppettoPathService.serverPath("/api/retrievevalue/?path=" + instance.getPath()))
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong while retrieving ' + instance.getPath());
        }
      })
      .catch(error => console.error(error));
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
    return instanceValue;
  }

  loadNWBFileInNotebook () {
    console.info("Loading file into notebook:", this.getNWBFileUrl())
    Utils.evalPythonMessage('main', [this.getNWBFileUrl()]);
    this.notebookloaded = true;
  }


  /**
   * Retrieves instances of state variables
   * Assuming a group structure such as
   * nwb.group1
   * nwb.group2
   *
   * group1.time
   * group1.stimulus
   *
   * group2.time
   * group2.df_over_f_01
   * group2.df_over_f_02
   *
   * where each group entry contains the corresponding data from the nwb file.
   */
  fillControlPanel () {

  }
}

export const nwbFileService = new NWBFileService();

export default nwbFileService;