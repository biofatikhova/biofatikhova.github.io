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
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        
        let currentIndex = 0;
        
        // Create testimonial cards
        testimonials.forEach(testimonial => {
            const card = document.createElement('div');
            card.classList.add('testimonial-card');
            card.innerHTML = `
                <div class="testimonial-content">
                    <p class="testimonial-subject">${testimonial.subject}</p>
                    <p class="testimonial-text">${testimonial.review || ''}</p>
                    ${testimonial.response ? `<p class="testimonial-response">${testimonial.response}</p>` : ''}
                    <div class="testimonial-footer">
                        <div class="testimonial-author-info">
                            <p class="author-name">${testimonial.author}</p>
                            <p class="testimonial-date">${testimonial.date}</p>
                        </div>
                        <div class="testimonial-score">${testimonial.score}</div>
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
            const offset = -index * 100;
            track.style.transform = `translateX(${offset}%)`;
            updateDots();
            
            // Ensure we can't scroll past the last slide
            if (currentIndex >= slides.length) {
                currentIndex = 0;
                goToSlide(currentIndex);
            }
        }
        
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                goToSlide(currentIndex);
            });
            
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % slides.length;
                goToSlide(currentIndex);
            });
        }
        
        // Update the auto-play interval to check for valid slides
        setInterval(() => {
            if (slides.length > 0) {  // Only auto-play if we have slides
                currentIndex = (currentIndex + 1) % slides.length;
                goToSlide(currentIndex);
            }
        }, 5000);
    } catch (error) {
        console.error('Error loading testimonials:', error);
        const track = document.querySelector('.testimonials-track');
        track.innerHTML = '<div class="testimonial-card"><p>Error loading testimonials. Please try again later.</p></div>';
    }
} 