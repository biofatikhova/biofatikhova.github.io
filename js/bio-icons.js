/**
 * Biology Background Icons - Auto-positioning system
 */

// List of biology-related emojis - easy to add/remove
const bioIcons = [
  '🍃', '🌿', '🦋', '🌱', '🐛', '🍀', '🦗', '🌾',
  '🪲', '🌺', '🦎', '🌼', '🦠', '🌳', '🪱', '🌷',
  '🦟', '🌵', '🪸', '🌿'
];

// Common animation parameters
const ANIMATION_CONFIG = {
  duration: 20, // Base duration in seconds
  delayRange: 8, // Max delay in seconds
  movementRange: 30, // Max movement in pixels
};

/**
 * Generate random but distributed positions for icons
 * Ensures even coverage from top to bottom of the page
 * Uses viewport height to position icons relative to actual page content
 */
function generateIconPositions(count) {
  const positions = [];
  
  // Calculate grid dimensions for even distribution
  const gridCols = Math.ceil(Math.sqrt(count * 1.2)); // Slightly more cols for better spread
  const gridRows = Math.ceil(count / gridCols);
  
  // Get actual page height to distribute icons properly
  const pageHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    window.innerHeight * 5 // Fallback to 5 viewport heights
  );
  
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / gridCols);
    const col = i % gridCols;
    
    // Distribute evenly from 3% to 97% of page height to ensure bottom coverage
    const topPercent = (row / (gridRows - 1 || 1)) * 94 + 3; // 3% to 97%
    const leftPercent = (col / (gridCols - 1 || 1)) * 90 + 5; // 5% to 95%
    
    // Add some randomness for natural, organic look
    const topVariation = (Math.random() - 0.5) * 8;
    const leftVariation = (Math.random() - 0.5) * 12;
    
    positions.push({
      top: Math.max(2, Math.min(98, topPercent + topVariation)),
      left: Math.max(2, Math.min(98, leftPercent + leftVariation)),
      delay: (Math.random() * ANIMATION_CONFIG.delayRange),
      duration: ANIMATION_CONFIG.duration + (Math.random() * 5 - 2.5), // ±2.5s variation
    });
  }
  
  return positions;
}

/**
 * Initialize biology background icons
 */
export function initializeBioIcons() {
  const container = document.querySelector('.bio-background-icons');
  if (!container) {
    console.error('Bio icons container not found');
    return;
  }
  
  const initIcons = () => {
    // Clear any existing icons
    container.innerHTML = '';
    
    // Update container height based on actual page content
    const pageHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight * 5 // Fallback
    );
    container.style.minHeight = `${pageHeight}px`;
    
    // Generate positions for all icons
    const positions = generateIconPositions(bioIcons.length);
    
    // Create and position each icon
    bioIcons.forEach((emoji, index) => {
      const icon = document.createElement('span');
      icon.className = 'bio-icon';
      icon.textContent = emoji;
      
      const pos = positions[index];
      
      // Apply position and animation
      icon.style.top = `${pos.top}%`;
      icon.style.left = `${pos.left}%`;
      icon.style.animationDelay = `${pos.delay}s`;
      icon.style.animationDuration = `${pos.duration}s`;
      
      container.appendChild(icon);
    });
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initIcons();
      // Re-initialize after content loads to ensure proper height
      setTimeout(initIcons, 300);
    });
  } else {
    initIcons();
    // Re-initialize after a short delay to ensure all content is loaded
    setTimeout(initIcons, 300);
  }
}

// Initialize
initializeBioIcons();

