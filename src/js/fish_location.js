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
        locationNameDisplay.html(`<p class="additional-text">What you can catch in:</p> ${selectedLocation}`); // Update location name
        fetchData(selectedLocation); // Fetch fish data based on location
    }

    // Event listener for clicking the helm locations
    locations.forEach((location) => {
        location.addEventListener('click', function() {
            const selectedLocation = this.textContent;
            locationNameDisplay.html(`<p class="additional-text">What you can catch in:</p> ${selectedLocation}`); // Update location name
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
        $('#fish-container').html('<div class="loader"></div>');

        $.ajax({
            url: apiUrl,
            data: data,
            dataType: 'json',
            success: function(response) {
                if (response.result.records && response.result.records.length > 0) {
                    const uniqueFishRecords = filterUniqueSpecies(response.result.records);
                    displayFishData(uniqueFishRecords);
                } else {
                    $('#fish-container').html('<p>No data found for this location.</p>');
                }
            },
            error: function() {
                $('#fish-container').html('<p>Failed to fetch data. Please try again later.</p>');
            }
        });
    }

    // Function to filter unique species
    function filterUniqueSpecies(records) {
        const seenSpecies = new Set();
        return records.filter(record => {
            const species = record['Species stocked'];
            if (seenSpecies.has(species)) {
                return false;
            } else {
                seenSpecies.add(species);
                return true;
            }
        });
    }

    let fishData = []; // Store fetched fish data
    let currentIndex = 0; // Track the current fish being displayed
    let detailsVisible = false; // Track if details are currently visible
    
    function displayFishData(fishRecords) {
        fishData = fishRecords; // Store the fish records for navigation
        displayCurrentFish(); // Display the first fish
    }
    
    function displayCurrentFish() {
        const currentFish = fishData[currentIndex];
        const species = currentFish['Species stocked'];
        const imageName = speciesImageMap[species] || 'australian_bass.png';

        // Log the species to the console for debugging
        console.log(`Displaying fish species: ${species}`);
    
        // Update the HTML for the current fish and buttons
        const htmlContent = `
            <div class="fish-item-container">
                <img src="images/fishes/${imageName}" alt="${species}" class="fish-item zoom-animation">
                <div class="fish-name">${species}</div>
            </div>
            <div class="fish-detail-container"></div> <!-- Container for fish details -->
        `;
    
        $('#fish-container').html(htmlContent); // Display the current fish
    
        // Add click event listener to toggle the slide effect for details
        $('.fish-item-container').click(function() {
            if (!detailsVisible) {
                // If details are hidden, show them by sliding left
                const imageSrc = `images/fishes/${imageName}`;
                fetchWikipediaInfo(species, imageSrc); // Fetch details for the clicked fish
    
                $('.fish-item-container').addClass('slide-left'); // Add sliding animation to the container
                $('.fish-detail-container').addClass('show-details'); // Show the details container
            } else {
                // If details are visible, hide them by sliding back to the center
                $('.fish-item-container').removeClass('slide-left'); // Slide back to the center
                $('.fish-detail-container').removeClass('show-details'); // Hide the details container
            }
            detailsVisible = !detailsVisible; // Toggle visibility status
        });

        // Add hover effect for scaling the image when hovered
        $('.fish-item').hover(
            function() {
                $(this).css('transform', 'scale(1.2)'); // Scale image when hovered
            }, 
            function() {
                $(this).css('transform', 'scale(1)'); // Reset scale when hover ends
            }
        );
    }
    
    // Event listeners for navigation buttons
    $('#prevButton').click(function() {
        currentIndex = (currentIndex - 1 + fishData.length) % fishData.length; // Loop backward
        resetFishDisplay(); // Reset the fish display and details
        displayCurrentFish(); // Display the previous fish
    });
    
    $('#nextButton').click(function() {
        currentIndex = (currentIndex + 1) % fishData.length; // Loop forward
        resetFishDisplay(); // Reset the fish display and details
        displayCurrentFish(); // Display the next fish
    });
    
    // Function to reset fish display before switching
    function resetFishDisplay() {
        $('.fish-item-container').removeClass('slide-left'); // Remove the sliding class
        $('.fish-detail-container').removeClass('show-details'); // Hide the details
        detailsVisible = false; // Reset the visibility status
    }
    
    // Function to fetch fish details
    function fetchWikipediaInfo(species, imageSrc) {
        // The Saratoga species name is different in the Wikipedia API
        if (species === 'Saratoga') {
            species = 'Southern saratoga';
        }

        const wikiApiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(species)}`;
    
        $.ajax({
            url: wikiApiUrl,
            dataType: 'json',
            success: function(response) {
                if (response.extract) {
                    displayFishDetails(species, imageSrc, response.extract);
                } else {
                    displayFishDetails(species, imageSrc, 'No information available.');
                }
            },
            error: function() {
                displayFishDetails(species, imageSrc, 'Failed to fetch information.');
            }
        });
    }
    
    // Function to display the fish details in the right container
    function displayFishDetails(species, imageSrc, info) {
        const detailsHtml = `
            <h2>${species}</h2>
            <p>${info}</p>
        `;
        $('.fish-detail-container').html(detailsHtml); // Inject the details into the right-side container
    }  
    
});