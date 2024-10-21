document.addEventListener('DOMContentLoaded', function() {
    setBackgroundBasedOnTime();
});

// Set background time
function setBackgroundBasedOnTime() {
    const container = document.querySelector('.background-container');
    if (!container) {
        console.error('Unable to find the background-container element.');
        return;
    }

    const now = new Date();
    const hours = now.getHours();
    let timeOfDay = '';

    if (hours >= 5 && hours < 12) {
        timeOfDay = 'morning'; // Morning
    } else if (hours >= 12 && hours < 17) {
        timeOfDay = 'noon'; // Noon
    } else if (hours >= 17 && hours < 20) {
        timeOfDay = 'afternoon'; // Afternoon
    } else {
        timeOfDay = 'night'; // Night
    }

    // Remove all time classes
    container.classList.remove('morning', 'noon', 'afternoon', 'night');

    // Add the current time class
    container.classList.add(timeOfDay);

    console.log(`Current hour: ${hours}, applied class: ${timeOfDay}`);
}

// Get bird image element
const birdImg = document.getElementById('bird-img');

// Check if the current page is the index page
if (window.location.pathname.includes("index.html")) {
    // Get bird image element
    const birdImg = document.getElementById('bird-img');

    // Create popup element with additional tips
    const popup = document.createElement('div');
    popup.className = 'popup-window';
    popup.innerHTML = `
        <p>1. Click the boathead to find a fishing spot you want</p>
        <p>2. Pick a location from the map</p>
        <p>3. Get fish information and change location by clicking Helm</p>
    `;

    // Append popup to body
    document.body.appendChild(popup);

    // Handle click event to show popup
    birdImg.addEventListener('click', () => {
        popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'block' : 'none';
    });

    // Optionally hide the popup when clicked outside
    document.addEventListener('click', (event) => {
        if (!birdImg.contains(event.target) && !popup.contains(event.target)) {
            popup.style.display = 'none';
        }
    });
}