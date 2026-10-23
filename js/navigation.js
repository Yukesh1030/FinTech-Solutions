/**
 * STACKLY FinTech - Navigation & Header (navigation.js)
 * Mobile Drawer, Sticky Scroll, Active Page Tracking, Keyboard Accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
});

function initNavigation() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Sticky / Scrolled Header
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Hamburger Mobile Toggle
  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    });
  }

  // Close Mobile Menu
  if (mobileCloseBtn && mobileNav) {
    mobileCloseBtn.addEventListener('click', closeMobileNav);
  }

  function closeMobileNav() {
    if (mobileNav) {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // Close on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
      closeAnyModal();
    }
  });

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Highlight Current Page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function closeAnyModal() {
  const openModal = document.querySelector('.modal-overlay.open');
  if (openModal) {
    openModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}
