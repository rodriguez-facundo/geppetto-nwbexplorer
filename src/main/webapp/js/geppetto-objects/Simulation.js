/*******************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2011, 2013 OpenWorm.
 * http://openworm.org
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the MIT License
 * which accompanies this distribution, and is available at
 * http://opensource.org/licenses/MIT
 *
 * Contributors:
 *     	OpenWorm - http://openworm.org/people.html
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 *******************************************************************************/

/**
 * 
 * Class for the Simulation Object. Handles user's request to start, stop, pause, 
 * and/or load a simulation.
 * 
 * @constructor
 * 
 * @author matteo@openworm.org (Matteo Cantarelli)
 * @author giovanni@openworm.org (Giovanni Idili)
 * @author  Jesus R. Martinez (jesus@metacell.us)
 */
var Simulation = Simulation ||
{
	REVISION : '1'
};

Simulation.StatusEnum =
{
	INIT : 0,
	LOADED : 1,
	STARTED : 2,
	PAUSED : 3,
	STOPPED: 4
};

Simulation.status = Simulation.StatusEnum.INIT;

Simulation.simulationURL = "";

/**
 * Start the simulation.
 * 
 * @returns {String}
 */
Simulation.start = function()
{
	if(Simulation.isLoaded()){
		//Update the simulation controls visibility
		FE.updateStartEvent();
		
		GEPPETTO.Main.socket.send(messageTemplate("start", null));
		
		Simulation.status = Simulation.StatusEnum.STARTED;
		Console.debugLog('Outbund Message Sent','Sent: Simulation started');
		
		return "Simulation Started";
	}
	else{
		return "Simulation not loaded, must load simulation first";
	}
};

/**
 * Pauses the simulation
 * 
 * @returns {String}
 * 
 */
Simulation.pause = function()
{
	if(Simulation.status == Simulation.StatusEnum.STARTED){
		//Updates the simulation controls visibility
		FE.updatePauseEvent();
		
		GEPPETTO.Main.socket.send(messageTemplate("pause", null));
		
		Simulation.status = Simulation.StatusEnum.PAUSED;
		Console.debugLog('Outbund Message Sent','Sent: Simulation paused');

		return "Simulation Paused";
	}
	else{
		return "Simulation not loaded, must load simulation first";
	}
};

/**
 * Stops the simulation 
 * 
 * @returns {String}
 */
Simulation.stop = function()
{
	if(Simulation.status == Simulation.StatusEnum.PAUSED || Simulation.status == Simulation.StatusEnum.STARTED){
		//Updates the simulation controls visibility
		FE.updateStopEvent();

		GEPPETTO.Main.socket.send(messageTemplate("stop", null));
		
		Simulation.status = Simulation.StatusEnum.STOPPED;
		Console.debugLog('Outbund Message Sent', 'Sent: Simulation stopped');

		return "Simulation Stopped";
	}
	else if(Simulation.status == Simulation.StatusEnum.LOADED){
		return "Unable to stop simulation, loaded but not running";
	}
	else{
		return "Unable to stop simulation that hasn't been loaded";
	}
};

/**
 * Loads a simulation from a URL.
 * 
 * @param simulationURL - URL of simulation file
 * @returns {String}
 */
Simulation.load = function(simulationURL)
{
	
	FE.updateLoadEvent();
	
	Simulation.simulationURL = simulationURL;
	
	var loadStatus = "Loading Simulation";
	
	if(simulationURL != null && simulationURL != ""){
		//Updates the simulation controls visibility
		var webGLStarted = GEPPETTO.init(FE.createContainer());
		//update ui based on success of webgl
		FE.update(webGLStarted);
		//Keep going with load of simulation only if webgl container was created
		if(webGLStarted){
			FE.activateLoader("show", "Loading Simulation");
			if (Simulation.status == Simulation.StatusEnum.INIT)
			{
				//we call it only the first time
				GEPPETTO.animate();
			}
			GEPPETTO.Main.socket.send(messageTemplate("init_url", simulationURL));
			Console.debugLog('Outbound Message Sent', 'Load Simulation');			
		}
	}
	
	else{		
		var simulationURL = $('#url').val();
		
		if(simulationURL != ""){
			Simulation.load(simulationURL);	
		}
		
		else if(GEPPETTO.SimulationContentEditor.editing){
			var simulation = GEPPETTO.SimulationContentEditor.getEditedSimulation();
			
			loadEditedSimulationFile(simulation);
			GEPPETTO.SimulationContentEditor.isEditing(false);
		}
		
		else{
			loadStatus = "Simulation not specified";
		}
	}
	
	return loadStatus;
};

/**
 * Loads a simulation using the content's from the simulation file editor
 * 
 * @param simulation - Simulation to be loaded
 * @returns {String}
 */
 function loadEditedSimulationFile(simulation)
{
	//Update the simulation controls visibility
	FE.updateLoadEvent();
	
	var webGLStarted = GEPPETTO.init(FE.createContainer());
	//update ui based on success of webgl
	FE.update(webGLStarted);
	//Keep going with load of simulation only if webgl container was created
	if(webGLStarted){
		FE.activateLoader("show", "Loading Simulation");
		if (Simulation.status == Simulation.StatusEnum.INIT)
		{
			//we call it only the first time
			GEPPETTO.animate();
		}
		
		GEPPETTO.Main.socket.send(messageTemplate("init_sim", simulation));
		Console.debugLog('Outbound Message Sent',"Sent: Load Simulation from editing console");
	}
	
	return "Simulation Loaded";
};

/**
 * Returns true or false, depending if simulations is loaded or not
 * @returns {Boolean}
 */
Simulation.isLoaded = function()
{
	if(Simulation.status != Simulation.StatusEnum.INIT){
		return true;
	}
	
	return false;
};

/**
 * Returns list of all commands associated with Simulation object
 * 
 * @returns
 */
Simulation.help = function(){
	var commands = "Simulation control commands: \n\n";

	//find all functions of object Simulation
	for ( var prop in Simulation ) {
		if(typeof Simulation[prop] === "function") {
			var f = Simulation[prop].toString();
			//get the argument for this function
			var parameter = f.match(/\(.*?\)/)[0].replace(/[()]/gi,'').replace(/\s/gi,'').split(',');
			//format and keep track of all commands available
			commands += ("      -- Simulation."+prop+"("+parameter+");" + "\n");
		};
	}

	return commands.substring(0,commands.length-1);
};

/**
 * Return status of simulation
 */
function getSimulationStatus()
{
	return Simulation.status;
};

/**
* Template for Geppetto message 
* NOTE: move from here under global G object once in place
* 
* @param msgtype - messaga type
* @param payload - message payload, can be anything
* @returns JSON stringified object
*/
function messageTemplate(msgtype, payload) {
	var object = {
		type: msgtype,
	    data: payload
	};
	return JSON.stringify(object);
};