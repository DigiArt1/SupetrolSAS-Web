const hamburgerIcon = document.querySelector('.hamburger-icon');
const menuNavegacion = document.querySelector('.menu-navegacion');
const closeIcon = document.querySelector('.close-icon');

hamburgerIcon.addEventListener('click', () => {
    menuNavegacion.classList.toggle('active'); // Changed to toggle
});

closeIcon.addEventListener('click', () => {
    menuNavegacion.classList.remove('active');
});

 // Close the menu when a link is clicked (optional)
document.querySelectorAll('.menu-navegacion a').forEach(link => {
    link.addEventListener('click', () => {
        menuNavegacion.classList.remove('active');
    });
});

