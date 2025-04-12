export async function initializeCarousel(){
    try {
      const res = await fetch('./testimonials.json');
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const { testimonials } = await res.json();
      const track = document.querySelector('.testimonials-track'),
            dotsContainer = document.querySelector('.carousel-dots'),
            prevButton = document.querySelector('.carousel-button.prev'),
            nextButton = document.querySelector('.carousel-button.next');
      let currentIndex = 0;
  
      testimonials.forEach((t, i) => {
        const slide = document.createElement('div');
        slide.className = 'testimonial-card';
        slide.innerHTML = `
          <div class="testimonial-content">
            <div class="testimonial-text-container">
              <p class="testimonial-text">${t.review || ''}</p>
            </div>
            <div class="testimonial-footer">
              <p class="author-name">${t.author || ''}</p>
              <p class="testimonial-date">${t.date || ''}</p>
            </div>
          </div>`;
        track.appendChild(slide);
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });

      // Calculate visible slides and initialize swipe functionality
      const slides = document.querySelectorAll('.testimonial-card');
      
      // Main function to navigate to a slide
      const goToSlide = index => {
        // Apply smooth animation class
        track.classList.add('sliding');
        
        // Update current index with wrap-around
        currentIndex = (index + slides.length) % slides.length;
        
        // Move track to show the current slide
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        document.querySelectorAll('.dot').forEach((dot, i) =>
          dot.classList.toggle('active', i === currentIndex)
        );
      };

      // Navigation buttons
      prevButton.addEventListener('click', e => { 
        e.preventDefault(); 
        goToSlide(currentIndex - 1); 
      });
      
      nextButton.addEventListener('click', e => { 
        e.preventDefault(); 
        goToSlide(currentIndex + 1); 
      });

      // Auto-advance carousel every 5 seconds
      let autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
      
      // Pause auto-advance when user interacts with carousel
      const carouselElement = document.querySelector('.carousel');
      carouselElement.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
      carouselElement.addEventListener('mouseleave', () => {
        // Resume auto-advance when user's mouse leaves the carousel
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
      });
      
      // Initialize with first slide
      goToSlide(0);
      
    } catch (err) {
      console.error('Error loading testimonials:', err);
      document.querySelector('.testimonials-track').innerHTML =
        '<div class="testimonial-card"><p>Error loading testimonials.</p></div>';
    }
  }
  
  document.addEventListener('DOMContentLoaded', initializeCarousel);