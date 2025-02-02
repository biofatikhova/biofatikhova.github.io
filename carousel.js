export async function initializeCarousel() {
    try {
        // Update the path to be relative to your repository
        const response = await fetch('./testimonials.json');  // or use the full path from your repo root
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const testimonials = data.testimonials;
        
        // Get DOM elements
        const track = document.querySelector('.testimonials-track');
        const dotsContainer = document.querySelector('.carousel-dots');
        const prevButton = document.querySelector('.prev');
        const nextButton = document.querySelector('.next');
        
        let currentIndex = 0;
        
        // Create testimonial cards
        testimonials.forEach(testimonial => {
            const card = document.createElement('div');
            card.classList.add('testimonial-card');
            card.innerHTML = `
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="testimonial-author">
                    <img src="${testimonial.author.image}" alt="${testimonial.author.name}" class="testimonial-avatar">
                    <div class="author-info">
                        <h4>${testimonial.author.name}</h4>
                        <p>${testimonial.author.position}</p>
                    </div>
                </div>
            `;
            track.appendChild(card);
        });
        
        const slides = document.querySelectorAll('.testimonial-card');
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        function updateDots() {
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }
        
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(currentIndex);
        });
        
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            goToSlide(currentIndex);
        });
        
        // Optional: Auto-play
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            goToSlide(currentIndex);
        }, 5000);
    } catch (error) {
        console.error('Error loading testimonials:', error);
        const track = document.querySelector('.testimonials-track');
        track.innerHTML = '<div class="testimonial-card"><p>Error loading testimonials. Please try again later.</p></div>';
    }
} 