define(function (require) {
	return function (GEPPETTO) {
		let ReactDOM = require('react-dom');
		let React = require('react');
		let Utils = require('./Utils').default;
		let Router = require('react-router-dom').BrowserRouter;
		let Route = require('react-router-dom').Route;
		let Switch = require('react-router-dom').Switch;

		let App = require('./App').default;

		require('./styles/main.less');

		G.enableLocalStorage(false);
		G.setIdleTimeOut(-1);


		// Create router structure
		ReactDOM.render(
			<App />
			, document.getElementById('mainContainer')
		);

		GEPPETTO.G.setIdleTimeOut(-1);
		GEPPETTO.G.debug(true); // Change this to true to see messages on the Geppetto console while loading
		GEPPETTO.Resources.COLORS.DEFAULT = "#008ea0";
		console.log(Utils);
		GEPPETTO.trigger(GEPPETTO.Events.Show_spinner, "Initialising NWB explorer");
		console.log("Initializing NWB explorer")

		GEPPETTO.on('jupyter_geppetto_extension_ready', data => {
			console.log("Initializing Python extension");
			Utils.execPythonMessage('from nwb_explorer.nwb_main import main');
			Utils.execPythonMessage('main()');

			// ReactDOM.render(
			// 	ReactDOM.render(<App  />, document.getElementById('mainContainer')));
			// Utils.evalPythonMessage('hnn_geppetto.getData', []).then(response => {
			// 	let data = Utils.convertToJSON(response);

				



			// })
		});




	};
});