const lessonImages = [
    './images/lessons/lesson1.jpg',
    './images/lessons/lesson2.jpg',
    // Add more image paths as needed
];

let currentImageIndex = 0;

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    lightboxImage.src = lessonImages[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function changeLightboxImage(direction, event) {
    event.stopPropagation();
    
    currentImageIndex = (currentImageIndex + direction + lessonImages.length) % lessonImages.length;
    const lightboxImage = document.getElementById('lightbox-image');
    lightboxImage.src = lessonImages[currentImageIndex];
} 