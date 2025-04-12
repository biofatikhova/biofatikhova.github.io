/**
 * Main JavaScript file
 */

// DOM Elements
const header = document.querySelector('.header');
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

// Mobile Menu Toggle
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navMenu && navMenu.classList.contains('active') && 
      !navMenu.contains(e.target) && 
      !mobileToggle.contains(e.target)) {
    navMenu.classList.remove('active');
    mobileToggle.classList.remove('active');
  }
});

// Header scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    // Close mobile menu if open
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
    }

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerOffset = document.querySelector('.header').offsetHeight;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Update active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  const headerHeight = document.querySelector('.header').offsetHeight;
  
  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - headerHeight - 100;
    const sectionId = current.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
    } else {
      document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
    }
  });
});

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Import and initialize other modules
  import('./carousel.js').then(module => {
    module.initializeCarousel();
  }).catch(err => console.error('Error loading carousel module:', err));
  
  // Lightbox is initialized directly in its own script
  console.log('Main script loaded');
}); 