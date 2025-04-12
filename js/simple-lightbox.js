/**
 * Dynamic Lightbox Implementation
 * Loads lesson data from JSON and creates lightbox functionality
 */

// Will store lesson data loaded from JSON
let lessonData = [];
let lessonImages = [];
let currentImageIndex = 0;

// DOM References
let lightbox, lightboxImage, closeBtn, prevBtn, nextBtn;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  console.log('Dynamic lightbox script loading...');
  
  // Load lessons from JSON file
  try {
    await loadLessonsFromJSON();
  } catch (error) {
    console.error('Error loading lessons:', error);
  }
  
  // Get DOM elements
  lightbox = document.getElementById('lightbox');
  lightboxImage = document.getElementById('lightbox-image');
  closeBtn = document.querySelector('.lightbox-close');
  prevBtn = document.querySelector('.lightbox-nav.prev');
  nextBtn = document.querySelector('.lightbox-nav.next');
  
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
  
  console.log('Dynamic lightbox initialized with elements:', {
    lightbox: !!lightbox,
    lightboxImage: !!lightboxImage,
    closeBtn: !!closeBtn,
    prevBtn: !!prevBtn,
    nextBtn: !!nextBtn,
    lessonsLoaded: lessonData.length
  });
});

/**
 * Load lessons data from JSON and render lesson cards
 */
async function loadLessonsFromJSON() {
  try {
    const response = await fetch('./lessons.json');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    lessonData = data.lessons || [];
    
    // Extract image paths for the lightbox
    lessonImages = lessonData.map(lesson => lesson.image);
    
    // Render lesson cards
    renderLessonCards();
    
    console.log(`Loaded ${lessonData.length} lessons from JSON`);
  } catch (error) {
    console.error('Error loading lessons data:', error);
    // Fallback to default images if JSON fails to load
    lessonImages = ['./images/lessons/lesson1.jpg', './images/lessons/lesson2.jpg'];
  }
}

/**
 * Render lesson cards in the lessons grid
 */
function renderLessonCards() {
  const lessonsGrid = document.getElementById('lessons-grid');
  if (!lessonsGrid || lessonData.length === 0) {
    return;
  }
  
  // Clear existing content
  lessonsGrid.innerHTML = '';
  
  // Add lesson cards
  lessonData.forEach((lesson, index) => {
    const lessonCard = document.createElement('div');
    lessonCard.className = 'lesson-card';
    lessonCard.dataset.index = index;
    
    lessonCard.innerHTML = `
      <img src="${lesson.image}" alt="${lesson.alt}" class="lesson-thumbnail">
      <div class="lesson-overlay">
        <span>${lesson.title}</span>
      </div>
    `;
    
    // Add click event listener
    lessonCard.addEventListener('click', () => {
      openLightbox(index);
    });
    
    lessonsGrid.appendChild(lessonCard);
  });
}

/**
 * Open lightbox with specified image index
 */
function openLightbox(index) {
  console.log('Opening lightbox with image index:', index);
  
  if (!lightbox || !lightboxImage || lessonImages.length === 0) {
    console.error('Lightbox elements not found or no lesson images available');
    return;
  }
  
  currentImageIndex = index;
  
  lightboxImage.src = lessonImages[index];
  
  if (lessonData[index] && lessonData[index].alt) {
    lightboxImage.alt = lessonData[index].alt;
  }
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Close lightbox
 */
function closeLightbox() {
  console.log('Closing lightbox');
  
  if (!lightbox) {
    return;
  }
  
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * Navigate to next/previous image
 */
function navigateImage(direction) {
  console.log('Navigating image with direction:', direction);
  
  if (!lightboxImage || lessonImages.length === 0) {
    return;
  }
  
  currentImageIndex = (currentImageIndex + direction + lessonImages.length) % lessonImages.length;
  lightboxImage.src = lessonImages[currentImageIndex];
  
  if (lessonData[currentImageIndex] && lessonData[currentImageIndex].alt) {
    lightboxImage.alt = lessonData[currentImageIndex].alt;
  }
}

// Global exports for compatibility
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateImage = navigateImage; 