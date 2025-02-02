const lessonImages = ['./images/lessons/lesson1.jpg','./images/lessons/lesson2.jpg'];
let currentImageIndex = 0;

window.openLightbox = index => {
  currentImageIndex = index;
  const lb = document.getElementById('lightbox'),
        lbImg = document.getElementById('lightbox-image');
  lbImg.onerror = () => {
    console.error('Failed to load', lessonImages[index]);
    lbImg.src = '';
    lbImg.alt = 'Image failed to load';
  };
  lbImg.src = lessonImages[index];
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = () => {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
};

window.changeLightboxImage = (dir, e) => {
  e.stopPropagation();
  currentImageIndex = (currentImageIndex + dir + lessonImages.length) % lessonImages.length;
  document.getElementById('lightbox-image').src = lessonImages[currentImageIndex];
};