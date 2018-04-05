define(function (require) {
	return function (GEPPETTO) {
		var ReactDOM = require('react-dom');
		var React = require('react');

		var Router = require('react-router-dom').BrowserRouter;
		var Route = require('react-router-dom').Route;
		var Switch = require('react-router-dom').Switch;

		var App = require('./App').default;

		require('./styles/main.less');

		G.enableLocalStorage(false);
		G.setIdleTimeOut(-1);


		// Create router structure
		ReactDOM.render(
			<Router basename={"/"}>
				<Switch>
					<Route path="/" component={App} exact />
				</Switch>
			</Router>
			, document.getElementById('mainContainer')
		);
	};
});