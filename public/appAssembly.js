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

async function setMates(newJSON) {
    var header =  {'Accept': 'application/json',
    'Content-Type': 'application/json'};
    var raw = JSON.stringify({'mateValues':[{'featureId': "MTL9NFGQ/BOFQxUff",
      'jsonType': "Revolute",
      'mateName': "Revolute 1",
      'rotationZ': 1}]});
    console.log(raw);
    try {
        const response = await fetch(`/api/setMateValues${window.location.search}`, { method: 'POST', body: raw, headers: header})
        const matevalues = await response.json();
        return matevalues;
    } catch (error) {
        console.error(error);
    }
};