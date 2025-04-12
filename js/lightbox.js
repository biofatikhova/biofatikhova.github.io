/**
 * Lightbox Module for Lessons Gallery
 */

// Lesson images array
const lessonImages = ['./images/lessons/lesson1.jpg','./images/lessons/lesson2.jpg'];
let currentImageIndex = 0;

// Make functions accessible in the global scope
function openLightbox(index) {
  currentImageIndex = index;
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  
  if (!lightbox || !lightboxImage) {
    console.error('Lightbox elements not found');
    return;
  }
  
  lightboxImage.onerror = () => {
    console.error('Failed to load', lessonImages[index]);
    lightboxImage.src = '';
    lightboxImage.alt = 'Image failed to load';
  };
  
  lightboxImage.src = lessonImages[index];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function changeLightboxImage(dir, e) {
  if (e) e.stopPropagation();
  
  const lightboxImage = document.getElementById('lightbox-image');
  if (!lightboxImage) return;
  
  currentImageIndex = (currentImageIndex + dir + lessonImages.length) % lessonImages.length;
  lightboxImage.src = lessonImages[currentImageIndex];
}

// Initialize event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const closeButton = document.querySelector('.lightbox-close');
  const prevButton = document.querySelector('.lightbox-nav.prev');
  const nextButton = document.querySelector('.lightbox-nav.next');
  
  if (lightbox) {
    // Close lightbox when clicking on the background
    lightbox.addEventListener('click', closeLightbox);
  }
  
  if (closeButton) {
    // Close button
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }
  
  if (prevButton) {
    // Previous image button
    prevButton.addEventListener('click', (e) => {
      e.stopPropagation();
      changeLightboxImage(-1, e);
    });
  }
  
  if (nextButton) {
    // Next image button
    nextButton.addEventListener('click', (e) => {
      e.stopPropagation();
      changeLightboxImage(1, e);
    });
  }
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    switch (e.key) {
      case 'Escape': 
        closeLightbox(); 
        break;
      case 'ArrowLeft': 
        changeLightboxImage(-1, e); 
        break;
      case 'ArrowRight': 
        changeLightboxImage(1, e); 
        break;
    }
  });
  
  console.log('Lightbox initialized with controls:', {
    lightbox: !!lightbox,
    closeButton: !!closeButton,
    prevButton: !!prevButton,
    nextButton: !!nextButton
  });
});

// Make functions globally accessible for inline HTML event handlers
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.changeLightboxImage = changeLightboxImage;