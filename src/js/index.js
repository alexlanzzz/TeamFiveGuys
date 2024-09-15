document.addEventListener('DOMContentLoaded', function() {
    // 获取渔夫视频元素
    const fishermanVideo = document.querySelector('.fisherman');
    console.log('fishermanVideo:', fishermanVideo);
    if (!fishermanVideo) {
        console.error('无法获取 fisherman 视频元素');
        return;
    }

    // 获取模态框和关闭按钮
    var modal = document.getElementById("Spot_modal");
    var span = document.getElementsByClassName("close")[0];

    console.log('Modal element:', modal);
    console.log('Close button element:', span);

    if (!modal) {
        console.error('无法获取模态框元素');
    }

    if (!span) {
        console.error('无法获取关闭按钮元素');
    }

    // 当鼠标悬停在渔夫视频上时，播放视频
    fishermanVideo.addEventListener("mouseenter", function() {
        console.log("Mouse entered fisherman video");
        fishermanVideo.currentTime = 0; // 重置到视频开始位置
        if (fishermanVideo.readyState >= 2) {
            fishermanVideo.play();
        } else {
            fishermanVideo.addEventListener('canplay', function() {
                fishermanVideo.play();
            }, { once: true });
        }
    });

    // 当鼠标移开渔夫视频时，暂停视频并重置到初始帧
    fishermanVideo.addEventListener("mouseleave", function() {
        console.log("Mouse left fisherman video");
        fishermanVideo.pause();
        fishermanVideo.currentTime = 0; // 重置到视频开始位置
    });

    // 当用户点击渔夫视频时，打开模态框
    fishermanVideo.addEventListener("click", function(event) {
        console.log("Fisherman video clicked");
        modal.style.display = "block";
    });

    // 当用户点击关闭按钮时，关闭模态框
    if (span) {
        span.onclick = function() {
            console.log('Close button clicked');
            modal.style.display = "none";
        };
    }

    // 当用户点击模态框外部时，关闭模态框
    window.onclick = function(event) {
        if (event.target == modal) {
            console.log('Clicked outside modal content');
            modal.style.display = "none";
        }
    };
});
