/*
  Get the JSON tree of the application storage element 
*/

async function getJSONTree(applicationID) {

    // Define Content-Type for correct body parsing
    header =  {'Content-Type':'application/json'}
    
    try {
          const response = await fetch(`/api/getJsonTree${window.location.search}&storageId=${applicationID}`, {method: 'GET', headers: header});
          const responseJson = await response.json();
          return responseJson;
      } catch (error) {
          console.error(error);
      }
  };

/*
  Looks through list of app elements for dashboard storage 
*/
async function hasDashboardStorage(elementList){
    for (var i = 0; i < elementList.length; i++) {
      if (elementList[i].name == "Octoprint AppElement") {
        var hasStudio = true
        var index = i
        return {
          hasStudio,
          index
        }
      }
    }
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

async function getAppElementIDs() {
    try {
        const response = await fetch(`/api/getApplicationStorage${window.location.search}`, { headers: { 'Accept': 'application/json' } })
        const featurestudios = await response.json();
        return featurestudios;
    } catch (error) {
        console.error(error);
    }
  };

/*
 Gets the part studios in the document
*/

async function getPartStudios() {
  try {
      const response = await fetch(`/api/getPartStudios${window.location.search}`, { headers: { 'Accept': 'application/json' } })
      const partstudios = await response.json();
      return partstudios;
  } catch (error) {
      console.error(error);
  }
};

/*
 Combines all utility functions into one function that deals with creation and upkeep of the
 app element 
*/

async function getDashboardAppElementInfo() {
    var appElementList = await getAppElementIDs();
  
    // Check if there are none and if so, create the export a new application storage
    if (appElementList.length == 0) {
      console.log("no app element")
    } else {
  
      // If there are FeatureStudios is there already an export FeatureStudio
      results = await hasDashboardStorage(appElementList)
  
      // If there is no export Feature Studio then create one
      if (!(results.hasStudio)) { 
        console.log("no app element")
      } else {
        var application = appElementList[results.index]
        var applicationId = appElementList[results.index].id
        var jsonTree = await getJSONTree(applicationId)
        var changeId = jsonTree.changeId
      }
    }
    return {
        "jsonTree" : jsonTree,
      "application" : application,
      "applicationId" : applicationId,
      "changeId" : changeId
    }
}

/*
  Updates the JSON tree element of the application storage element 
*/

async function updateJSONTreeKey(applicationID, changeID, key, value) {

    // Format the body of the POST request
    raw = JSON.stringify({
      "parentChangeId": `${changeID}`,
      "jsonTreeEdit":{"btType": "BTJEditChange-2636",
        "path": {"btType": "BTJPath-3073", "startNode": "", "path": [{"btType": "BTJPathKey-3221", "key": `${key}`}]},
        "value": `${value}`}
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

  /*
  Updates the JSON tree element of the application storage element 
*/

async function addJSONTreeKey(applicationID, changeID, key, value) {

    // Format the body of the POST request
    raw = JSON.stringify({
      "parentChangeId": `${changeID}`,
      "jsonTreeEdit":{"btType": "BTJEditInsert-2523",
        "path": {"btType": "BTJPath-3073", "startNode": "", "path": [{"btType": "BTJPathKey-3221", "key": `${key}`}]},
        "value": `${value}`}
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