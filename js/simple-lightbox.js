/**
 * Dynamic lessons gallery and lightbox.
 */

const FALLBACK_LESSONS = Array.from({ length: 9 }, (_, index) => ({
  image: `./images/lessons/lesson${index + 1}.jpg`,
  title: `Пример занятия ${index + 1}`,
  alt: `Пример учебного материала по биологии ${index + 1}`
}));

let lessonData = [];
let lessonImages = [];
let currentImageIndex = 0;

let lightbox;
let lightboxImage;
let closeBtn;
let prevBtn;
let nextBtn;

document.addEventListener('DOMContentLoaded', initializeLessonsGallery);

async function initializeLessonsGallery() {
  lightbox = document.getElementById('lightbox');
  lightboxImage = document.getElementById('lightbox-image');
  closeBtn = document.querySelector('.lightbox-close');
  prevBtn = document.querySelector('.lightbox-nav.prev');
  nextBtn = document.querySelector('.lightbox-nav.next');

  lessonData = await loadLessonsFromJSON();
  lessonImages = lessonData.map(lesson => lesson.image).filter(Boolean);
  renderLessonCards();
  bindLightboxControls();
}

async function loadLessonsFromJSON() {
  try {
    const response = await fetch('./lessons.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();
    const lessons = Array.isArray(data.lessons) ? data.lessons : [];
    return lessons.length > 0 ? lessons : FALLBACK_LESSONS;
  } catch (error) {
    console.error('Error loading lessons data:', error);
    return FALLBACK_LESSONS;
  }
}

function bindLightboxControls() {
  lightbox?.addEventListener('click', closeLightbox);

  closeBtn?.addEventListener('click', event => {
    event.stopPropagation();
    closeLightbox();
  });

  prevBtn?.addEventListener('click', event => {
    event.stopPropagation();
    navigateImage(-1);
  });

  nextBtn?.addEventListener('click', event => {
    event.stopPropagation();
    navigateImage(1);
  });

  document.querySelector('.lightbox-content')?.addEventListener('click', event => {
    event.stopPropagation();
  });

  document.addEventListener('keydown', event => {
    if (!lightbox?.classList.contains('active')) return;

    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateImage(-1);
        break;
      case 'ArrowRight':
        navigateImage(1);
        break;
      default:
        break;
    }
  });
}

function renderLessonCards() {
  const lessonsGrid = document.getElementById('lessons-grid');
  if (!lessonsGrid) return;

  lessonsGrid.innerHTML = '';

  lessonData.forEach((lesson, index) => {
    const lessonCard = document.createElement('div');
    const lessonImage = document.createElement('img');

    lessonCard.className = 'lesson-card';
    lessonCard.dataset.index = String(index);
    lessonCard.tabIndex = 0;
    lessonCard.role = 'button';
    lessonCard.setAttribute('aria-label', `Открыть материал: ${lesson.title || lesson.alt || 'урок биологии'}`);

    lessonImage.src = lesson.image;
    lessonImage.alt = lesson.alt || lesson.title || 'Урок биологии';
    lessonImage.className = 'lesson-thumbnail';
    lessonImage.loading = 'lazy';
    lessonImage.decoding = 'async';

    lessonCard.appendChild(lessonImage);

    lessonCard.addEventListener('click', () => openLightbox(index));
    lessonCard.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      openLightbox(index);
    });

    lessonsGrid.appendChild(lessonCard);
  });
}

function openLightbox(index) {
  if (!lightbox || !lightboxImage || !lessonImages[index]) return;

  currentImageIndex = index;
  lightboxImage.src = lessonImages[index];
  lightboxImage.alt = lessonData[index]?.alt || lessonData[index]?.title || 'Урок биологии';
  lightbox.classList.add('active');
  document.body.classList.add('lightbox-open');
  document.body.style.overflow = 'hidden';
  document.dispatchEvent(new CustomEvent('lightbox:toggle'));
  closeBtn?.focus();
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove('active');
  document.body.classList.remove('lightbox-open');
  document.body.style.overflow = '';
  document.dispatchEvent(new CustomEvent('lightbox:toggle'));
}

function navigateImage(direction) {
  if (!lightboxImage || lessonImages.length === 0) return;

  currentImageIndex = (currentImageIndex + direction + lessonImages.length) % lessonImages.length;
  lightboxImage.src = lessonImages[currentImageIndex];
  lightboxImage.alt = lessonData[currentImageIndex]?.alt || lessonData[currentImageIndex]?.title || 'Урок биологии';
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateImage = navigateImage;
window.changeLightboxImage = (direction, event) => {
  event?.stopPropagation();
  navigateImage(direction);
};
