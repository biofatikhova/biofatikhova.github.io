/**
 * Simple Lightbox Implementation
 * This is a simplified version without using ES modules
 */

// Image data
const lessonImages = [
  './images/lessons/lesson1.jpg',
  './images/lessons/lesson2.jpg'
];

// Track current image
let currentImageIndex = 0;

// DOM References
let lightbox, lightboxImage, closeBtn, prevBtn, nextBtn;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Simple lightbox script loaded');
  
  // Get DOM elements
  lightbox = document.getElementById('lightbox');
  lightboxImage = document.getElementById('lightbox-image');
  closeBtn = document.querySelector('.lightbox-close');
  prevBtn = document.querySelector('.lightbox-nav.prev');
  nextBtn = document.querySelector('.lightbox-nav.next');
  
  // Initialize lesson card click handlers
  const lessonCards = document.querySelectorAll('.lesson-card');
  lessonCards.forEach((card, index) => {
    card.addEventListener('click', function() {
      openLightbox(index);
    });
  });
  
  // Lightbox background click to close
  if (lightbox) {
    lightbox.addEventListener('click', function() {
      closeLightbox();
    });
  }
  
  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeLightbox();
    });
  }
  
  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navigateImage(-1);
    });
  }
  
  // Next button
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navigateImage(1);
    });
  }
  
  // Prevent clicks on lightbox content from closing it
  const lightboxContent = document.querySelector('.lightbox-content');
  if (lightboxContent) {
    lightboxContent.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox || !lightbox.classList.contains('active')) {
      return;
    }
    
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateImage(-1);
        break;
      case 'ArrowRight':
        navigateImage(1);
        break;
    }
  });
  
  console.log('Simple lightbox initialized with elements:', {
    lightbox: !!lightbox,
    lightboxImage: !!lightboxImage,
    closeBtn: !!closeBtn,
    prevBtn: !!prevBtn,
    nextBtn: !!nextBtn
  });
});

// Open lightbox with specified image index
function openLightbox(index) {
  console.log('Opening lightbox with image index:', index);
  
  if (!lightbox || !lightboxImage) {
    console.error('Lightbox elements not found');
    return;
  }
  
  currentImageIndex = index;
  
  lightboxImage.src = lessonImages[index];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
  console.log('Closing lightbox');
  
  if (!lightbox) {
    return;
  }
  
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Navigate to next/previous image
function navigateImage(direction) {
  console.log('Navigating image with direction:', direction);
  
  if (!lightboxImage) {
    return;
  }
  
  currentImageIndex = (currentImageIndex + direction + lessonImages.length) % lessonImages.length;
  lightboxImage.src = lessonImages[currentImageIndex];
}

// Global exports for inline handlers (just in case)
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateImage = navigateImage; 