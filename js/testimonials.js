/**
 * Testimonials loader - single column list with show more toggle and per-card read more
 */

export async function initializeTestimonials() {
  try {
    const res = await fetch('./testimonials.json');
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const { testimonials } = await res.json();
    const grid = document.getElementById('testimonials-grid');
    const toggleBtn = document.getElementById('testimonials-toggle-btn');
    
    if (!grid) {
      console.error('Testimonials grid not found');
      return;
    }

    // Start with collapsed state (show only first 3)
    grid.classList.add('reviews-list--collapsed');

    testimonials.forEach((testimonial, index) => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      
      // Check if review is long (more than ~300 characters)
      const isLongReview = testimonial.review && testimonial.review.length > 300;
      const reviewId = `review-${Math.random().toString(36).substr(2, 9)}`;
      
      card.innerHTML = `
        <div class="testimonial-content">
          <div class="testimonial-text-container">
            <p class="testimonial-text ${isLongReview ? 'collapsed' : ''}" id="${reviewId}">
              ${testimonial.review || ''}
            </p>
            ${isLongReview ? `<span class="read-more-btn" data-target="${reviewId}">Читать полностью</span>` : ''}
          </div>
          <div class="testimonial-footer">
            <p class="author-name">${testimonial.author || ''}</p>
            <p class="testimonial-date">${testimonial.date || ''}</p>
          </div>
        </div>
      `;
      
      grid.appendChild(card);
    });

    // Show toggle button if there are more than 3 testimonials
    if (testimonials.length > 3 && toggleBtn) {
      toggleBtn.style.display = 'block';
    }

    // Add click handler for "Show more/Hide" toggle button
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        const isCollapsed = grid.classList.contains('reviews-list--collapsed');
        
        if (isCollapsed) {
          grid.classList.remove('reviews-list--collapsed');
          this.textContent = 'Скрыть отзывы';
        } else {
          grid.classList.add('reviews-list--collapsed');
          this.textContent = 'Показать ещё отзывы';
        }
      });
    }

    // Add click handlers for per-card "Read more" buttons
    document.querySelectorAll('.read-more-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        const targetId = this.getAttribute('data-target');
        const textElement = document.getElementById(targetId);
        
        if (textElement) {
          const isCollapsed = textElement.classList.contains('collapsed');
          
          if (isCollapsed) {
            textElement.classList.remove('collapsed');
            this.textContent = 'Свернуть';
          } else {
            textElement.classList.add('collapsed');
            this.textContent = 'Читать полностью';
          }
        }
      });
    });

  } catch (err) {
    console.error('Error loading testimonials:', err);
    const grid = document.getElementById('testimonials-grid');
    if (grid) {
      grid.innerHTML = '<div class="testimonial-card"><p>Ошибка загрузки отзывов.</p></div>';
    }
  }
}

