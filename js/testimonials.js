/**
 * Testimonials loader - single column list with show more toggle and per-card read more
 */

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text || '';
  return element;
}

export async function initializeTestimonials() {
  try {
    const res = await fetch('./testimonials.json');
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    const testimonials = Array.isArray(data.testimonials) ? data.testimonials : [];
    const grid = document.getElementById('testimonials-grid');
    const toggleBtn = document.getElementById('testimonials-toggle-btn');
    
    if (!grid) {
      console.error('Testimonials grid not found');
      return;
    }

    // Start with collapsed state (show only first 3)
    grid.classList.add('reviews-list--collapsed');
    grid.innerHTML = '';

    testimonials.forEach((testimonial, index) => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      
      // Check if review is long (more than ~300 characters)
      const isLongReview = testimonial.review && testimonial.review.length > 300;
      const reviewId = `review-${index + 1}`;
      const content = document.createElement('div');
      const textContainer = document.createElement('div');
      const footer = document.createElement('div');
      const review = createTextElement('p', `testimonial-text${isLongReview ? ' collapsed' : ''}`, testimonial.review);
      const author = createTextElement('p', 'author-name', testimonial.author);
      const date = createTextElement('p', 'testimonial-date', testimonial.date);

      content.className = 'testimonial-content';
      textContainer.className = 'testimonial-text-container';
      footer.className = 'testimonial-footer';
      review.id = reviewId;

      textContainer.appendChild(review);

      if (isLongReview) {
        const readMoreButton = document.createElement('button');
        readMoreButton.className = 'read-more-btn';
        readMoreButton.type = 'button';
        readMoreButton.dataset.target = reviewId;
        readMoreButton.setAttribute('aria-controls', reviewId);
        readMoreButton.setAttribute('aria-expanded', 'false');
        readMoreButton.textContent = 'Читать полностью';
        textContainer.appendChild(readMoreButton);
      }

      footer.append(author, date);
      content.append(textContainer, footer);
      card.appendChild(content);
      
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
          this.setAttribute('aria-expanded', 'true');
        } else {
          grid.classList.add('reviews-list--collapsed');
          this.textContent = 'Показать ещё отзывы';
          this.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Add click handlers for per-card "Read more" buttons
    grid.querySelectorAll('.read-more-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        const targetId = this.getAttribute('data-target');
        const textElement = document.getElementById(targetId);
        
        if (textElement) {
          const isCollapsed = textElement.classList.contains('collapsed');
          
          if (isCollapsed) {
            textElement.classList.remove('collapsed');
            this.textContent = 'Свернуть';
            this.setAttribute('aria-expanded', 'true');
          } else {
            textElement.classList.add('collapsed');
            this.textContent = 'Читать полностью';
            this.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

  } catch (err) {
    console.error('Error loading testimonials:', err);
    const grid = document.getElementById('testimonials-grid');
    if (grid) {
      grid.innerHTML = '';
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.appendChild(createTextElement('p', '', 'Ошибка загрузки отзывов.'));
      grid.appendChild(card);
    }
  }
}
