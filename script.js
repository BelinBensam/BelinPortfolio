'use strict';

/* ===========================================================
   BELIN B — PORTFOLIO SCRIPT
   Vanilla JavaScript only
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initParticles();
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initProgressBars();
  initContactForm();
  initBackToTop();
});

/* ---------- Page Loader ---------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });

  // Fallback in case 'load' already fired
  if (document.readyState === 'complete') {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
}

/* ---------- Floating Particle Background ---------- */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(70, Math.floor((width * height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 255, 136, 1)';

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
      if (prefersReducedMotion) draw();
    }, 200);
  });
}

/* ---------- Navbar: scroll state, active link, mobile toggle, smooth scroll ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* ---------- Typing Effect ---------- */
function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = ['Frontend Developer', 'Python Enthusiast', 'CSE Student'];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED = 90;
  const DELETE_SPEED = 45;
  const HOLD_TIME = 1400;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-scale');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(target => observer.observe(target));
}

/* ---------- Animated Progress Bars ---------- */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const value = bar.dataset.value || 0;
        requestAnimationFrame(() => {
          bar.style.width = value + '%';
        });
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
}

/* ---------- Contact Form Validation ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const success = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, msg) {
    field.el.closest('.form-group').classList.add('error');
    field.error.textContent = msg;
  }

  function clearError(field) {
    field.el.closest('.form-group').classList.remove('error');
    field.error.textContent = '';
  }

  function validateField(key) {
    const field = fields[key];
    const value = field.el.value.trim();

    if (!value) {
      setError(field, 'This field is required.');
      return false;
    }

    if (key === 'email' && !emailPattern.test(value)) {
      setError(field, 'Please enter a valid email address.');
      return false;
    }

    if (key === 'message' && value.length < 10) {
      setError(field, 'Message should be at least 10 characters.');
      return false;
    }

    clearError(field);
    return true;
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.closest('.form-group').classList.contains('error')) {
        validateField(key);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.classList.remove('show');

    let valid = true;
    Object.keys(fields).forEach(key => {
      if (!validateField(key)) valid = false;
    });

    if (!valid) {
      const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate sending (no backend wired up)
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      Object.keys(fields).forEach(key => clearError(fields[key]));
      success.classList.add('show');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      setTimeout(() => success.classList.remove('show'), 4000);
    }, 900);
  });
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
