const weatherInfo = document.getElementById('weather-info');
const temperatureElement = document.getElementById('temperature');
const weatherDescriptionElement = document.getElementById('weather-description');

let weatherData = null; // To cache weather data

// WeatherAPI.com API Key
const WEATHER_API_KEY = 'ccc58f83486e4c128b825503241810 '; // Replace with your actual API key


// Fetch and Display Weather Information
function getWeather() {
    const cachedWeather = localStorage.getItem('weatherData');
    const cachedTime = localStorage.getItem('weatherDataTime');
    const now = new Date().getTime();

    if (cachedWeather && cachedTime && (now - cachedTime < 15 * 60 * 1000)) { // 15 minutes cache
        displayWeather(JSON.parse(cachedWeather));
    } else {
        if (navigator.geolocation) {
            weatherInfo.classList.add('loading'); // Add loading state
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            weatherDescriptionElement.textContent = "Geolocation is not supported.";
            temperatureElement.textContent = "--°C";
        }
    }
}

function success(position) {
    weatherInfo.classList.remove('loading'); // Remove loading state
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    // Call WeatherAPI.com API
    fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&lang=en`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Cache data and time
            localStorage.setItem('weatherData', JSON.stringify(data));
            localStorage.setItem('weatherDataTime', new Date().getTime());

            displayWeather(data);
        })
        .catch(error => {
            console.error('Failed to fetch weather data:', error);
            weatherDescriptionElement.textContent = "Unable to retrieve weather data.";
            temperatureElement.textContent = "--°C";
        });
}

function displayWeather(data) {
    weatherData = data; // Cache data for future use
    const temp = data.current.temp_c; // Always use Celsius
    const description = data.current.condition.text;
    const iconUrl = `https:${data.current.condition.icon}`;
    
    temperatureElement.textContent = `${temp}°C`;
    weatherDescriptionElement.textContent = description;
    
    // Update weather info container with icon and temperature
    weatherInfo.innerHTML = `<img src="${iconUrl}" alt="Weather Icon"> ${temp}°C, ${description}`;
}

function error(err) {
    weatherInfo.classList.remove('loading'); // Remove loading state
    console.warn(`ERROR(${err.code}): ${err.message}`);
    weatherDescriptionElement.textContent = "Unable to retrieve your location.";
    temperatureElement.textContent = "--°C";
}

window.onload = getWeather;


document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        const loadingContainer = document.getElementById('loading-container');
        loadingContainer.classList.add('fade-out');
        
        // Remove the loading container from the DOM after the fade-out transition
        setTimeout(function() {
            loadingContainer.style.display = 'none';
        }, 1000); // Match this duration with the CSS transition duration
    }, 1500);
});
