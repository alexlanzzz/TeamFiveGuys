const menuIcon = document.getElementById("menuIcon");
const sideMenu = document.getElementById("sideMenu");

menuIcon.addEventListener("click", function () {
    sideMenu.classList.toggle("open");
});

document.addEventListener('DOMContentLoaded', function () {
    const helm = document.querySelector('.helm');
    const locations = document.querySelectorAll('.location');
    let currentRotation = 0;  // Track the current rotation

    helm.addEventListener('click', function () {
        currentRotation += 90; // Rotate 90 degrees with each click
        helm.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;

        locations.forEach((location, index) => {
            const angle = index * 45; // Each location is 45 degrees apart
            const newAngle = angle + currentRotation;
            location.style.transform = `rotate(${newAngle}deg) translate(300px) rotate(-${newAngle}deg)`;
        });
    });
});
