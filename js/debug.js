/**
 * Debug script to check lightbox functionality
 */
console.log('Debug script loaded');

// Check if lightbox functions exist in global scope
console.log('Lightbox functions available:', {
  openLightbox: typeof openLightbox === 'function',
  closeLightbox: typeof closeLightbox === 'function',
  changeLightboxImage: typeof changeLightboxImage === 'function'
});

// Check if DOM elements for lightbox exist
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const closeButton = document.querySelector('.lightbox-close');
  const prevButton = document.querySelector('.lightbox-nav.prev');
  const nextButton = document.querySelector('.lightbox-nav.next');
  const lightboxImage = document.getElementById('lightbox-image');
  
  console.log('Lightbox elements found:', {
    lightbox: !!lightbox,
    closeButton: !!closeButton,
    prevButton: !!prevButton,
    nextButton: !!nextButton,
    lightboxImage: !!lightboxImage
  });
  
  // Manually add event listeners as a backup
  if (closeButton) {
    console.log('Adding manual event listener to close button');
    closeButton.addEventListener('click', function(e) {
      console.log('Close button clicked');
      e.stopPropagation();
      if (typeof closeLightbox === 'function') {
        closeLightbox();
      } else {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
          lightbox.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  }
  
  if (prevButton) {
    console.log('Adding manual event listener to prev button');
    prevButton.addEventListener('click', function(e) {
      console.log('Prev button clicked');
      e.stopPropagation();
      if (typeof changeLightboxImage === 'function') {
        changeLightboxImage(-1, e);
      }
    });
  }
  
  if (nextButton) {
    console.log('Adding manual event listener to next button');
    nextButton.addEventListener('click', function(e) {
      console.log('Next button clicked');
      e.stopPropagation();
      if (typeof changeLightboxImage === 'function') {
        changeLightboxImage(1, e);
      }
    });
  }
}); 