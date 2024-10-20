$(document).ready(function() {
    const helmContainer = $('#helm-container');
    const locationNameDisplay = $('#location-name');
    const locations = document.querySelectorAll('.location');

    // Retrieve the selected location from local storage
    const selectedLocation = localStorage.getItem('selectedLocation');
    if (selectedLocation) {
        locationNameDisplay.html(`<p class="additional-text">What you can catch in:</p> ${selectedLocation}`);
    }

    // Event listener for clicking the helm container
    helmContainer.on('click', function() {
        helmContainer.toggleClass('rotated');
    });

    // Event listener for clicking the location names
    locations.forEach((location) => {
        location.addEventListener('click', function() {
            const selectedLocation = this.textContent;
            locationNameDisplay.html(`<p class="additional-text">What you can catch in:</p> ${selectedLocation}`);
            localStorage.setItem('selectedLocation', selectedLocation); // Store the new location name in local storage
            helmContainer.removeClass('rotated'); // Rotate back the helm container
        });
    });

    $(document).ready(function() {
        const helmPromptText = $('#helm-prompt-text');
        const helm = $('#helm');
    
        // Event listener for clicking the helm container
        helm.on('click', function() {
            helmPromptText.toggle(); // Toggle the visibility of the helm prompt text on each click
        });
    }); 
});