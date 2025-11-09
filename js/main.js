

/* main.js
   Enhanced JavaScript with animations, lightbox, scroll effects, and interactive features
*/

(function () {
  'use strict';

  // Helpers
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  // 1. Fill copyright years
  const year = new Date().getFullYear();
  const yearElements = ['yearFooter', 'yearIndex', 'yearAbout', 'yearMenu', 'yearGallery'];
  yearElements.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = year;
  });

  // 2. Enhanced Navbar Scroll Effects
  const header = document.getElementById('siteHeader');
  const hero = $('.hero-section');
  const scrollThreshold = hero ? (hero.offsetHeight - 120) : 100;

  function handleNavbarScroll() {
    if (!header) return;
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  if (header) {
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();
  }

  // 3. Scroll Reveal Animations with Intersection Observer
  const revealSelectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];

  revealSelectors.forEach(selector => {
    const elements = $$(selector);
    if (elements.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      elements.forEach(el => observer.observe(el));
    } else {
      // Fallback - make visible immediately
      elements.forEach(el => el.classList.add('visible'));
    }
  });

  // 4. Gallery Lightbox Functionality
  function initGalleryLightbox() {
    const galleryImages = $$('.gallery-image img');
    if (!galleryImages.length) return;

    // Create lightbox HTML
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <span class="lightbox-prev">&#10094;</span>
      <span class="lightbox-next">&#10095;</span>
      <div class="lightbox-content">
        <img src="" alt="Gallery Image">
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = $('.lightbox-content img', lightbox);
    const closeBtn = $('.lightbox-close', lightbox);
    const prevBtn = $('.lightbox-prev', lightbox);
    const nextBtn = $('.lightbox-next', lightbox);

    let currentIndex = 0;
    const images = galleryImages.map(img => img.src);

    function openLightbox(index) {
      currentIndex = index;
      lightboxImg.src = images[currentIndex];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      lightboxImg.src = images[currentIndex];
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lightboxImg.src = images[currentIndex];
    }

    // Event listeners
    galleryImages.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  // 5. Scroll to Top Button
  function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    function toggleScrollButton() {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    }

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', toggleScrollButton, { passive: true });
    toggleScrollButton();
  }

  // 6. Smooth Scroll for Anchor Links
  function initSmoothScroll() {
    const anchorLinks = $$('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '#!') return;

        const target = $(href);
        if (target) {
          e.preventDefault();
          const headerOffset = header ? header.offsetHeight + 20 : 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // 7. Lazy Loading Images
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add('loaded');
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });

      $$('img[data-src]').forEach(img => {
        img.classList.add('lazy-load');
        imageObserver.observe(img);
      });
    }
  }

  // 8. Parallax Effect
  function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const parallaxElements = $$('.parallax');
    if (!parallaxElements.length) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, { passive: true });
  }

  // 9. Enhanced Card Animations on Scroll
  function initCardAnimations() {
    const cards = $$('.card, .philosophy-block .card');
    if (!cards.length || !('IntersectionObserver' in window)) return;

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      cardObserver.observe(card);
    });
  }

  // 10. Counter Animation (if needed)
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start);
      }
    }, 16);
  }

  // 11. Initialize all features when DOM is ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initGalleryLightbox();
    initScrollToTop();
    initSmoothScroll();
    initLazyLoading();
    initParallax();
    initCardAnimations();
  }

  init();
})();

// Mobile Navigation Handler (separate IIFE for clarity)
(function () {
  // ✅ define these helpers so no ReferenceError occurs
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  const header = document.getElementById('siteHeader');
  const navToggle = $('.navbar-toggler');
  const navLinks = $('#mainNav');

  if (!navToggle || !navLinks || !header) return;

  // Bootstrap handles the toggle, but we can add custom behavior
  navLinks.addEventListener('show.bs.collapse', () => {
    document.body.style.overflow = 'hidden';
  });

  navLinks.addEventListener('hide.bs.collapse', () => {
    document.body.style.overflow = '';
  });

  // Close menu when clicking nav links (mobile)
  $$('.nav-link', navLinks).forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        const bsCollapse = bootstrap.Collapse.getInstance(navLinks);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
})();
