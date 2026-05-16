/**
 * Main JavaScript file
 */

// DOM Elements
const header = document.querySelector('.header');
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
const sections = document.querySelectorAll('section[id]');

function setMobileMenuOpen(isOpen) {
  if (!navMenu || !mobileToggle) return;

  navMenu.classList.toggle('active', isOpen);
  mobileToggle.classList.toggle('active', isOpen);
  mobileToggle.setAttribute('aria-expanded', String(isOpen));
  mobileToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
}

function getHeaderHeight() {
  return header?.offsetHeight || 0;
}

function updateHeaderState() {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }

  const scrollY = window.pageYOffset;
  const headerHeight = getHeaderHeight();
  let activeSectionId = null;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight - 100;
    if (scrollY >= sectionTop) {
      activeSectionId = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeSectionId}`);
  });
}

// Mobile Menu Toggle
mobileToggle?.addEventListener('click', () => {
  setMobileMenuOpen(!navMenu?.classList.contains('active'));
});

// Close mobile menu when clicking outside or pressing Escape
document.addEventListener('click', (e) => {
  if (!navMenu?.classList.contains('active')) return;

  if (!navMenu.contains(e.target) && !mobileToggle?.contains(e.target)) {
    setMobileMenuOpen(false);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
    setMobileMenuOpen(false);
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId.length <= 1) return;

    const targetElement = document.getElementById(targetId.slice(1));
    if (!targetElement) return;

    e.preventDefault();
    setMobileMenuOpen(false);

    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - getHeaderHeight();

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});

// Update header and active nav link on scroll without doing layout work for every event.
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;

  window.requestAnimationFrame(() => {
    updateHeaderState();
    scrollTicking = false;
  });
  scrollTicking = true;
}, { passive: true });

// Initialize components when DOM is loaded
function initializePage() {
  updateHeaderState();

  // Import and initialize testimonials
  import('./testimonials.js').then(module => {
    module.initializeTestimonials();
  }).catch(err => console.error('Error loading testimonials module:', err));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}
