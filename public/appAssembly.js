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