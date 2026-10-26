/**
 * STACKLY FinTech - Brand Preloader Controller (preloader.js)
 * Manages smooth entrance, brand animation lifecycle, and clean dismissal.
 */
(function () {
  'use strict';

  function initPreloader() {
    const preloader = document.getElementById('stackly-preloader');
    if (!preloader) return;

    let isDismissed = false;

    function dismiss() {
      if (isDismissed) return;
      isDismissed = true;

      // Instantly make non-blocking to all pointer and click events
      preloader.classList.add('preloader-dismissed');
      preloader.style.pointerEvents = 'none';

      // After fade transition, mark hidden & cleanly remove from DOM
      setTimeout(function () {
        preloader.classList.add('preloader-hidden');
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 450);
    }

    // Dismiss on window load with smooth presentation timing
    if (document.readyState === 'complete') {
      setTimeout(dismiss, 350);
    } else {
      window.addEventListener('load', function () {
        setTimeout(dismiss, 350);
      }, { once: true });
    }

    // Allow user to click or tap anywhere to immediately skip preloader
    preloader.addEventListener('click', dismiss);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === ' ') {
        dismiss();
      }
    }, { once: true });

    // Failsafe timer so page is never blocked regardless of asset loading delays
    setTimeout(dismiss, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();
