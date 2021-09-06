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
    var header =  {'Accept': 'application/vnd.onshape.v2+json',
    'Content-Type': 'application/vnd.onshape.v2+json'};
    var raw = newJSON;
    console.log(raw);
    try {
        const response = await fetch(`/api/setMateValues${window.location.search}`, {method: 'POST', body: raw, headers: header})
        const matevalues = await response.json();
        return matevalues;
    } catch (error) {
        console.error(error);
    }
};