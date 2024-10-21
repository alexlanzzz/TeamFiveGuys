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

  const locationName2Display = $('#location-name2');
  const locations = document.querySelectorAll('.location');
  const cacheDuration = 60 * 60 * 1000 * 12;
  const apikey = 'b8983068-7320-11ef-968a-0242ac130004-b89830e0-7320-11ef-968a-0242ac130004';

  // Retrieve the selected location from local storage
  const selectedLocation = localStorage.getItem('selectedLocation');
  if (selectedLocation) {
      locationName2Display.text(selectedLocation); // Update location name
      const coords = locationDict[selectedLocation]; 
      if (coords) {
          fetchTideData(coords);  
          fetchUVIndex(coords);
          fetchWindSpeed(coords);
          fetchPressure(coords);
      }
  }

  locations.forEach((location) => {
      location.addEventListener('click', function() {
          const selectedLocation = this.textContent;
          localStorage.setItem('selectedLocation', selectedLocation); // Store selected location
          locationName2Display.html(` ${selectedLocation}`); // Update location name
          fetchTideData(locationDict[selectedLocation]); // Fetch tide data based on location
      });
  });

  function fetchPressure(coords) {
      const [lat, lng] = coords.split(',');  
      const params = 'pressure';  
      const cacheKey = `pressure_${lat}_${lng}`;  
      const cachedData = JSON.parse(localStorage.getItem(cacheKey));  
      const now = new Date().getTime();

      if (cachedData && (now - cachedData.time < cacheDuration)) {
          displayPressure(cachedData.pressure);  
      } else {
          const apiUrl = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`;
          
          fetch(apiUrl, {
              headers: {
                  'Authorization': apikey  
              }
          })
          .then(response => response.json())
          .then(jsonData => {
              const pressure = jsonData.hours[0].pressure.noaa;  
              localStorage.setItem(cacheKey, JSON.stringify({ pressure, time: now }));
              displayPressure(pressure);
          })
          .catch(error => {
              console.error('Error fetching pressure:', error);
              displayPressure('Error');
          });
      }
  }

  function displayPressure(pressure) {
      const pressureElement = document.getElementById('pressure');  
      pressureElement.textContent = `${pressure} hPa`;  
  }

  function fetchUVIndex(coords) {
      const [lat, lng] = coords.split(',');
      const params = 'uvIndex';
      const cacheKey = `uvIndex_${lat}_${lng}`;
      const cachedData = JSON.parse(localStorage.getItem(cacheKey));
      const now = new Date().getTime();

      if (cachedData && (now - cachedData.time < cacheDuration)) {
          displayUVIndex(cachedData.uvIndex);
      } else {
          const apiUrl = `https://api.stormglass.io/v2/solar/point?lat=${lat}&lng=${lng}&params=${params}`;
          
          fetch(apiUrl, {
              headers: {
                  'Authorization': apikey
              }
          })
          .then(response => response.json())
          .then(jsonData => {
              if (jsonData.data && jsonData.data.length > 0) {
                  const uvIndex = jsonData.data[0].uvIndex.sg;
                  localStorage.setItem(cacheKey, JSON.stringify({ uvIndex, time: now }));
                  displayUVIndex(uvIndex);
              } else {
                  displayUVIndex('N/A');
              }
          })
          .catch(error => {
              console.error('Error fetching UV index:', error);
              displayUVIndex('Error');
          });
      }
  }

  function displayUVIndex(uvIndex) {
      const uvIndexElement = document.getElementById('uv-index');
      uvIndexElement.textContent = uvIndex;
  }

  function fetchWindSpeed(coords) {
      const [lat, lng] = coords.split(',');
      const params = 'windSpeed';
      const cacheKey = `windSpeed_${lat}_${lng}`;
      const cachedData = JSON.parse(localStorage.getItem(cacheKey));
      const now = new Date().getTime();

      if (cachedData && (now - cachedData.time < cacheDuration)) {
          displayWindSpeed(cachedData.windSpeed);
      } else {
          const apiUrl = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`;
          
          fetch(apiUrl, {
              headers: {
                  'Authorization': apikey
              }
          })
          .then(response => response.json())
          .then(jsonData => {
              const windSpeed = jsonData.hours[0].windSpeed.noaa;
              localStorage.setItem(cacheKey, JSON.stringify({ windSpeed, time: now }));
              displayWindSpeed(windSpeed);
          })
          .catch(error => {
              console.error('Error fetching wind speed:', error);
              displayWindSpeed('Error');
          });
      }
  }

  function displayWindSpeed(windSpeed) {
      const windSpeedElement = document.getElementById('wind-speed');
      windSpeedElement.textContent = `${windSpeed} m/s`;
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
              time: new Date(tide.time),
              type: tide.type  
          }));
          drawSmoothWave(tideData);
      } else {
          fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&start=${currentDate}&end=${endDate}`, {
              headers: {
                  'Authorization': apikey
              }
          })
          .then(response => response.json())
          .then(jsonData => {
              const tideData = jsonData.data.map(tide => ({
                  height: Math.max(Math.min(parseFloat(tide.height.toFixed(2)), 2), -2),  
                  time: new Date(tide.time), 
                  type: tide.type  
              }));

              localStorage.setItem(cacheKey, JSON.stringify(tideData));
              drawSmoothWave(tideData);  
          })
          .catch(error => {
              console.error('Error fetching tide data:', error);
          });
      }
  }

  function drawSmoothWave(tideData) {
      const canvas = document.getElementById('tideCanvas');
      const ctx = canvas.getContext('2d');

      // Clear the previous drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const heightScaleFactor = 100;  // Scaling factor for wave height
      const waveHeightMax = 2; // Maximum wave height (in meters)
      const waveHeightMin = -2; // Minimum wave height (in meters)

      // Calculate the min and max time from the tide data
      const minTime = tideData[0].time.getTime();
      const maxTime = tideData[tideData.length - 1].time.getTime();
      const timeRange = maxTime - minTime;

      // Draw X-Axis (Time)
      ctx.beginPath();
      ctx.moveTo(50, canvasHeight - 50); // Position 50px from the bottom
      ctx.lineTo(canvasWidth - 20, canvasHeight - 50);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Y-Axis (Height)
      ctx.beginPath();
      ctx.moveTo(50, 0); // Position 50px from the left
      ctx.lineTo(50, canvasHeight - 20);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label the Y-Axis
      const yTicks = 5; // Number of ticks on Y-Axis
      for (let i = 0; i <= yTicks; i++) {
          const yValue = waveHeightMin + (waveHeightMax - waveHeightMin) * (i / yTicks);
          const yPosition = canvasHeight - 50 - (canvasHeight - 100) * (i / yTicks); // Adjust based on canvas height
          ctx.fillText(`${yValue.toFixed(1)} m`, 10, yPosition); // Label on the left
      }

      // Label the X-Axis
      const xTicks = 10; // Number of ticks on X-Axis
      for (let i = 0; i <= xTicks; i++) {
          const xPosition = ((canvasWidth - 70) * (i / xTicks)) + 50; // Position based on canvas width
          ctx.fillText(`${Math.round((timeRange / xTicks) * i / 3600000)}h`, xPosition, canvasHeight - 30); // Convert to hours
      }

      // Normalize time values and map them to the canvas width
      const times = tideData.map(data => ((data.time.getTime() - minTime) / timeRange) * (canvasWidth - 100) + 50);
      const heights = tideData.map(data => canvasHeight - 50 - ((data.height - waveHeightMin) / (waveHeightMax - waveHeightMin)) * (canvasHeight - 100)); // Scale heights

      if (heights.length < 2) {
          console.error("Not enough data points to draw a wave.");
          return;
      }

      // Begin drawing the wave
      ctx.beginPath();
      ctx.moveTo(times[0], heights[0]); // Start at the first point

      // Use quadratic curves for smooth transitions between points
      for (let i = 1; i < times.length; i++) {
          const xc = (times[i - 1] + times[i]) / 2; // Midpoint for the curve
          const yc = (heights[i - 1] + heights[i]) / 2; // Midpoint height
          ctx.quadraticCurveTo(times[i - 1], heights[i - 1], xc, yc);
      }

      // Finish the path at the last point
      ctx.lineTo(times[times.length - 1], heights[times.length - 1]);

      // Style and stroke the path
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add text labels for each data point (closer to the wave)
      tideData.forEach((data, index) => {
          const x = times[index];
          const y = heights[index];

          // Format the time for display
          const timeString = data.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          // Set font style and color
          ctx.fillStyle = "black";
          ctx.font = "14px Arial";

          // Adjust the y position of text depending on the height of the wave
          const labelOffsetY = heights[index] > 0 ? 15 : -15; // Place label above for high points, below for low points

          // Adjust text positioning for the last point
          if (index === times.length - 1) {
              ctx.fillText(`${data.type} (${data.height.toFixed(2)}m) ${timeString}`, x - 150, y + labelOffsetY);
          } else {
              ctx.fillText(`${data.type} (${data.height.toFixed(2)}m) ${timeString}`, x + 5, y + labelOffsetY);
          }
      });
  }
});

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

  // Remove loading container after animation ends
  setTimeout(function() {
      loadingContainer.style.display = 'none';
  }, 1000); // Match with CSS transition time (0.5s)
});
