//0d15ffe2-728d-11ef-a732-0242ac130004-0d160046-728d-11ef-a732-0242ac130004
//b8983068-7320-11ef-968a-0242ac130004-b89830e0-7320-11ef-968a-0242ac130004
$(document).ready(function() {
  // Dictionary of available locations with coordinates (latitude, longitude)
  const locationDict = {
    "Mt Crosby Weir": "-27.5455,152.7649",       
    "Caboolture River Weir": "-27.0716,152.9525", 
    "Wivenhoe Dam": "-27.3836,152.5860",         
    "North Pine Dam": "-27.2751,152.9165",       
    "Somerset Dam": "-27.1287,152.5639",         
    "Logan River": "-27.6392,153.2030",          
    "Albert River": "-27.8004,153.2480",      
    "Bremer River": "-27.6164,152.7661"        
};

  const locationNameDisplay = $('#location-name');
  const locations = document.querySelectorAll('.location');

  // Retrieve the selected location from local storage
  const selectedLocation = localStorage.getItem('selectedLocation');
  if (selectedLocation) {
      locationNameDisplay.text(selectedLocation); // Update location name
      const coords = locationDict[selectedLocation]; 
      if (coords) {
          fetchTideData(coords);  
      }
  }

 
  function fetchTideData(coords) {
    const [lat, lng] = coords.split(',');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');

    const currentDate = `${year}-${month}-${day}`;
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextYear = tomorrow.getFullYear();
    const nextMonth = String(tomorrow.getMonth() + 1).padStart(2, '0'); 
    const nextDay = String(tomorrow.getDate()).padStart(2, '0');

    const endDate = `${nextYear}-${nextMonth}-${nextDay}`;

    const cacheKey = `tideData_${lat}_${lng}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      const tideData = JSON.parse(cachedData).map(tide => ({
          height: tide.height,
          time: new Date(tide.time), // 将字符串转换为 Date 对象
          type: tide.type  
      }));
      drawSmoothWave(tideData)}
       else {
        fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&start=${currentDate}&end=${endDate}`, {
            headers: {
                'Authorization': '0d15ffe2-728d-11ef-a732-0242ac130004-0d160046-728d-11ef-a732-0242ac130004'
            }
        })
        .then(response => response.json())
        .then(jsonData => {
            const tideData = jsonData.data.map(tide => ({
                height: Math.max(Math.min(parseFloat(tide.height.toFixed(2)), 2), -2),  
                time: new Date(tide.time), 
                type: tide.type  
            }));

            localStorage.setItem(cacheKey, JSON.stringify(tideData)); // 缓存数据
            drawSmoothWave(tideData);  
        })
        .catch(error => {
            console.error('Error fetching tide data:', error);
        });
    }
}





function drawWaveBars(tideData) {
  const canvas = document.getElementById('tideCanvas');
  const ctx = canvas.getContext('2d');

 
  canvas.width = window.innerWidth;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const heightScaleFactor = 300; 
  const verticalOffset = 300;  

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  
  const interpolatedTimes = [];
  const interpolatedHeights = [];

  for (let i = 0; i < tideData.length - 1; i++) {
    const currentTime = new Date(tideData[i].time);
    const nextTime = new Date(tideData[i + 1].time);
    const currentHeight = tideData[i].height;
    const nextHeight = tideData[i + 1].height;

    
    const numSubdivisions = 10; 
    for (let j = 0; j <= numSubdivisions; j++) {
      const interpolatedTime = new Date(
        currentTime.getTime() + (nextTime.getTime() - currentTime.getTime()) * (j / numSubdivisions)
      );
      const interpolatedHeight = currentHeight + (nextHeight - currentHeight) * (j / numSubdivisions);
      interpolatedTimes.push(interpolatedTime);
      interpolatedHeights.push(interpolatedHeight);
    }
  }

  const times = interpolatedTimes.map((_, index) => (index / (interpolatedTimes.length - 1)) * canvasWidth);
  const heights = interpolatedHeights.map(height => height * heightScaleFactor);  

  const barWidth = canvasWidth / times.length * 0.8; 

  
  for (let i = 0; i < times.length; i++) {
    const x = times[i] - barWidth / 2;  
    const y = canvasHeight - heights[i] - verticalOffset;  

    
    ctx.fillStyle = "blue";
    ctx.fillRect(x, canvasHeight, barWidth, y - canvasHeight);  
  }

  
  ctx.beginPath();
  ctx.moveTo(0, canvasHeight - heights[0] - verticalOffset);  

  for (let i = 1; i < times.length; i++) {
    const xc = (times[i - 1] + times[i]) / 2;  
    const yc = (canvasHeight - heights[i - 1] + canvasHeight - heights[i]) / 2 - verticalOffset;  
    ctx.quadraticCurveTo(times[i - 1], canvasHeight - heights[i - 1] - verticalOffset, xc, yc);
  }

  
  ctx.lineTo(times[times.length - 1], canvasHeight - heights[times.length - 1] - verticalOffset);

  ctx.strokeStyle = "lightblue";
  ctx.lineWidth = 2;
  ctx.stroke();

 
  tideData.forEach((data, index) => {
    const x = (index / (tideData.length - 1)) * canvasWidth;  
    const y = canvasHeight - data.height * heightScaleFactor - verticalOffset;  

    
    const timeString = data.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";  
    ctx.fillText(`${data.type} (${data.height.toFixed(2)}m) ${timeString}`, x - 50, y - 20);  
  });
}


function drawSmoothWave(tideData) {
  const canvas = document.getElementById('tideCanvas');
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const heightScaleFactor = 200;  

 
  const times = tideData.map((data, index) => (index / (tideData.length - 1)) * canvasWidth);
  const heights = tideData.map(data => data.height * heightScaleFactor);  

  if (heights.length < 2) {
    console.error("Not enough data points to draw a wave.");
    return;
  }


  ctx.beginPath();
  ctx.moveTo(0, canvasHeight / 2 - heights[0]);  

  for (let i = 1; i < times.length; i++) {
    const xc = (times[i - 1] + times[i]) / 2; 
    const yc = (canvasHeight / 2 - heights[i - 1] + canvasHeight / 2 - heights[i]) / 2;  
    ctx.quadraticCurveTo(times[i - 1], canvasHeight / 2 - heights[i - 1], xc, yc);
  }

 
  ctx.lineTo(times[times.length - 1], canvasHeight / 2 - heights[times.length - 1]);

  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();

 
  tideData.forEach((data, index) => {
    const x = times[index];
    const y = canvasHeight / 2 - heights[index];

    
    console.log(`Point ${index}: Height=${data.height}, Time=${data.time}, Type=${data.type}`);

   
    const timeString = data.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

   
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";  

    
    if (index === times.length - 1) {
      ctx.fillText(`${data.type} (${data.height.toFixed(2)}m) ${timeString}`, x - 150, y - 10);
    } else {
      ctx.fillText(`${data.type} (${data.height.toFixed(2)}m) ${timeString}`, x + 5, y - 10);
    }
  });
}})
const weatherInfo = document.getElementById('weather-info');
const temperatureElement = document.getElementById('temperature');
const weatherDescriptionElement = document.getElementById('weather-description');

let weatherData = null; // To cache weather data

// WeatherAPI.com API Key
const WEATHER_API_KEY = '6a693f44a26e44eb86f101010242909'; // Replace with your actual API key




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
    }, 1000); // 与 CSS 中的过渡时间匹配（0.5s）
});
