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

tiltCards.forEach((card) => {
  card.addEventListener('pointermove', handleTilt);
  card.addEventListener('pointerleave', () => resetTilt(card));
  card.addEventListener('pointercancel', () => resetTilt(card));
});
