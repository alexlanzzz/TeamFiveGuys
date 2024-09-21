const menuIcon = document.getElementById("menuIcon");
const sideMenu = document.getElementById("sideMenu");

menuIcon.addEventListener("click", function () {
    sideMenu.classList.toggle("open");
});

document.addEventListener('DOMContentLoaded', function () {
    const helm = document.querySelector('.helm');
    const locations = document.querySelectorAll('.location');
    let currentRotation = 0;  // Track the current rotation in degrees

    helm.addEventListener('click', function () {
        // Increase rotation by 90 degrees
        currentRotation += 90;

        // Apply the rotation to the helm
        helm.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;

        // Rotate each location label with proper translation and rotation
        locations.forEach((location, index) => {
            const angle = index * 45; // Position each label at 45 degree intervals
            const newAngle = angle + currentRotation; // Add current helm rotation
            location.style.transform = `rotate(${newAngle}deg) translate(300px) rotate(-${newAngle}deg)`;
        });
    });
});

