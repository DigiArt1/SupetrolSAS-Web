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

// Testimonials carousel functionality
const testimoniosTrack = document.querySelector('.testimonios-track');
const testimonioCards = document.querySelectorAll('.testimonio-card');
const prevButton = document.querySelector('.testimonio-nav.prev');
const nextButton = document.querySelector('.testimonio-nav.next');
const progressDots = document.querySelectorAll('.progress-dot');

// Clone first and last slides for infinite effect
testimoniosTrack.insertAdjacentHTML('beforeend', testimonioCards[0].outerHTML);
testimoniosTrack.insertAdjacentHTML('beforeend', testimonioCards[1].outerHTML);
testimoniosTrack.insertAdjacentHTML('beforeend', testimonioCards[2].outerHTML);
testimoniosTrack.insertAdjacentHTML('afterbegin', testimonioCards[testimonioCards.length - 1].outerHTML);
testimoniosTrack.insertAdjacentHTML('afterbegin', testimonioCards[testimonioCards.length - 2].outerHTML);
testimoniosTrack.insertAdjacentHTML('afterbegin', testimonioCards[testimonioCards.length - 3].outerHTML);

let currentIndex = 3; // Start from first real slide (after clones)
let cardWidth;
let maxIndex;
let isAnimating = false;

function updateCarouselMetrics() {
    const containerWidth = testimoniosTrack.parentElement.offsetWidth;
    const margin = 20; // Margin from CSS
    let cardsPerView;
    
    if (window.innerWidth >= 1200) {
        cardsPerView = 3;
    } else if (window.innerWidth >= 768) {
        cardsPerView = 2;
    } else {
        cardsPerView = 1;
    }

    cardWidth = (containerWidth / cardsPerView) - (margin * 2);
    const allCards = document.querySelectorAll('.testimonio-card');
    allCards.forEach(card => {
        card.style.minWidth = `${cardWidth}px`;
        card.style.flex = `0 0 ${cardWidth}px`;
    });

    maxIndex = allCards.length - cardsPerView;
    updateCarouselPosition(false);
}

function updateCarouselPosition(animate = true) {
    if (!animate) {
        testimoniosTrack.style.transition = 'none';
    } else {
        testimoniosTrack.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    const margin = 20; // Margin from CSS
    const offset = currentIndex * (cardWidth + margin * 2);
    testimoniosTrack.style.transform = `translateX(-${offset}px)`;
    
    if (!animate) {
        testimoniosTrack.offsetHeight; // Force reflow
    }

    // Update active card states
    const allCards = document.querySelectorAll('.testimonio-card');
    allCards.forEach((card, index) => {
        const isActive = index >= currentIndex && index < currentIndex + 3;
        card.classList.toggle('active', isActive);
    });

    // Update progress dots
    const realIndex = (currentIndex - 3) % (maxIndex - 6);
    progressDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === realIndex);
    });
}

function moveCarousel(direction) {
    if (isAnimating) return;
    isAnimating = true;

    currentIndex += direction;
    updateCarouselPosition(true);

    // Handle infinite loop
    setTimeout(() => {
        if (currentIndex >= maxIndex - 3) {
            currentIndex = 3;
            updateCarouselPosition(false);
        } else if (currentIndex <= 2) {
            currentIndex = maxIndex - 4;
            updateCarouselPosition(false);
        }
        isAnimating = false;
    }, 800);
}

// Initialize carousel
updateCarouselMetrics();

// Update metrics on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateCarouselMetrics();
    }, 250);
});

// Add click handlers for navigation buttons
prevButton.addEventListener('click', () => moveCarousel(-1));
nextButton.addEventListener('click', () => moveCarousel(1));

// Add click handlers for progress dots
progressDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (isAnimating) return;
        currentIndex = index + 3; // Adjust for cloned slides
        updateCarouselPosition(true);
    });
});

// Touch support
let touchStartX = 0;
let touchEndX = 0;

testimoniosTrack.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
}, { passive: true });

testimoniosTrack.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
        moveCarousel(diff > 0 ? 1 : -1);
    }
    startAutoplay();
}, { passive: true });

// Improved auto-play functionality
let autoplayInterval;
let autoplayTimeout;

function startAutoplay() {
    stopAutoplay(); // Clear any existing interval
    autoplayInterval = setInterval(() => {
        moveCarousel(1);
    }, 3000); // Move every 3 seconds
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
    clearTimeout(autoplayTimeout);
}

// Start autoplay and handle user interactions
startAutoplay();

// Pause on user interaction
[testimoniosTrack, ...progressDots, prevButton, nextButton].forEach(element => {
    element.addEventListener('mouseenter', stopAutoplay);
    element.addEventListener('mouseleave', () => {
        autoplayTimeout = setTimeout(startAutoplay, 1000);
    });
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
});

