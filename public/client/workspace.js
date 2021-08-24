function reqListener () {
	var element = document.createElement('xml');
	element.innerHTML = this.responseText;
  document.body.appendChild(element);
	var toolbox = document.getElementById("toolbox");
	var options = {
		toolbox : toolbox,
		collapse : true,
		comments : true,
		disable : true,
		maxBlocks : Infinity,
		trashcan : true,
		horizontalLayout : false,
		toolboxPosition : 'start',
		css : true,
		media : '../client/media/',
		rtl : false,
		scrollbars : true,
		sounds : true,
		oneBasedIndex : true,
		zoom: {
	    controls: true,
	    wheel: true,
	    startScale: 1.0,
	    maxScale: 4,
	    minScale: 0.25,
	    scaleSpeed: 1.1
  	},
		grid:
         {
					spacing: 20,
          length: 2,
          colour: '#ddd',
          snap: true}
	};
	workspace = Blockly.inject("blocklyDiv", options);
}
//var bodyTag = document.getElementById("blocklyDiv");
var oReq = new XMLHttpRequest();
var workspace;
oReq.addEventListener("load", reqListener);
oReq.open("GET", "../client/toolbox.xml");
oReq.send();

/* Inject your workspace */



/* Load Workspace Blocks from XML to workspace. Remove all code below if no blocks to load */

/* TODO: Change workspace blocks XML ID if necessary. Can export workspace blocks XML from Workspace Factory. */
// var workspaceBlocks = document.getElementById("workspaceBlocks");
//
// /* Load blocks to workspace. */
// Blockly.Xml.domToWorkspace(workspace, workspaceBlocks);
