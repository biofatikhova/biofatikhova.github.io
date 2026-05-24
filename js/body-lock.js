/**
 * Ref-counted body scroll lock. Shared by mobile nav + lightbox.
 * Loaded before any consumer; consumers call window.bodyLock.acquire()/release().
 */
(function () {
  let count = 0;
  window.bodyLock = {
    acquire() {
      count++;
      if (count === 1) document.body.style.overflow = 'hidden';
    },
    release() {
      if (count === 0) return;
      count--;
      if (count === 0) document.body.style.removeProperty('overflow');
    },
  };
})();
