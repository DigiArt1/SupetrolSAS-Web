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

// Product card touch interaction
document.querySelectorAll('.producto-card').forEach(card => {
    card.addEventListener('click', function() {
        // Check if we're on a touch device
        if (window.matchMedia('(hover: none)').matches) {
            // Toggle the active class
            this.classList.toggle('active');
            
            // Close other cards
            document.querySelectorAll('.producto-card').forEach(otherCard => {
                if (otherCard !== this) {
                    otherCard.classList.remove('active');
                }
            });
        }
    });
});

// Close cards when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.producto-card')) {
        document.querySelectorAll('.producto-card').forEach(card => {
            card.classList.remove('active');
        });
    }
});

