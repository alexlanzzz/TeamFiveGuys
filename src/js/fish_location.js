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

    const locationModal = $('#location-modal');
    const locationList = $('#location-list');
    const closeModalBtn = $('.close-btn');

    // Add this line to select the location display in the header
    const locationNameDisplay = $('#location-name');

    // Populate modal with location names
    Object.keys(locationDict).forEach(location => {
        locationList.append(`<li class="location-item">${location}</li>`);
    });

    // Show modal when location icon is clicked
    $('#location-icon').click(function () {
        locationModal.css('display', 'block'); // Show the modal
    });

    // Close modal when close button is clicked
    closeModalBtn.click(function () {
        locationModal.css('display', 'none'); // Hide the modal
    });

    // Close modal when clicking outside the modal content
    $(window).click(function (event) {
        if ($(event.target).is(locationModal)) {
            locationModal.css('display', 'none'); // Hide the modal
        }
    });

    // When a location is selected, update the location name in the header and close the modal
    $(document).on('click', '.location-item', function () {
        const selectedLocation = $(this).text();
        locationNameDisplay.text(selectedLocation); // Update the location name in the header
        locationModal.css('display', 'none'); // Close modal after selection

        fetchData(selectedLocation);
    });

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
                        <img src="images/fishes/${imageName}" alt="${species}" class="fish-item">
                        <p>${species}</p>
                    </div>
                `;
                stockedSpecies.add(species);
            }
        });

        // Insert the fish items into the container
        $('#locations-container').html(htmlContent);

        // Attach click event to each fish-item-container to show the Wikipedia popup
        $('.fish-item-container').click(function() {
            const species = $(this).find('p').text(); // Get the species name from the <p> element
            const $imageElement = $(this).find('img'); // Get the clicked image element
            fetchWikipediaInfo(species, $imageElement); // Fetch the Wikipedia info for this species
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
   //populateLocationDropdown();
});
