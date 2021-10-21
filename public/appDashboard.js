/*
  Get the JSON tree of the application storage element 
*/

async function getJSONTree(applicationID) {

    // Define Content-Type for correct body parsing
    header =  {'Content-Type':'application/json'}
    
    try {
          const response = await fetch(`/api/getJsonTree${window.location.search}&storageId=${applicationID}`, {method: 'GET', headers: header});
          const testFour = await response.json();
          console.log(testFour)
          return testFour;
      } catch (error) {
          console.error(error);
      }
  };

/*
  Looks through list of app elements for dashboard storage 
*/
async function hasDashboardStorage(elementList){
    for (var i = 0; i < elementList.length; i++) {
      if (elementList[i].name == "Dashboard Storage") {
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
        var applicationID = appElementList[results.index].id
        var jsonTree = await getJSONTree(applicationID)
        console.log(jsonTree)
        var changeID = jsonTree.changeId
      }
    }
    return {
        "jsonTree" : jsonTree,
      "application" : application,
      "applicationID" : applicationID,
      "changeID" : changeID
    }
}