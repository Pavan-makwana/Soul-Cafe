/* main.js
   Navbar scroll behaviour (Geetanjali-inspired), smooth scroll, reveal animations, mobile nav, year fill
*/

(function () {
  // Helpers
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  // 1. Fill copyright years
  const year = new Date().getFullYear();
  // Target IDs are reused across pages: yearIndex, yearAbout, yearMenu, yearGallery
  ['yearIndex','yearAbout','yearMenu','yearGallery'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.textContent = year;
  });

  // 2. NAVBAR: change bg on scroll (Geetanjali-inspired)
  const header = document.getElementById('siteHeader');
  const hero = $('.hero-section');
  // Use a smaller threshold if no hero, or hero height
  const scrollThreshold = hero ? (hero.offsetHeight - 120) : 100;

  function onScroll() {
    if(!header) return;
    if(window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Initial call and event listener
  if (header) {
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }


  // // 3. MOBILE NAV TOGGLE (Targeting the relevant IDs for the current page)
  // const currentPageToggleId = header ? (header.id.replace('siteHeader', 'navToggle') || 'navToggle1') : 'navToggle1'; // Assuming a pattern for IDs
  // const currentPageNavId = header ? (header.id.replace('siteHeader', 'mainNav') || 'mainNav1') : 'mainNav1';

  // const toggle = document.getElementById(currentPageToggleId);
  // const nav = document.getElementById(currentPageNavId);

  // if (toggle && nav) {
  //   toggle.addEventListener('click', () => {
  //     nav.classList.toggle('open');
  //     toggle.classList.toggle('active'); // For burger animation if implemented
  //     document.body.classList.toggle('nav-open'); // To potentially block body scroll
  //   });

  //   // Close on nav link click (smooth scroll navigation)
  //   $$('.nav-link', nav).forEach(link => {
  //     link.addEventListener('click', () => {
  //       nav.classList.remove('open');
  //       toggle.classList.remove('active');
  //       document.body.classList.remove('nav-open');
  //     });
  //   });

  //   // Close mobile nav on outside click
  //   document.addEventListener('click', (e) => {
  //     if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
  //       nav.classList.remove('open');
  //       toggle.classList.remove('active');
  //       document.body.classList.remove('nav-open');
  //     }
  //   });
  // }


  // 4. Reveal Animations on Scroll (Drivesync.tech inspired - Intersection Observer)
  const revealEls = $$('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting) {
          ent.target.classList.add('visible');
          io.unobserve(ent.target);
        }
      });
    }, {threshold: 0.15}); // 15% visibility

    revealEls.forEach(el=>io.observe(el));
  } else {
    // Fallback - make visible
    revealEls.forEach(el=>el.classList.add('visible'));
  }

})();

(function () {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle1');
  const navLinks = document.getElementById('mainNav1');

  if (!navToggle || !navLinks || !header) return;

  // Toggle menu on button click
  navToggle.addEventListener('click', (e) => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    // prevent body scroll when menu open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when clicking any nav link (mobile)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on click outside the menu
  document.addEventListener('click', (evt) => {
    if (!navLinks.classList.contains('open')) return;
    const isClickInside = navLinks.contains(evt.target) || navToggle.contains(evt.target);
    if (!isClickInside) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Add/remove .scrolled on header based on scroll position (for burger color)
  const SCROLL_THRESHOLD = 20;
  const checkScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', checkScroll, { passive: true });
  // initial
  checkScroll();
})();