const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');

function setMenuOpen(isOpen) {
  navLinks.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  menuToggle.textContent = isOpen ? '×' : '☰';
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

document.addEventListener('click', (event) => {
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
    setMenuOpen(false);
  }
});

const dateInput = document.querySelector('#travelDate');
const today = new Date();
dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);
document.querySelector('#year').textContent = today.getFullYear();

document.querySelector('#bookingForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const trip = new FormData(event.currentTarget);
  const message = [
    'Hello SKANDHA HOLIDAYS CABS, I would like to request a cab quote.',
    `Ride type: ${trip.get('type')}`,
    `Pickup: ${trip.get('pickup')}`,
    `Destination: ${trip.get('dropoff')}`,
    `Travel date: ${trip.get('date')}`
  ].join('\n');

  const waUrl = `https://wa.me/917019674955?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
});

const heroSlides = [...document.querySelectorAll('.hero-slide')];
const heroDots = [...document.querySelectorAll('.slider-dot')];
const heroSlider = document.querySelector('#heroSlides');
const heroCarousel = heroSlider?.closest('.hero-photo');
const heroPrevious = document.querySelector('#heroPrevious');
const heroNext = document.querySelector('#heroNext');

if (heroSlides.length > 1) {
  let activeSlide = 0;
  let autoplayTimer;
  let touchStartX = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function showSlide(index) {
    activeSlide = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    heroDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeSlide;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', String(isActive));
    });
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
  }

  function startAutoplay() {
    stopAutoplay();
    if (!prefersReducedMotion.matches && !document.hidden) {
      autoplayTimer = window.setInterval(() => showSlide(activeSlide + 1), 5500);
    }
  }

  heroPrevious.addEventListener('click', () => {
    showSlide(activeSlide - 1);
    startAutoplay();
  });
  heroNext.addEventListener('click', () => {
    showSlide(activeSlide + 1);
    startAutoplay();
  });
  heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoplay();
    });
  });
  heroCarousel.addEventListener('mouseenter', stopAutoplay);
  heroCarousel.addEventListener('mouseleave', startAutoplay);
  heroCarousel.addEventListener('focusin', stopAutoplay);
  heroCarousel.addEventListener('focusout', (event) => {
    if (!heroCarousel.contains(event.relatedTarget)) startAutoplay();
  });
  heroSlider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      showSlide(activeSlide - 1);
      startAutoplay();
    } else if (event.key === 'ArrowRight') {
      showSlide(activeSlide + 1);
      startAutoplay();
    }
  });
  heroSlider.addEventListener('pointerdown', (event) => {
    touchStartX = event.clientX;
  });
  heroSlider.addEventListener('pointerup', (event) => {
    if (touchStartX === null) return;
    const swipeDistance = event.clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(swipeDistance) > 50) {
      showSlide(activeSlide + (swipeDistance < 0 ? 1 : -1));
      startAutoplay();
    }
  });
  document.addEventListener('visibilitychange', startAutoplay);
  prefersReducedMotion.addEventListener('change', startAutoplay);
  startAutoplay();
}

const faqButtons = [...document.querySelectorAll('.faq-question')];
faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const willOpen = button.getAttribute('aria-expanded') !== 'true';

    faqButtons.forEach((otherButton) => {
      otherButton.setAttribute('aria-expanded', 'false');
      otherButton.nextElementSibling.style.maxHeight = '';
    });

    if (willOpen) {
      button.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

const backToTop = document.querySelector('#backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealTargets = document.querySelectorAll(
  '.section-head, .service-card, .car-card, .why-image, .why-copy, .destination, .faq-item'
);
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach((element) => element.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => revealObserver.observe(element));
}
