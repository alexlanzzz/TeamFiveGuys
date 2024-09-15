async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

const qldWildlifeApiUrl = 'https://www.data.qld.gov.au/dataset/qld-wildlife-data-api';
const freshwaterStockingRecordsUrl = 'https://www.data.qld.gov.au/dataset/queensland-freshwater-fish-stocking-records/resource/3362e437-b0a1-467f-8331-2a051322c4b6';

async function getFishData() {
    try{
        const [wildlifeData, freshwaterStockingRecords] = await Promise.all([
        fetchData(qldWildlifeApiUrl),
        fetchData(freshwaterStockingRecordsUrl)
        ]);
        return {
            wildlifeData,
            freshwaterStockingRecords
        };
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function filterLocationsInBrisbane(freshwaterStockingRecords) {
    return fishStockingRecords.filter(record => record.location.includes('Brisbane City'));
}


function extractFishSpecies(freshwaterStockingRecords) {
    const speciesSet = new Set();
    filteredLocations.forEach(location => {
        location.species.forEach(species => speciesSet.add(species));
    });
    return Array.from(speciesSet);
}


async function getSpeciesInformation(speciesList, wildlifeData) {
    const speciesInformation = speciesList.map(species => {
        return wildlifeData.find(data => data.common_name === species || data.scientific_name === species);
    });
    return speciesInformation;
}


async function main() {
    const {wildlifeDAta, freshwaterStockingRecords} = await getFishData();

    const filteredLocations = filterLocationsInBrisbane(freshwaterStockingRecords);
    const fishSpecies = extractFishSpecies(filteredLocations);
    const speciesInformation = await getSpeciesInformation(fishSpecies, wildlifeData);

    console.log('Filtered Locations:', speciesInformation);
    console.log('Fish Species:', fishSpecies);
    console.log('Species Information:', speciesInformation);
}

main();