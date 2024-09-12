// Get the modal
var modal = document.getElementById("fish_modal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("fish_image");
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the image, open the modal
img.onclick = function(event) {
    modal.style.display = "block";
    // Position the modal beside the fish image
    var rect = img.getBoundingClientRect();
    modal.style.top = rect.top + "px";
    modal.style.left = (rect.right + 10) + "px"; // 10px gap between image and modal
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