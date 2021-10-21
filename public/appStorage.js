/*

  appStorage.js

  This file holds all of the utility functions that control the state of the application
  in Onshape.

  createNewAppElement(): Creates a new app element in order to store the state of the
                         Blockly main workspace.

  hasApplicationStorage(): Checks to see if in an array of applications if there is a 
                         Blockly storage application element and then return { bool, index of app in array}

  getApplicationID(): Gets the application id of the storage element

  getChangeID(): Gets the current change id for use in updating the JSON tree element

  getApplicationInfo(): Combines all utility functions in order to create a single utility function

  updateJSONTree(): Updates the blockly storage app's JSON tree element with the current blockly main workspace

*/


/*
Creates a new app element in order to store the state of the Blockly main workspace
*/

async function createNewAppElement(fSId, sourceMicroversion, fsCode) {

    // Format the body of the POST request
    raw = JSON.stringify({
      "formatId": "com.onshape-blockly",
      "name": "FeatureBlocks Storage",
      "description": "String",
      "jsonTree": {
        "blockly":'<xml xmlns="https://developers.google.com/blockly/xml"><block type="feature" id="o]%Ffg%vnqW+S-c66R?5" x="10" y="150"><field name="featurename">FeatureBlocks Feature</field><statement name="actions"><block type="fcuboid" id="^8:YmHbv{TziJS344BJh"><value name="corner1_xyz"><shadow type="vector3Field" id="V#L~8GwrCVh1dn!Uga=B"><field name="x">0</field><field name="y">0</field><field name="z">0</field></shadow></value><value name="corner2_xyz"><shadow type="vector3Field" id="2J}GWgSFbT;z/o|OJat{"><field name="x">1</field><field name="y">2</field><field name="z">3</field></shadow></value></block></statement></block></xml>'
      }
    })
    
    // Define Content-Type for correct body parsing
    header =  {'Content-Type':'application/json'}
    
    try {
          const response = await fetch(`/api/createAppElement${window.location.search}`, {method: 'POST', body: raw, headers: header});
          const testFour = await response.json();
          return testFour;
      } catch (error) {
          console.error(error);
      }
    };

/*
   Boolean function that indicates if there is a Blockly app element for 
   persistent storage of the current blockly workspace.
*/

async function hasDashboardStorage(featureStudios){
  for (var i = 0; i < featureStudios.length; i++) {
    if (featureStudios[i].name == "Dashboard Storage") {
      var hasStudio = true
      var index = i
      return {
        hasStudio,
        index
      }
    }
  }
  console.log(index)
  console.log(index)
  var hasStudio = false
  var index = null
  return {
        hasStudio,
        index
      }
};


/*
   Boolean function that indicates if there is a Blockly app element for 
   persistent storage of the current blockly workspace.
*/

async function hasApplicationStorage(featureStudios){
  for (var i = 0; i < featureStudios.length; i++) {
    if (featureStudios[i].name == "FeatureBlocks Storage") {
      var hasStudio = true
      var index = i
      return {
        hasStudio,
        index
      }
    }
  }
  console.log(index)
  console.log(index)
  var hasStudio = false
  var index = null
  return {
        hasStudio,
        index
      }
};


/*
 Gets the application element ID of the storage application element
*/

async function getApplicationID() {
  try {
      const response = await fetch(`/api/getApplicationStorage${window.location.search}`, { headers: { 'Accept': 'application/json' } })
      const featurestudios = await response.json();
      return featurestudios;
  } catch (error) {
      console.error(error);
  }
};


/*
 Gets the change Id of the storage application element
*/

async function getChangeID(elementId) {
  try {
      const response = await fetch(`/api/getElementChangeId${window.location.search}&storageId=${elementId}`, { headers: { 'Accept': 'application/json' } })
      const jsonTree = await response.json();
      return jsonTree;
  } catch (error) {
      console.error(error);
  }
};

/*
 Combines all utility functions into one function that deals with creation and upkeep of the
 app element 
*/

async function getDashboardAppElementInfo() {
  var applications = await getApplicationID();

  // Check if there are none and if so, create the export a new application storage
  if (applications.length == 0) {
    var application = await createNewAppElement()
    var applicationID = application.elementId
    var changeID = application.changeId
  } else {

    // If there are FeatureStudios is there already an export FeatureStudio
    results = await hasDashboardStorage(applications)

    // If there is no export Feature Studio then create one
    if (!(results.hasStudio)) { 
      var application = await createNewAppElement()
      var applicationID = application.elementId
      var changeID = application.changeId
    } else {
      var application = applications[results.index]
      var applicationID = applications[results.index].id
      var changeID = (await getChangeID(applicationID)).changeId
    }
  }
  return {
    "application" : application,
    "applicationID" : applicationID,
    "changeID" : changeID
  }
}

/*
 Combines all utility functions into one function that deals with creation and upkeep of the
 app element 
*/

async function getAppElementInfo() {
  var applications = await getApplicationID();

  // Check if there are none and if so, create the export a new application storage
  if (applications.length == 0) {
    var application = await createNewAppElement()
    var applicationID = application.elementId
    var changeID = application.changeId
  } else {

    // If there are FeatureStudios is there already an export FeatureStudio
    results = await hasApplicationStorage(applications)

    // If there is no export Feature Studio then create one
    if (!(results.hasStudio)) { 
      var application = await createNewAppElement()
      var applicationID = application.elementId
      var changeID = application.changeId
    } else {
      var application = applications[results.index]
      var applicationID = applications[results.index].id
      var changeID = (await getChangeID(applicationID)).changeId
    }
  }
  return {
    "application" : application,
    "applicationID" : applicationID,
    "changeID" : changeID
  }
}

/*
  Updates the JSON tree element of the application storage element 
*/

async function getJSONTree(applicationID) {

  // Define Content-Type for correct body parsing
  header =  {'Content-Type':'application/json'}
  
  try {
        const response = await fetch(`/api/getJsonTree${window.location.search}&storageId=${applicationID}`, {method: 'GET', body: "", headers: header});
        const testFour = await response.json();
        return testFour;
    } catch (error) {
        console.error(error);
    }
};

/*
  Updates the JSON tree element of the application storage element 
*/

async function updateJSONTree(applicationID, changeID, blocklyXML) {

  // Format the body of the POST request
  raw = JSON.stringify({
    "parentChangeId": `${changeID}`,
    "jsonTreeEdit":{"btType": "BTJEditChange-2636",
      "path": {"btType": "BTJPath-3073", "startNode": "", "path": [{"btType": "BTJPathKey-3221", "key": "blockly"}]},
      "value": `${blocklyXML}`}
    }
  )
  // console.log(`${blocklyXML}`)
  // Define Content-Type for correct body parsing
  header =  {'Content-Type':'application/json'}
  
  try {
        const response = await fetch(`/api/updateAppElement${window.location.search}&storageId=${applicationID}`, {method: 'POST', body: raw, headers: header});
        const testFour = await response.json();
        return testFour;
    } catch (error) {
        console.error(error);
    }
};