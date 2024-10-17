document.addEventListener('DOMContentLoaded', function() {
    const locations = document.querySelectorAll('.location');

    locations.forEach((location) => {
        location.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            const selectedLocation = this.textContent;
            localStorage.setItem('selectedLocation', selectedLocation); // Store location name in local storage
            window.location.href = this.href; // Navigate to the fish page
        });
    });
});