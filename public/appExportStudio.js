/*
  Updates the FeatureStudio contents with the generated Blockly Code

  Input: 

    fsId: Element id of the target FeatureStudio for exporting Blockly code
 
    sourceMicroversion: Microversion of the target Feature Studio document in order to
                        wipe on each code export. 
 
    fsCode: FeatureScript code exported from Blockly
*/

async function updateFeatureStudioContents(fSId, sourceMicroversion, fsCode) {

    // Format the body of the POST request
    raw = JSON.stringify({
      "contents": `${fsCode}`, 
      "serializationVersion": "1.1.20", 
      "sourceMicroversion": `${sourceMicroversion}`
    })
   
    // Define Content-Type for correct body parsing
    header =  {'Content-Type':'application/json'}
  
    try {
          const response = await fetch(`/api/updateFStudio${window.location.search}&blockly=${fSId}`, {method: 'POST', body: raw, headers: header});
          const testFour = await response.json();
          return testFour;
      } catch (error) {
          console.error(error);
      }
  };
  
  
  /*
     Gets the current FeatureStudio Contents and Specs
     Input:
   
     fsID: Element id of the target FeatureStudio for exporting Blockly code. 
           Stored in blockly query parameter in order to be correctly parsed to Onshape
  */
  
  async function getFeatureStudioContents(fSId) {
    try {
          const response = await fetch(`/api/fsContents${window.location.search}&blockly=${fSId}`, { headers: { 'Accept': 'application/json' } })
          const featurestudioContents = await response.json();
          return featurestudioContents;
      } catch (error) {
          console.error(error);
      }
  };
  
  
  /*
   Gets the FeatureStudio Specs of the FS in development document
  
   Input:
      
        fsID: This is the element id of the blockly export Feature Studio
  
  */
  
  async function getFeatureStudioSpecs(fSId) {
      try {
          const response = await fetch(`/api/specsFStudio${window.location.search}&blockly=${fSId}`, { headers: { 'Accept': 'application/json' } })
          const featurestudios = await response.json();
          return featurestudios;
      } catch (error) {
          console.error(error);
      }
  };
  
  
  
  /*
   Gets the FeatureStudio ID of the FS in development document
  */
  
  async function getFeatureStudio() {
      try {
          const response = await fetch(`/api/getFStudio${window.location.search}`, { headers: { 'Accept': 'application/json' } })
          const featurestudios = await response.json();
          return featurestudios;
      } catch (error) {
          console.error(error);
      }
  };
  
  
  
  /*
     Creates a new blockly export feature studio 
  */
  
  async function createFeatureStudio() {
  
    raw = JSON.stringify({
      "name": `FeatureBlocks Studio`
    })
   
    header =  {'Content-Type':'application/json'}
    
    try {
          const response = await fetch(`/api/createFStudio${window.location.search}`, {method: 'POST', body: raw, headers: header})
          const featurestudios = await response.json();
          return featurestudios;
      } catch (error) {
          console.error(error);
      }
  };
  
  
  
  /*
     Boolean function that indicates if there is an export Feature Studio in the document. Returns the index of this 
     in the element list in order for correct data parsing. 
  */
  
  async function hasExportStudio(featureStudios){
    for (var i = 0; i < featureStudios.length; i++) {
      if (featureStudios[i].name == "FeatureBlocks Studio") {
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
  
  async function getExportStudioInfo() {
    // Get all FeatureStudios in the document
    var featureStudios = await getFeatureStudio();
  
    // Check if there are none and if so, create the export FeatureStudio
    if (featureStudios.length == 0) {
      var exportStudio = await createFeatureStudio()
      exportStudioID = exportStudio.id
    } else {
  
      // If there are FeatureStudios is there already an export FeatureStudio
      results = await hasExportStudio(featureStudios)
  
      // If there is no export Feature Studio then create one
      if (!(results.hasStudio)) { 
        var exportStudio = await createFeatureStudio()
        exportStudioID = exportStudio.id
      } else {
        var exportStudio = featureStudios[results.index]
        var exportStudioID = featureStudios[results.index].id
      }
  }
  return {
    "element" : `${exportStudio}`,
    "ID" : `${exportStudioID}`
  }
};