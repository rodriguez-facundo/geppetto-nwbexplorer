import GeppettoPathService from './GeppettoPathService';
import Utils from '../Utils';
const NWB_FILE_URL_PARAM = 'nwbfile';
// const NWB_FILE_DEFAULT_URL = "https://github.com/OpenSourceBrain/NWBShowcase/raw/master/NWB/time_series_data.nwb";

class NWBFileService {

  constructor (){
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

  loadNWBFile () {
    GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Loading NWB file");
    fetch(GeppettoPathService.serverPath("/api/load/?nwbfile=" + this.nwbfile))
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then(responseJson => {
        GEPPETTO.Manager.loadModel(responseJson);
        GEPPETTO.CommandController.log("The NWB file was loaded");
        GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
        this.fillControlPanel();

        if (Utils.isNotebookLoaded()){
          this.loadNWBFileInNotebook();
        }
        
        // TODO we'll readd the support for external plots later
        //   fetch(GeppettoPathService.serverPath("/api/plots_available"))
        //     .then(response => {
        //       if (response.ok) {
        //         return response.json()
        //       } else {
        //         throw new Error('Something went wrong');
        //       }
        //     })
        //     .then(responseJson => {
        //       let response = responseJson;
        //       this.plotsAvailable = response.map(function (plot) {
        //         /** fill plotsAvailable (controls) with the response and with onClick = fetch("api/plot?plot=plot_id") */
        //         return <MenuItem key={plot.id}
        //           style={styles.menuItem} innerDivStyle={styles.menuItemDiv}
        //           primaryText={plot.name}
        //           onClick={() => {
        //             that.plotExternalHTML(GeppettoPathService.serverPath('/api/plot?plot=' + plot.id, plot.name))
        //           }} />
        //       });
        //     })
        //     .catch(error => console.error(error)); //
      })
      .catch(error => console.error(error));
    
    
    GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);
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
    let groupsIDs = [];
    let groups = Instances.getInstance("nwb.getVariable().getType().getVariables()")
      .map(group => {
        let groupID = group.wrappedObj.id;
        groupsIDs.push(groupID);
        return Instances.getInstance(groupID + ".getVariable().getType().getVariables()");
      });
    groups.forEach((g, index) => g.map(x => Instances.getInstance(groupsIDs[index] + "." + x.wrappedObj.id)));
   
    GEPPETTO.ControlPanel.setDataFilter(function (entities) {
      /** adds all non-time instances to control panel */
      return GEPPETTO.ModelFactory.getAllInstancesOfType(window.Model.common.StateVariable).filter(x => x.id !== "time");
    });

    GEPPETTO.ControlPanel.addData(Instances);
  }
}

export const nwbFileService = new NWBFileService();

export default nwbFileService;