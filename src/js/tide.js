
const lat = 60.936;
const lng = 5.114;
const tideInfoDiv = document.getElementById('tide-info');


document.getElementById('ocean-image').addEventListener('click', () => {
  fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&start=2024-09-14&end=2024-09-15`, {
    headers: {
      'Authorization': 'b8983068-7320-11ef-968a-0242ac130004-b89830e0-7320-11ef-968a-0242ac130004' 
    }
  })
  .then((response) => response.json())
  .then((jsonData) => {
    console.log(jsonData); 

    tideInfoDiv.innerHTML = ''; 

    
    jsonData.data.forEach((tide) => {
      const { height, time, type } = tide;
      tideInfoDiv.innerHTML += `<p>Time: ${new Date(time).toLocaleString()}</p>`;
      tideInfoDiv.innerHTML += `<p>Height: ${height} meters</p>`;
      tideInfoDiv.innerHTML += `<p>Type: ${type.charAt(0).toUpperCase() + type.slice(1)} tide</p>`;
      tideInfoDiv.innerHTML += '<hr>';
    });
  })
  .catch((error) => {
    console.error('Error fetching tide data:', error);
    tideInfoDiv.innerHTML = 'Error loading tide data.';
  });
});

//0d15ffe2-728d-11ef-a732-0242ac130004-0d160046-728d-11ef-a732-0242ac130004
//b8983068-7320-11ef-968a-0242ac130004-b89830e0-7320-11ef-968a-0242ac130004