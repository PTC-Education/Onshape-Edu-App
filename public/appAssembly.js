/*
 Gets the assembly mate names
*/

async function getMates() {
    try {
        const response = await fetch(`/api/getMateValues${window.location.search}`, { headers: { 'Accept': 'application/json' } })
        const matevalues = await response.json();
        return matevalues;
    } catch (error) {
        console.error(error);
    }
};

/*
 Sets the mates in an assembly
*/
async function setMates(newJSON) {
    var header =  {'Accept': 'application/json',
    'Content-Type': 'application/json'};
    var raw = JSON.stringify(newJSON);
    try {
        const response = await fetch(`/api/setMateValues${window.location.search}`, { method: 'POST', body: raw, headers: header})
        const matevalues = await response.json();
        return matevalues;
    } catch (error) {
        console.error(error);
    }
};

/*
 Transform Assembly Occurance
*/
async function transformOccurrence(newJSON) {
    var header =  {'Accept': 'application/json',
    'Content-Type': 'application/json'};
    var raw = JSON.stringify(newJSON);
    console.log(raw);
    try {
        const response = await fetch(`/api/transformOccurrences${window.location.search}`, { method: 'POST', body: raw, headers: header})
        const matevalues = await response.json();
        return matevalues;
    } catch (error) {
        console.error(error);
    }
};

/*
 Get Assembly Definition
*/
async function getAssemblyDef() {
    var header =  {'Accept': 'application/json'};
    try {
        const response = await fetch(`/api/getAssemblyDefinition${window.location.search}`, { method: 'GET', headers: header})
        const assemblyDef = await response.json();
        return assemblyDef;
    } catch (error) {
        console.error(error);
    }
};