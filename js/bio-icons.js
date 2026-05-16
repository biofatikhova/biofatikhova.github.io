/**
 * Biology Background Icons - Auto-positioning system
 */

const bioIcons = [
  '🍃', '🌿', '🦋', '🌱', '🐛', '🍀', '🦗', '🌾',
  '🪲', '🌺', '🦎', '🌼', '🦠', '🌳', '🪱', '🌷',
  '🦟', '🌵', '🪸', '🌿'
];

const ANIMATION_CONFIG = {
  duration: 20,
  delayRange: 8
};

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let iconsContainer;
let resizeTimer;

function getPageHeight() {
  return Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    window.innerHeight
  );
}

function updateContainerHeight() {
  if (!iconsContainer) return;
  iconsContainer.style.minHeight = `${getPageHeight()}px`;
}

function generateIconPositions(count) {
  const positions = [];
  const gridCols = Math.ceil(Math.sqrt(count * 1.2));
  const gridRows = Math.ceil(count / gridCols);

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / gridCols);
    const col = i % gridCols;
    const topPercent = (row / (gridRows - 1 || 1)) * 94 + 3;
    const leftPercent = (col / (gridCols - 1 || 1)) * 84 + 8;
    const topVariation = (Math.random() - 0.5) * 8;
    const leftVariation = (Math.random() - 0.5) * 12;

    positions.push({
      top: Math.max(2, Math.min(98, topPercent + topVariation)),
      left: Math.max(4, Math.min(92, leftPercent + leftVariation)),
      delay: Math.random() * ANIMATION_CONFIG.delayRange,
      duration: ANIMATION_CONFIG.duration + (Math.random() * 5 - 2.5)
    });
  }

  return positions;
}

function renderIcons() {
  if (!iconsContainer) return;

  iconsContainer.innerHTML = '';
  updateContainerHeight();

  if (reducedMotionQuery.matches) return;

  const positions = generateIconPositions(bioIcons.length);
  const fragment = document.createDocumentFragment();

  bioIcons.forEach((emoji, index) => {
    const icon = document.createElement('span');
    const position = positions[index];

    icon.className = 'bio-icon';
    icon.textContent = emoji;
    icon.setAttribute('aria-hidden', 'true');
    icon.style.top = `${position.top}%`;
    icon.style.left = `${position.left}%`;
    icon.style.animationDelay = `${position.delay}s`;
    icon.style.animationDuration = `${position.duration}s`;

    fragment.appendChild(icon);
  });

  iconsContainer.appendChild(fragment);
}

export function initializeBioIcons() {
  iconsContainer = document.querySelector('.bio-background-icons');
  if (!iconsContainer) return;

  renderIcons();
  window.addEventListener('load', updateContainerHeight, { once: true });
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateContainerHeight, 150);
  }, { passive: true });
  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', renderIcons);
  } else {
    reducedMotionQuery.addListener(renderIcons);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBioIcons);
} else {
  initializeBioIcons();
}
