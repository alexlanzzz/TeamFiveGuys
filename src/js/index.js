document.querySelector('.fisherman').addEventListener("click", function(event) {
    var clientX = event.clientX;
    var clientY = event.clientY;
    var offsetX = event.offsetX;
    var offsetY = event.offsetY;

    console.log("ClientX: " + clientX + ", ClientY: " + clientY);
    console.log("OffsetX: " + offsetX + ", OffsetY: " + offsetY); 
    });

    // Get the modal
var modal = document.getElementById("Spot_modal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("Spot_image");
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the image, open the modal
img.onclick = function(event) {
    modal.style.display = "block";
    modal.style.position = "fixed";  // 使用 fixed 位置
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";  // 使模态框居中
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}