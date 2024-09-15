$(document).ready(function() {
    const locationDict = {
        "Goondiwindi (Hilton) Weir": null,
        "Macintyre River": null,
        "Pukallus Weir": null,
        "Surat Weir": null,
        "Yarramalong Weir": null,
        "Talgai Weir": null,
        "Severn River": null,
        "Moura Weir": null,
        "Mount Morgan Big Dam": null,
        "Chinchilla Weir": null,
        "Dumaresq River": null,
        "Accommodation Creek": null,
        "Beehive Dam": null,
        "Gil Weir": null,
        "McCauley Weir": null,
        "Beardmore Dam": null,
        "Lake Awoonga": null,
        "Bonshaw Weir": null,
        "Beebo Weir": null,
        "Glebe Weir": null,
        "Neville Hewitt Weir": null,
        "BAROON POCKET DAM": null,
        "Theresa Creek Dam": null,
        "Lenthalls Dam (Lake Lenthall)": null,
        "Charters Towers Weir": null,
        "Mt Crosby Weir": null,
        "Caboolture River Weir": null,
        "Jones Weir": null,
        "Wambo Creek": null,
        "Condamine River (near Chinchilla)": null,
        "Charleys Creek": null,
        "Fitzroy River Barrage": null,
        "Glenlyon Dam": null,
        "Lake Borumba": null,
        "Gorizzia's Lagoon": null,
        "Hutchinga Lagoon": null,
        "Favero's Lagoon": null,
        "Payards Lagoon": null,
        "Churches Lagoon": null,
        "Dicks Bank Lagoon": null,
        "Gleeson Weir": null,
        "Herbert River": null,
        "Marian Weir": null,
        "Wuruma Dam": null,
        "Stanley River": null,
        "Wivenhoe Dam": null,
        "Leslie Dam": null,
        "Burdekin Dam/Lake Dalrymple": null,
        "Kinchant Dam": null,
        "Peter Faust Dam": null,
        "Teemburra Dam": null,
        "Norman River": null,
        "Lake MacDonald": null,
        "Cania Dam": null,
        "Black Weir": null,
        "Koombooloomba Dam": null,
        "Boondooma Dam": null,
        "Fred Haigh Dam": null,
        "Tinaroo Dam": null,
        "Lake Gregory": null,
        "Lake Dyer": null,
        "North Pine Dam": null,
        "Oakey Creek": null,
        "Somerset Dam": null,
        "Fairbairn Dam": null,
        "Bjelke Peterson Dam": null,
        "Condamine River (Upper)": null,
        "Connolly Dam": null,
        "Callide Dam": null,
        "Maroon Dam": null,
        "Moogerah Dam": null,
        "Claude Wharton Weir": null,
        "Kings Creek": null,
        "Lake Kurwongbah": null,
        "Ewen Maddock Dam": null,
        "Cressbrook Dam": null,
        "Selma Weir": null,
        "Cooby Dam": null,
        "Storm King Dam": null,
        "Ward River": null,
        "Warrego River/Weir": null,
        "Langlo River": null,
        "Lake Belmore": null,
        "Cecil Plains Weir": null,
        "Coolmunda Dam": null,
        "Lemon Tree Weir": null,
        "Undulla Creek": null,
        "Robina Lakes": null,
        "Lake Fred Tritton": null,
        "Eungella Dam": null,
        "Bowen River Weir": null,
        "Fred Haigh Dam (Lake Monduran)": null,
        "Gordonbrook Dam": null,
        "Lake Callemondah": null,
        "Lake Moondarra (Leichardt River Dam)": null,
        "Lake Kurwongbah (Sideling Creek Dam)": null,
        "Balonne River": null,
        "Logan River": null,
        "Albert River": null,
        "Bedford Weir": null,
        "Baroon Pocket Dam": null,
        "Trinity Inlet": null,
        "Barron River": null,
        "Russell River": null,
        "Mulgrave River": null,
        "Accommodation Creek": null,
        "MacIntyre Brook": null,
        "Oakey Town Weir": null,
        "Pioneer River": null,
        "Ben Anderson Barrage": null,
        "Albert River (Gulf)": null,
        "Lower Fitzroy River": null,
        "Dawson River": null,
        "Tara Weir": null,
        "Glenarbon Weir": null,
        "Borumba Dam": null,
        "Atkinsons Dam": null,
        "Giru Weir": null,
        "Hutchings Lagoon": null,
        "Bremer River": null,
        "Hinze Dam": null,
        "Lake Dyer (Bill Gunn Dam)": null,
        "Lockyer Creek": null,
        "Waraba Creek Weir": null,
        "Woodford Weir": null,
        "Yuleba Creek": null,
        "Condamine River (Upper - Warwick)": null,
        "Wyaralong Dam": null,
        "Saddlers Waterhole": null,
        "Angellalla Creek (above weir)": null,
        "Paradise Dam": null,
        "Aplins Weir": null,
        "Copperlode Dam (Lake Morris)": null,
        "Ross River Dam": null,
        "Whetstone Weir": null,
        "Bendor Weir": null,
        "Inglewood Town Weir": null
    };

    // Populate the dropdown with locations
    function populateLocationDropdown() {
        let dropdownHTML = '<option value="">Select a Location</option>'; // Default option
        Object.keys(locationDict).forEach(location => {
            dropdownHTML += `<option value="${location}">${location}</option>`;
        });
        $('#location-filter').html(dropdownHTML);  // Assuming you have a select element with id="location-filter"
    }

    // Fetch and filter data based on location
    function fetchData(location) {
        const apiUrl = 'https://www.data.qld.gov.au/api/3/action/datastore_search';
        const resourceID = '3362e437-b0a1-467f-8331-2a051322c4b6';

        let data = {
            resource_id: resourceID,
            limit: 20,
            q: location
        };

        $.ajax({
            url: apiUrl,
            data: data,
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if (response.result.records) {
                    displayFishData(response.result.records);
                } else {
                    $('#locations-container').html('<p>No data found for this location.</p>');
                }
            }
        });
    }

    // Display the fetched fish data
    function displayFishData(fishRecords) {
        let htmlContent = '';
        let stockedSpecies = new Set(); // To store unique species

        fishRecords.forEach(record => {
            const species = record['Species stocked'];
            const location = record['Location stocked'];

            if (!stockedSpecies.has(species)) {
                htmlContent += `<p>${species} - Stocked in ${location}</p>`;
                stockedSpecies.add(species); // Add species to the Set to prevent duplicates
            }
        });
        $('#locations-container').html(htmlContent || '<p>No fish found for this location.</p>');
    }

    // Handle dropdown change event
    $('#location-filter').on('change', function() {
        const selectedLocation = $(this).val();
        if (selectedLocation) {
            fetchData(selectedLocation);  // Fetch data based on the selected location
        } else {
            $('#locations-container').html('<p>Please select a location.</p>');  // Show default message if no location selected
        }
    });

    // Initialize the dropdown
    populateLocationDropdown();
});