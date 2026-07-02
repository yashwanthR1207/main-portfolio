const heroSection = document.querySelector('.hero-section');
const tiltCards = document.querySelectorAll('.tilt-card');

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateSpotlight(event) {
  if (!heroSection) return;

  const rect = heroSection.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const px = x / rect.width;
  const py = y / rect.height;

  heroSection.style.setProperty('--spot-x', `${x}px`);
  heroSection.style.setProperty('--spot-y', `${y}px`);
  heroSection.style.setProperty(
    '--spot-opacity',
    `${clamp(0.4 - Math.hypot(px - 0.5, py - 0.5) * 0.6, 0.08, 0.46)}`
  );
}

function resetTilt(element) {
  element.style.transform = 'perspective(1200px) translateZ(0)';
}

function handleTilt(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const dx = event.clientX - rect.left - rect.width / 2;
  const dy = event.clientY - rect.top - rect.height / 2;
  const rotateX = clamp((dy / rect.height) * 16, -16, 16);
  const rotateY = clamp((dx / rect.width) * -16, -16, 16);

  card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

if (heroSection) {
  heroSection.addEventListener('pointermove', updateSpotlight);
  heroSection.addEventListener('pointerleave', () => {
    heroSection.style.setProperty('--spot-x', '50%');
    heroSection.style.setProperty('--spot-y', '50%');
    heroSection.style.setProperty('--spot-opacity', '0.18');
  });
}

// Detect touch devices and adapt interactions for mobile
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = document.querySelectorAll('.hero-copy, .profile-panel, .section-heading, .skill-card, .project-card, .timeline-item, .contact-panel, .hero-metrics > div, .info-grid > div');
const sectionTargets = document.querySelectorAll('main > section, .hero-section');

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -30px 0px'
  });

  revealTargets.forEach((target, index) => {
    target.classList.add('reveal');
    target.style.transitionDelay = `${Math.min(index * 70, 220)}ms`;
    revealObserver.observe(target);
  });

  sectionTargets.forEach((section, index) => {
    section.classList.add('reveal-section');
    section.style.transitionDelay = `${Math.min(index * 90, 220)}ms`;
    sectionObserver.observe(section);
  });
} else {
  revealTargets.forEach((target) => target.classList.add('reveal', 'is-visible'));
  sectionTargets.forEach((section) => section.classList.add('reveal-section', 'is-visible'));
}

tiltCards.forEach((card) => {
  if (!isTouchDevice) {
    card.addEventListener('pointermove', handleTilt);
    card.addEventListener('pointerleave', () => resetTilt(card));
    card.addEventListener('pointercancel', () => resetTilt(card));
  } else {
    // For touch devices, enable tap-to-flip using the inner .flip-card-inner element
    const inner = card.querySelector('.flip-card-inner');
    if (inner) {
      card.addEventListener('click', (e) => {
        // Allow clicks on the upload button and links to pass through
        if (e.target.closest('.image-upload-btn') || e.target.closest('a')) return;
        inner.classList.toggle('flipped');
      });
    }
  }
});

// Fallback for back-face image: if assets/cat.jpg is missing, use an embedded SVG placeholder
document.addEventListener('DOMContentLoaded', () => {
  const backImg = document.querySelector('.profile-back-image');
  if (!backImg) return;

  const catSvg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'>
    <rect width='100%' height='100%' fill='rgba(12,17,33,0.45)' />
    <g transform='translate(200 180) scale(0.7)'>
      <ellipse cx='200' cy='360' rx='190' ry='220' fill='#d6c7b6' />
      <circle cx='140' cy='300' r='30' fill='#111827' />
      <circle cx='260' cy='300' r='30' fill='#111827' />
      <path d='M160 380 Q200 430 240 380' stroke='#b85' stroke-width='8' fill='none' stroke-linecap='round'/>
      <path d='M60 200 C40 120 120 80 160 140' fill='#d6c7b6' />
      <path d='M340 200 C360 120 280 80 240 140' fill='#d6c7b6' />
    </g>
  </svg>`;

  const svgDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(catSvg);

  // If the image fails to load, swap in the SVG data URL
  backImg.addEventListener('error', () => {
    backImg.src = svgDataUrl;
  });

  // If the image is already broken (cached), trigger the error handler
  if (!backImg.complete || backImg.naturalWidth === 0) {
    backImg.dispatchEvent(new Event('error'));
  }
});

// Allow user to pick a local image to use as the back face without saving to disk
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('profile-back-input');
  const uploadBtn = document.querySelector('.image-upload-btn');
  const backImg = document.querySelector('.profile-back-image');
  let currentObjectUrl = null;
  if (!fileInput || !uploadBtn || !backImg) return;

  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
    const url = URL.createObjectURL(file);
    currentObjectUrl = url;
    backImg.src = url;
  });
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelectorAll('.nav-links a');
  if (!nav || !toggle) return;

  function setOpen(open) {
    nav.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!nav.classList.contains('nav-open'));
  });

  // Close when clicking a link
  links.forEach((a) => a.addEventListener('click', () => setOpen(false)));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('nav-open')) return;
    if (!nav.contains(e.target)) setOpen(false);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
});

// Like Button Logic
document.addEventListener('DOMContentLoaded', () => {
  const likeBtn = document.getElementById('portfolio-like-btn');
  const likeIcon = document.getElementById('portfolio-like-icon');
  const likeCountEl = document.getElementById('portfolio-like-count');
  if (!likeBtn || !likeIcon || !likeCountEl) return;

  // Since it's a static site, we'll simulate a server count by adding the local like to a base number
  const BASE_LIKES = 124;
  
  // Check if user has liked before using localStorage
  let hasLiked = localStorage.getItem('portfolio_liked') === 'true';
  
  function updateUI() {
    likeCountEl.textContent = hasLiked ? BASE_LIKES + 1 : BASE_LIKES;
    if (hasLiked) {
      likeBtn.classList.add('liked');
      likeIcon.classList.remove('fa-regular');
      likeIcon.classList.add('fa-solid');
    } else {
      likeBtn.classList.remove('liked');
      likeIcon.classList.remove('fa-solid');
      likeIcon.classList.add('fa-regular');
    }
  }

  // Initial UI state
  updateUI();

  likeBtn.addEventListener('click', () => {
    hasLiked = !hasLiked;
    localStorage.setItem('portfolio_liked', hasLiked);
    
    // Add animation class
    likeBtn.classList.remove('animate-heart');
    // trigger reflow
    void likeBtn.offsetWidth;
    likeBtn.classList.add('animate-heart');
    
    updateUI();
  });
});