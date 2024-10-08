// function fetchData(location) {
//     const apiUrl = 'https://www.data.qld.gov.au/api/3/action/datastore_search';
//     const resourceID = '3362e437-b0a1-467f-8331-2a051322c4b6';

//     let data = {
//         resource_id: resourceID,
//         limit: 20,
//         q: location
//     };

    
//     $('#loading').show();

//     // Display loading indicator (optional if you want this along with the loader)
//     $('#locations-container').html('<div class="loader"></div>');
//     removePopup(); // Remove any existing popup

//     $.ajax({
//         url: apiUrl,
//         data: data,
//         dataType: 'json',
//         beforeSend: function() {
            
//             $('#loading').show();
//         },
//         success: function(response) {
//             if (response.result.records && response.result.records.length > 0) {
//                 displayFishData(response.result.records);
//             } else {
//                 $('#locations-container').html('<p>No data found for this location.</p>');
//             }
//         },
//         error: function() {
//             $('#locations-container').html('<p>Failed to fetch data. Please try again later.</p>');
//         },
//         complete: function() {
            
//             $('#loading').hide();
//         }
//     });
// }

document.addEventListener('DOMContentLoaded', () => {
    const locationLinks = document.querySelectorAll('.fishing-spots a');

    locationLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const locationName = event.target.textContent;
            localStorage.setItem('selectedLocation', locationName);
        });
    });
});


// 获取视频元素
var video = document.getElementById('intro-video');
// 获取网页内容的元素
var content = document.getElementById('content');

// 当视频播放结束时触发的事件
video.onended = function() {
    // 隐藏视频
    video.style.display = 'none';
    // 显示网页内容
    content.style.display = 'block';
};


// 获取每个地点的元素
var location1 = document.getElementById('location1');
var location2 = document.getElementById('location2');
var location3 = document.getElementById('location3');

// 点击事件：获取地点名称并跳转到 fish_page.html
location1.addEventListener('click', function() {
    var locationName = "MT Crosby Weir"; // 获取该地点的名称
    window.location.href = "fish_page.html?location=" + encodeURIComponent(locationName); // 跳转并传递地点名称
});

location2.addEventListener('click', function() {
    var locationName = "Caboolture River Weir"; // 获取该地点的名称
    window.location.href = "fish_page.html?location=" + encodeURIComponent(locationName); // 跳转并传递地点名称
});

location3.addEventListener('click', function() {
    var locationName = "Wivenhoe Dam"; // 获取该地点的名称
    window.location.href = "fish_page.html?location=" + encodeURIComponent(locationName); // 跳转并传递地点名称
});
