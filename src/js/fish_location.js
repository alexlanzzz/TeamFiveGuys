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
        "Australian Bass": "australian_bass.png",
        "Barramundi": "barramundi.png",
        "Golden Perch": "Golden_Perch.png",
        "Mary River Cod": "Murray_Cod.png",
        "Saratoga": "saratoga.png",
        "Silver Perch": "silver perch.png",
    };

    // Update location name in the header on click
    const locationNameDisplay = $('#location-name');
    const locations = document.querySelectorAll('.location');

    // Retrieve the selected location from local storage
    const selectedLocation = localStorage.getItem('selectedLocation');
    if (selectedLocation) {
        locationNameDisplay.text(selectedLocation); // Update location name
        fetchData(selectedLocation); // Fetch fish data based on location
    }

    // Event listener for clicking the helm locations
    locations.forEach((location) => {
        location.addEventListener('click', function() {
            const selectedLocation = this.textContent;
            locationNameDisplay.text(selectedLocation); // Update location name
            fetchData(selectedLocation); // Fetch fish data based on location
        });
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

            // Ensure each species is displayed only once
            if (!stockedSpecies.has(species)) {
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
            const species = $(this).find('p').text();
            const $imageElement = $(this).find('img');
            fetchWikipediaInfo(species, $imageElement); // Fetch Wikipedia info for this species
        });
    }

    // Function to fetch information from Wikipedia API
    function fetchWikipediaInfo(fishSpecies, $imageElement) {
        const wikiApiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(fishSpecies)}`;

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

        const $popup = $(`
            <div class="popup">
                <div class="popup-content">
                    <h3>Fish Information</h3>
                    <p>${content}</p>
                </div>
            </div>
        `);

        $('body').append($popup);
        adjustPopupPosition($popup, $imageElement);

        setTimeout(function() {
            $popup.addClass('show');
        }, 10); // Delay to allow CSS transition

        $(document).on('click.popup', function() {
            removePopup();
        });
    }

    // Function to adjust the position of the popup after it's rendered
    function adjustPopupPosition($popup, $imageElement) {
        const imageOffset = $imageElement.offset();
        const imageHeight = $imageElement.height();
        const popupWidth = $popup.outerWidth();
        const popupHeight = $popup.outerHeight();

        let top = imageOffset.top + imageHeight + 10;
        let left = imageOffset.left;

        if (left + popupWidth > $(window).width()) {
            left = $(window).width() - popupWidth - 10;
        }

        if (top + popupHeight > $(window).scrollTop() + $(window).height()) {
            top = imageOffset.top - popupHeight - 10;
        }

        if (top < $(window).scrollTop()) {
            top = imageOffset.top + imageHeight + 10;
        }

        $popup.css({
            top: top + 'px',
            left: left + 'px'
        });
    }

    // Function to remove the popup
    function removePopup() {
        $('.popup').remove();
        $(document).off('click.popup');
    }

    // Event handler to prevent closing the popup when clicking inside it
    $(document).on('click', '.popup', function(event) {
        event.stopPropagation();
    });

    // **Fix Helm Rotation**
    const helm = document.querySelector('.helm');
    let currentRotation = 0;  // Track the current rotation

    helm.addEventListener('click', function () {
        currentRotation += 90; // Rotate 90 degrees with each click
        helm.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;

        locations.forEach((location, index) => {
            const angle = index * 45; // Each location is 45 degrees apart
            const newAngle = angle + currentRotation;
            location.style.transform = `rotate(${newAngle}deg) translate(300px) rotate(-${newAngle}deg)`;
        });
    });
});
