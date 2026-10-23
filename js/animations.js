/**
 * STACKLY FinTech - GSAP & Scroll Animations (animations.js)
 * Text mask reveal, dashboard card entrances, KPI counters, line drawing
 */

document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
});

function initAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Initialize GSAP & ScrollTrigger if loaded
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Hero Reveal Animation
    const heroTitle = document.querySelector('.hero-title');
    const heroDesc = document.querySelector('.hero-description');
    const heroActions = document.querySelector('.hero-actions');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroTitle) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(heroTitle, 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, delay: 0.2 }
      );

      if (heroDesc) {
        tl.fromTo(heroDesc, 
          { y: 25, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8 }, 
          '-=0.6'
        );
      }

      if (heroActions) {
        tl.fromTo(heroActions, 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.7 }, 
          '-=0.5'
        );
      }

      if (heroVisual) {
        tl.fromTo(heroVisual, 
          { scale: 0.94, opacity: 0, y: 30 }, 
          { scale: 1, opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 
          '-=0.8'
        );

        // Floating KPI badges
        const floatingCards = document.querySelectorAll('.floating-kpi-card');
        if (floatingCards.length > 0) {
          tl.fromTo(floatingCards, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 }, 
            '-=0.5'
          );
        }
      }
    }

    // 2. Inner Hero Reveal (for solutions, products, about, contact)
    const innerHeroTitle = document.querySelector('.inner-hero-title');
    const innerHeroCover = document.querySelector('.inner-hero-cover');
    if (innerHeroTitle) {
      gsap.fromTo(innerHeroTitle, 
        { y: 35, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.9, delay: 0.1, ease: 'power3.out' }
      );
      if (innerHeroCover) {
        gsap.fromTo(innerHeroCover, 
          { y: 40, opacity: 0, scale: 0.96 }, 
          { y: 0, opacity: 1, scale: 1, duration: 1.1, delay: 0.3, ease: 'power2.out' }
        );
      }
    }

    // 3. Staggered Cards Reveal on Scroll
    const staggerContainers = document.querySelectorAll('.grid-2, .grid-3, .grid-4, .solutions-overview-grid');
    staggerContainers.forEach(container => {
      const cards = container.querySelectorAll('.card, .solution-card-detailed, .integration-card');
      if (cards.length > 0 && typeof ScrollTrigger !== 'undefined') {
        gsap.fromTo(cards, 
          { y: 35, opacity: 0 }, 
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // 4. Section Headers Scroll Reveal
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.fromTo(header, 
          { y: 30, opacity: 0 }, 
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // 5. Animated KPI Counter Numbers
    initCounters();
  } else {
    // Fallback if GSAP is unavailable
    initFallbackIntersectionObserver();
  }
}

function initCounters() {
  const counterElements = document.querySelectorAll('.counter-val');
  if (counterElements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = start + (target - start) * easeProgress;
          el.textContent = prefix + (decimals > 0 ? currentVal.toFixed(decimals) : Math.floor(currentVal).toLocaleString()) + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}

function initFallbackIntersectionObserver() {
  const elements = document.querySelectorAll('.gsap-reveal, .card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}
