document.addEventListener('DOMContentLoaded', function() {
    setBackgroundBasedOnTime();
});

// Get Elements
const menuButton = document.getElementById('menu-button');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.querySelector('.sidebar .closebtn');
const weatherInfo = document.getElementById('weather-info');
const temperatureElement = document.getElementById('temperature');
const weatherDescriptionElement = document.getElementById('weather-description');

let weatherData = null; // To cache weather data

// WeatherAPI.com API Key
const WEATHER_API_KEY = '6a693f44a26e44eb86f101010242909'; // Replace with your actual API key

// Toggle Sidebar
menuButton.addEventListener('click', (event) => {
    sidebar.classList.toggle('open');
    // Prevent event from bubbling up to the document
    event.stopPropagation();
});

// Close Sidebar
closeBtn.addEventListener('click', (event) => {
    sidebar.classList.remove('open');
    // Prevent event from bubbling up to the document
    event.stopPropagation();
});

// Close Sidebar When Clicking Outside
document.addEventListener('click', (event) => {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnMenuButton = menuButton.contains(event.target);
    if (!isClickInsideSidebar && !isClickOnMenuButton && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

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

// Initialize Weather on Page Load
window.onload = getWeather;

window.addEventListener('load', function() {
    const loadingContainer = document.getElementById('loading-container');
    loadingContainer.classList.add('fade-out');

    // 在动画结束后，将加载容器从文档中移除
    setTimeout(function() {
        loadingContainer.style.display = 'none';
    }, 3000); // 与 CSS 中的过渡时间匹配（0.5s）
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
        timeOfDay = 'morning'; // 早晨
    } else if (hours >= 12 && hours < 17) {
        timeOfDay = 'noon'; // 中午
    } else if (hours >= 17 && hours < 20) {
        timeOfDay = 'afternoon'; // 下午
    } else {
        timeOfDay = 'night'; // 夜晚
    }

    // 移除之前的时间段类
    container.classList.remove('morning', 'noon', 'afternoon', 'night');

    // 添加当前时间段的类
    container.classList.add(timeOfDay);

    console.log(`Current hour: ${hours}, applied class: ${timeOfDay}`);
}