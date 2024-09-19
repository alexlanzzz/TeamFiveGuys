const menuIcon = document.getElementById("menuIcon");
const sideMenu = document.getElementById("sideMenu");

menuIcon.addEventListener("click", function () {
    if (sideMenu.classList.contains("open")) {
        sideMenu.classList.remove("open");
    } else {
        sideMenu.classList.add("open");
    }
});
