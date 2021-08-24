/*

    appMateValues.js

    getMates() : Gets all high level mates in assembly

*/

/*
   Gets the Feature List for the Part Studio in which the user is Blockly coding 
*/

async function getMates() {
    try {
        const response = await fetch(`/api/getMates${window.location.search}`, { headers: { 'Accept': 'application/json' } })
        const mates = await response.json();
        return mates;
    } catch (error) {
        console.error(error);
    }
};
