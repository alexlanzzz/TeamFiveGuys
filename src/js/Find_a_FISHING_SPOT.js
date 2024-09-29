function fetchData(location) {
    const apiUrl = 'https://www.data.qld.gov.au/api/3/action/datastore_search';
    const resourceID = '3362e437-b0a1-467f-8331-2a051322c4b6';

    let data = {
        resource_id: resourceID,
        limit: 20,
        q: location
    };

    
    $('#loading').show();

    // Display loading indicator (optional if you want this along with the loader)
    $('#locations-container').html('<div class="loader"></div>');
    removePopup(); // Remove any existing popup

    $.ajax({
        url: apiUrl,
        data: data,
        dataType: 'json',
        beforeSend: function() {
            
            $('#loading').show();
        },
        success: function(response) {
            if (response.result.records && response.result.records.length > 0) {
                displayFishData(response.result.records);
            } else {
                $('#locations-container').html('<p>No data found for this location.</p>');
            }
        },
        error: function() {
            $('#locations-container').html('<p>Failed to fetch data. Please try again later.</p>');
        },
        complete: function() {
            
            $('#loading').hide();
        }
    });
}