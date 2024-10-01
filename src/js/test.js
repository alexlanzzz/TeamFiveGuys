document.addEventListener('DOMContentLoaded', function () {
    const helm = document.querySelector('.helm');
    const locations = document.querySelectorAll('.location');
    let currentRotation = 0;  // Track the current rotation

    helm.addEventListener('click', function () {
        currentRotation += 90; // Rotate 90 degrees with each click
        helm.style.transition = 'transform 1s ease-in-out';  // Add transition for smooth rotation
        helm.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;

        locations.forEach((location, index) => {
            const angle = index * 45; // Each location is 45 degrees apart
            const newAngle = angle + currentRotation;
            const radius = 230; // This should match the initial radius in the HTML
            location.style.transition = 'transform 1s ease-in-out';
            location.style.transform = `rotate(${newAngle}deg) translate(${radius}px) rotate(-${newAngle}deg)`;
        });
    });
});
