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
        "Silver Perch": "silver_perch.png",
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

    // Function to display fish data as images
    function displayFishData(fishRecords) {
        let htmlContent = '';
        let stockedSpecies = new Set(); // To store unique species

        fishRecords.forEach(record => {
            const species = record['Species stocked'];

            // Ensure each species is displayed only once
            if (!stockedSpecies.has(species)) {
                const imageName = speciesImageMap[species] || 'fish1.png';
                const direction = Math.random() > 0.5 ? 'left' : 'right';
                const startPosition = direction === 'left' ? '-100px' : 'calc(100% - 100px)';

                htmlContent += `
                    <div class="fish-item-container" data-species="${species}" data-image="images/fishes/${imageName}" data-direction="${direction}">
                        <img src="images/fishes/${imageName}" alt="${species}" class="fish-item" style="left: ${startPosition}; transform: scaleX(${direction === 'left' ? -1 : 1});">
                    </div>
                `;
                stockedSpecies.add(species);
            }
        });

        // Insert the fish items into the container
        $('#locations-container').html(htmlContent);

        // Animate the fish items
        $('.fish-item-container').each(function() {
            const $fishItem = $(this).find('.fish-item');
            const direction = $(this).data('direction') === 'left' ? -1 : 1;
            animateFish($fishItem, direction);
        });

        // Add click event listener to fish item containers
        $('.fish-item-container').click(function() {
            const species = $(this).data('species');
            const imageSrc = $(this).data('image');
            fetchWikipediaInfo(species, imageSrc);
        });
    }

    // Function to animate fish
    function animateFish($fishItem, direction) {
        const speed = 2; // Speed in pixels per frame

        function moveFish() {
            const fishPosition = $fishItem.position().left;
            const fishWidth = $fishItem.width();
            const containerWidth = $(window).width();

            if (direction === 1 && fishPosition + fishWidth >= containerWidth) {
                direction = -1;
                $fishItem.css('transform', 'scaleX(-1)'); // Flip the fish image
            } else if (direction === -1 && fishPosition <= 0) {
                direction = 1;
                $fishItem.css('transform', 'scaleX(1)'); // Reset the fish image
            }

            $fishItem.css('left', fishPosition + speed * direction);

            requestAnimationFrame(moveFish);
        }

        moveFish();
    }

    // Function to fetch Wikipedia info for a species
    function fetchWikipediaInfo(species, imageSrc) {
        const wikiApiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(species)}`;

        $.ajax({
            url: wikiApiUrl,
            dataType: 'json',
            success: function(response) {
                if (response.extract) {
                    showPopup(species, imageSrc, response.extract);
                } else {
                    showPopup(species, imageSrc, 'No information available.');
                }
            },
            error: function() {
                showPopup(species, imageSrc, 'Failed to fetch information.');
            }
        });
    }

    // Function to show the popup with species info
    function showPopup(species, imageSrc, info) {
        $('#popup-image').attr('src', imageSrc);
        $('#popup-text').html(`<h2>${species}</h2><p>${info}</p>`);
        $('#popup-container').show();
    }

    // Function to remove any existing popup
    function removePopup() {
        $('.popup').remove();
        $(document).off('click.popup');
    }

    // Close the popup when the close button is clicked
    $('.close-btn').click(function() {
        $('#popup-container').hide();
    });

    // Close the popup when clicking outside of the popup content
    $(window).click(function(event) {
        if ($(event.target).is('#popup-container')) {
            $('#popup-container').hide();
        }
    });

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