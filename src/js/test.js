const menuIcon = document.getElementById("menuIcon");
const sideMenu = document.getElementById("sideMenu");

menuIcon.addEventListener("click", function () {
    if (sideMenu.classList.contains("open")) {
        sideMenu.classList.remove("open");
    } else {
        sideMenu.classList.add("open");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const helm = document.querySelector('.helm');
    const locations = document.querySelectorAll('.location');
    let currentRotation = 0;

    document.querySelector('.helm-container').addEventListener('mousemove', function (event) {
        const helmContainerRect = this.getBoundingClientRect();
        const containerCenterX = helmContainerRect.left + helmContainerRect.width / 2;
        const mouseX = event.clientX;

        const rotationSpeed = 0.2;  // Rotation speed can be adjusted

        if (mouseX < containerCenterX) {
            currentRotation -= rotationSpeed;
        } else {
            currentRotation += rotationSpeed;
        }

        // Rotate the helm
        helm.style.transform = `rotate(${currentRotation}deg)`;

        // Rotate the locations along with the helm
        locations.forEach(location => {
            const angle = parseInt(location.getAttribute('data-angle'));
            location.style.transform = `rotate(${angle - currentRotation}deg) translate(300px)`;
        });
    });
});
