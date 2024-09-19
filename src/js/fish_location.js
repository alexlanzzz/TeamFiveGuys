$(document).ready(function() {
    // Dictionary of available locations
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

    // Mapping of fish species names to their corresponding image filenames
    const speciesImageMap = {
        "Australian Bass": "AUSTRALIAN_BASS.JPG",
        "Barramundi": "Barramundi.jpg",
        "Golden Perch": "GOLDEN_PERCH.jpg",
        "Mary River Cod": "Mary-River-Cod.jpg",
        "Saratoga": "Saratoga.jpg",
        "Silver Perch": "SILVER_PERCH.jpg"
        // Add more mappings here if needed
    };

    // Function to populate the location dropdown menu
    function populateLocationDropdown() {
        let dropdownHTML = '<option value="">Select a Location</option>'; // Default option
        Object.keys(locationDict).forEach(location => {
            dropdownHTML += `<option value="${location}">${location}</option>`;
        });
        $('#location-filter').html(dropdownHTML);  // Assuming your select element has id="location-filter"
    }

    // Function to fetch fish data based on the selected location
    function fetchData(location) {
        const apiUrl = 'https://www.data.qld.gov.au/api/3/action/datastore_search';
        const resourceID = '3362e437-b0a1-467f-8331-2a051322c4b6';

        let data = {
            resource_id: resourceID,
            limit: 20,
            q: location
        };

        // Display loading indicator
        $('#locations-container').html('<div class="loader"></div>');
        removePopup(); // Remove any existing popup

        $.ajax({
            url: apiUrl,
            data: data,
            dataType: 'json',
            success: function(response) {
                if (response.result.records && response.result.records.length > 0) {
                    displayFishData(response.result.records);
                } else {
                    $('#locations-container').html('<p>No data found for this location.</p>');
                }
            },
            error: function() {
                $('#locations-container').html('<p>Failed to fetch data. Please try again later.</p>');
            }
        });
    }

    // Function to display fish data as images with names below
    function displayFishData(fishRecords) {
        let htmlContent = '';
        let stockedSpecies = new Set(); // To store unique species

        fishRecords.forEach(record => {
            const species = record['Species stocked'];
            const location = record['Location stocked'];

            // Ensure each species is displayed only once
            if (!stockedSpecies.has(species)) {
                // Get the corresponding image filename or use a default image
                const imageName = speciesImageMap[species] || 'fish1.png';
                htmlContent += `
                    <div class="fish-item-container">
                        <img 
                            class="fish-item" 
                            data-species="${species}" 
                            src="images/fishes/${imageName}" 
                            alt="${species}" 
                            title="${species} - Stocked in ${location}"
                        >
                        <p>${species}</p>
                    </div>
                `;
                stockedSpecies.add(species); // Add species to the Set to prevent duplicates
            }
        });

        $('#locations-container').html(htmlContent || '<p>No fish found for this location.</p>');

        // Attach click event to each fish image to fetch Wikipedia info
        $('.fish-item').on('click', function(event) {
            const species = $(this).data('species');
            fetchWikipediaInfo(species, $(this));
            event.stopPropagation(); // Prevent the event from bubbling up to the document
        });
    }

    // Function to fetch information from Wikipedia API
    function fetchWikipediaInfo(fishSpecies, $imageElement) {
        const wikiApiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(fishSpecies)}`;

        // Fetch Wikipedia information
        $.ajax({
            url: wikiApiUrl,
            dataType: 'json',
            success: function(response) {
                if (response.extract) {
                    showPopup(response.extract, $imageElement);
                } else {
                    showPopup(`No Wikipedia information found for ${fishSpecies}.`, $imageElement);
                }
            },
            error: function() {
                showPopup('Failed to fetch Wikipedia information. Please try again later.', $imageElement);
            }
        });
    }

    // Function to show a popup with the Wikipedia extract near the clicked image
    function showPopup(content, $imageElement) {
        removePopup(); // Remove any existing popup

        // Create the popup element
        const $popup = $('<div class="popup"></div>').text(content);

        // Append the popup to the body
        $('body').append($popup);

        // Position the popup near the clicked image
        const imageOffset = $imageElement.offset();
        const imageHeight = $imageElement.height();
        const popupWidth = $popup.outerWidth();
        const popupHeight = $popup.outerHeight();

        // Calculate position: below the image, adjust if near the bottom of the viewport
        let top = imageOffset.top + imageHeight + 10; // 10px below the image
        let left = imageOffset.left;

        // Check if popup goes beyond the right edge of the viewport
        if (left + popupWidth > $(window).width()) {
            left = $(window).width() - popupWidth - 10; // 10px margin from the edge
        }

        // Check if popup goes beyond the bottom edge of the viewport
        if (top + popupHeight > $(window).scrollTop() + $(window).height()) {
            top = imageOffset.top - popupHeight - 10; // Position above the image
        }

        $popup.css({
            top: top,
            left: left
        });

        // Add the show class to start the transition
        setTimeout(function() {
            $popup.addClass('show');
        }, 10); // Delay to allow CSS transition

        // Close the popup when clicking outside
        $(document).on('click.popup', function() {
            removePopup();
        });
    }

    // Function to remove the popup
    function removePopup() {
        $('.popup').remove();
        $(document).off('click.popup'); // Remove the event handler
    }

    // Event handler to prevent closing the popup when clicking inside it
    $(document).on('click', '.popup', function(event) {
        event.stopPropagation();
    });

    // Event handler for when the location dropdown changes
    $('#location-filter').on('change', function() {
        const selectedLocation = $(this).val();
        if (selectedLocation) {
            fetchData(selectedLocation);  // Fetch data based on the selected location
        } else {
            $('#locations-container').html('<p>Please select a location.</p>');
            removePopup(); // Clear any existing popup
        }
    });

    // Initialize the dropdown menu on page load
    populateLocationDropdown();
});
