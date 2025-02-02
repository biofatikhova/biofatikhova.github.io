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
            <p class="testimonial-subject">${t.subject}</p>
            <div class="testimonial-text-container">
              <p class="testimonial-text">${t.review || ''}</p>
              ${t.response ? `<p class="testimonial-response">${t.response}</p>` : ''}
            </div>
            <div class="testimonial-footer">
              <div class="testimonial-author-info">
                <p class="author-name">${t.author}</p>
                <p class="testimonial-date">${t.date}</p>
              </div>
              <div class="testimonial-score">${t.score}</div>
            </div>
          </div>`;
        track.appendChild(slide);
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
      const slides = document.querySelectorAll('.testimonial-card');
      const goToSlide = index => {
        currentIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        document.querySelectorAll('.dot').forEach((dot, i) =>
          dot.classList.toggle('active', i === currentIndex)
        );
      };
      prevButton.addEventListener('click', e => { e.preventDefault(); goToSlide(currentIndex - 1); });
      nextButton.addEventListener('click', e => { e.preventDefault(); goToSlide(currentIndex + 1); });
      setInterval(() => goToSlide(currentIndex + 1), 5000);
    } catch (err) {
      console.error('Error loading testimonials:', err);
      document.querySelector('.testimonials-track').innerHTML =
        '<div class="testimonial-card"><p>Error loading testimonials.</p></div>';
    }
  }
  
  document.addEventListener('DOMContentLoaded', initializeCarousel);