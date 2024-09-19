$(document).ready(function() {
    const locationDict = {
        "Mt Crosby Weir": null,
        "Caboolture River Weir": null,
        "Wivenhoe Dam": null,
        "North Pine Dam": null,
        "Somerset Dam": null,
        "Logan River": null,
        "Albert River": null,
        "Bremer River": null,
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

    // Step 4: Handle dropdown change event
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