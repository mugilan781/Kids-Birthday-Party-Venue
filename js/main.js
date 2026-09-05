/**
 * LittleLux — Kids Birthday Party Venue
 * Core JavaScript Module
 * ES6+ | Vanilla JS | Production Ready
 */

'use strict';

// ===== THEME MANAGER =====
const ThemeManager = (() => {
  const STORAGE_KEY = 'littlelux-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  const getPreference = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const toggleBtns = document.querySelectorAll('[data-theme-toggle]');
    const sunSvg = '<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    const moonSvg = '<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
    toggleBtns.forEach(btn => {
      btn.innerHTML = theme === DARK ? sunSvg : moonSvg;
      btn.setAttribute('title', theme === DARK ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('aria-label', theme === DARK ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  };

  const toggle = () => {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    setTheme(current === DARK ? LIGHT : DARK);
  };

  const init = () => {
    setTheme(getPreference());
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  };

  return { init, toggle, setTheme };
})();

// ===== RTL MANAGER =====
const RTLManager = (() => {
  const STORAGE_KEY = 'littlelux-dir';

  const setDir = (dir) => {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    const toggleBtns = document.querySelectorAll('[data-rtl-toggle]');
    toggleBtns.forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  };

  const toggle = () => {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    setDir(current === 'rtl' ? 'ltr' : 'rtl');
  };

  const init = () => {
    const saved = localStorage.getItem(STORAGE_KEY) || 'ltr';
    setDir(saved);
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  };

  return { init, toggle };
})();

// ===== NAVBAR =====
const Navbar = (() => {
  let navbar, hamburger, mobileNav, scrollThreshold = 20;

  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  const toggleMobile = () => {
    if (!hamburger || !mobileNav) return;
    const isOpen = hamburger.classList.contains('active');
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
    hamburger.setAttribute('aria-expanded', !isOpen);
  };

  const closeMobile = () => {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  const setActiveLink = () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const cleanHref = href.split('#')[0].split('?')[0].split('/').pop();
      const isActive = cleanHref === currentPath ||
        (cleanHref === 'index.html' && (currentPath === '' || currentPath === 'index.html')) ||
        (currentPath === 'blog-details.html' && cleanHref === 'blog.html');
      link.classList.toggle('active', isActive);
    });
  };

  const init = () => {
    navbar = document.querySelector('.navbar');
    hamburger = document.querySelector('.hamburger');
    mobileNav = document.querySelector('.mobile-nav');

    if (!navbar) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (hamburger) {
      hamburger.addEventListener('click', toggleMobile);
    }

    if (mobileNav) {
      mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', closeMobile);
      });
    }

    // Profile Dropdown Toggle
    const profileWrap = document.querySelector('.nav-profile-dropdown');
    const profileBtn = document.querySelector('.profile-toggle-btn');
    if (profileWrap && profileBtn) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = profileWrap.classList.toggle('open');
        profileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      document.addEventListener('click', (e) => {
        if (!profileWrap.contains(e.target)) {
          profileWrap.classList.remove('open');
          profileBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobile();
        if (profileWrap && profileBtn) {
          profileWrap.classList.remove('open');
          profileBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    setActiveLink();
  };

  return { init, closeMobile };
})();

// ===== SCROLL REVEAL =====
const ScrollReveal = (() => {
  let observer;

  const createObserver = () => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, parseFloat(delay) * 1000);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  };

  const init = () => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    createObserver();
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      observer.observe(el);
    });
  };

  const refresh = () => {
    if (observer) {
      document.querySelectorAll('.reveal:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed), .reveal-scale:not(.revealed)').forEach(el => {
        observer.observe(el);
      });
    }
  };

  return { init, refresh };
})();

// ===== ANIMATED COUNTER =====
const AnimatedCounter = (() => {
  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = parseInt(el.dataset.duration) || 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const value = target * eased;

      el.textContent = prefix + (Number.isInteger(target)
        ? Math.floor(value).toLocaleString()
        : value.toFixed(1)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const init = () => {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  };

  return { init };
})();

// ===== HERO SLIDER =====
const HeroSlider = (() => {
  let slider, slides, dots, currentIndex = 0, autoplayInterval, isDragging = false, startX = 0;

  const goTo = (index) => {
    slides[currentIndex].classList.remove('active');
    dots && dots[currentIndex] && dots[currentIndex].classList.remove('active');
    currentIndex = (index + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    dots && dots[currentIndex] && dots[currentIndex].classList.add('active');
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  const startAutoplay = (interval = 5000) => {
    stopAutoplay();
    autoplayInterval = setInterval(next, interval);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  };

  const init = (selector = '.hero-slider') => {
    slider = document.querySelector(selector);
    if (!slider) return;

    slides = slider.querySelectorAll('.hero-slide');
    dots = document.querySelectorAll('.hero-dot');

    if (!slides.length) return;

    slides[0].classList.add('active');

    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
    });

    // Touch/Drag
    slider.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; });
    slider.addEventListener('touchstart', e => { isDragging = true; startX = e.touches[0].clientX; }, { passive: true });

    const endDrag = (endX) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        startAutoplay();
      }
    };

    slider.addEventListener('mouseup', e => endDrag(e.clientX));
    slider.addEventListener('touchend', e => endDrag(e.changedTouches[0].clientX));

    startAutoplay();
  };

  return { init, next, prev, goTo, startAutoplay, stopAutoplay };
})();

// ===== FAQ ACCORDION =====
const Accordion = (() => {
  const init = (selector = '.faq-item') => {
    const items = document.querySelectorAll(selector);
    if (!items.length) return;

    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        items.forEach(i => {
          i.classList.remove('open');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = '0';
        });

        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });

      answer.style.maxHeight = '0';
    });
  };

  return { init };
})();

// ===== IMAGE ZOOM =====
const ImageZoom = (() => {
  let modal, modalImg, closeBtn;

  const createModal = () => {
    modal = document.createElement('div');
    modal.className = 'image-zoom-modal';
    modal.innerHTML = `
      <div class="zoom-overlay"></div>
      <div class="zoom-container">
        <img class="zoom-img" src="" alt="Zoomed image" />
        <button class="zoom-close" aria-label="Close">&times;</button>
      </div>
    `;
    modal.style.cssText = `
      position:fixed;inset:0;z-index:var(--z-modal);display:none;align-items:center;justify-content:center;
    `;
    document.body.appendChild(modal);

    modalImg = modal.querySelector('.zoom-img');
    closeBtn = modal.querySelector('.zoom-close');

    const overlay = modal.querySelector('.zoom-overlay');
    overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.9);cursor:pointer;';
    modalImg.style.cssText = 'max-width:90vw;max-height:85vh;object-fit:contain;border-radius:12px;position:relative;z-index:1;animation:slide-up 0.3s ease;';
    closeBtn.style.cssText = `
      position:absolute;top:16px;right:16px;width:44px;height:44px;border-radius:50%;
      background:rgba(255,255,255,0.2);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.3);
      color:white;font-size:1.5rem;cursor:pointer;display:flex;align-items:center;justify-content:center;
      z-index:2;transition:all 0.2s;
    `;
    modal.querySelector('.zoom-container').style.cssText = 'position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;';

    const close = () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  };

  const open = (src, alt = '') => {
    if (!modal) createModal();
    modalImg.src = src;
    modalImg.alt = alt;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const init = (selector = '[data-zoom]') => {
    document.querySelectorAll(selector).forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => open(img.src || img.dataset.src, img.alt));
    });
  };

  return { init, open };
})();

// ===== BACK TO TOP =====
const BackToTop = (() => {
  const init = () => {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return { init };
})();

// ===== FORM VALIDATION =====
const FormValidator = (() => {
  const rules = {
    required: (v) => v.trim() !== '' || 'This field is required',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email',
    phone: (v) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(v) || 'Please enter a valid phone number',
    minLength: (len) => (v) => v.length >= len || `Minimum ${len} characters required`,
    maxLength: (len) => (v) => v.length <= len || `Maximum ${len} characters allowed`,
  };

  const validate = (input) => {
    const validations = input.dataset.validate ? input.dataset.validate.split('|') : [];
    let isValid = true;
    let message = '';

    for (const rule of validations) {
      const [ruleName, ...params] = rule.split(':');
      const validator = params.length ? rules[ruleName]?.(params[0]) : rules[ruleName];
      if (!validator) continue;
      const result = validator(input.value);
      if (result !== true) {
        isValid = false;
        message = result;
        break;
      }
    }

    const errorEl = input.parentElement.querySelector('.form-error') || (input.closest('form') ? input.closest('form').querySelector('.form-error') : null);
    if (!isValid) {
      input.classList.add('error');
      if (errorEl) errorEl.textContent = message;
    } else {
      input.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    }

    return isValid;
  };

  const init = (formSelector = 'form[data-validate]') => {
    document.querySelectorAll(formSelector).forEach(form => {
      const inputs = form.querySelectorAll('[data-validate]');

      inputs.forEach(input => {
        input.addEventListener('blur', () => validate(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) validate(input);
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let allValid = true;
        inputs.forEach(input => {
          if (!validate(input)) allValid = false;
        });
        if (allValid && form.dataset.onSuccess) {
          const fn = window[form.dataset.onSuccess];
          if (typeof fn === 'function') fn(form);
        }
      });
    });
  };

  return { init, validate };
})();

// ===== TOAST NOTIFICATIONS =====
const Toast = (() => {
  let container;

  const createContainer = () => {
    container = document.createElement('div');
    container.id = 'littlelux-toast-container';
    container.style.cssText = `
      position:fixed;top:var(--space-6, 1.5rem);right:var(--space-6, 1.5rem);z-index:9999;
      display:flex;flex-direction:column;gap:var(--space-3, 0.75rem);pointer-events:none;
      max-width:calc(100vw - 2rem);
    `;
    document.body.appendChild(container);
  };

  // Curated SVG vector representations for emojis commonly used in celebrations & alerts
  const vectorSvgMap = {
    '🎉': '<svg class="svg-icon toast-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 11 7 7-9 2z"/><path d="m15 4 5 5"/><path d="m11 2 1 3"/><path d="m18 11 3 1"/><path d="m14 10 6-6"/><path d="m7 17-3 3"/><path d="m17 7 2-2"/></svg>',
    '🎊': '<svg class="svg-icon toast-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 11 7 7-9 2z"/><path d="m15 4 5 5"/><path d="m11 2 1 3"/><path d="m18 11 3 1"/><path d="m14 10 6-6"/><path d="m7 17-3 3"/><path d="m17 7 2-2"/></svg>',
    '✨': '<svg class="svg-icon toast-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    '⭐': '<svg class="svg-icon toast-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    '🎂': '<svg class="svg-icon toast-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/></svg>',
    '🍰': '<svg class="svg-icon toast-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2.5-2 4-2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/></svg>',
    '🎈': '<svg class="svg-icon toast-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 0 0-7-7z"/><path d="M12 20v4"/></svg>',
    '✅': '<svg class="svg-icon toast-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
    '🔔': '<svg class="svg-icon toast-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
  };

  const show = (message, type = 'success', duration = 4000) => {
    if (!container) createContainer();

    // 1. Process message: Replace common emojis with crisp SVG vector icons
    let processedMessage = String(message || '');
    for (const [emojiChar, svgStr] of Object.entries(vectorSvgMap)) {
      if (processedMessage.includes(emojiChar)) {
        processedMessage = processedMessage.split(emojiChar).join(svgStr);
      }
    }
    // 2. Strip any remaining unsupported unicode emojis so NO raw emojis ever display
    processedMessage = processedMessage.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]/gu, '').trim();

    // Default primary vector badges for each toast alert type
    const defaultIcons = {
      success: '<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
      error: '<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>',
      warning: '<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
      info: '<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
    };

    let iconHtml = defaultIcons[type] || defaultIcons.info;
    let textHtml = processedMessage;

    // If message starts with an inline SVG, extract it as the primary badge to prevent double icons
    if (processedMessage.startsWith('<svg')) {
      const closingSvgIndex = processedMessage.indexOf('</svg>');
      if (closingSvgIndex !== -1) {
        iconHtml = processedMessage.substring(0, closingSvgIndex + 6);
        textHtml = processedMessage.substring(closingSvgIndex + 6).trim();
      }
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Theme-conscious colors with high contrast for both dark & light modes
    const themeStyles = {
      light: {
        success: { bg: 'rgba(236, 253, 245, 0.98)', border: 'rgba(16, 185, 129, 0.4)', text: '#064E3B', iconBg: 'rgba(16, 185, 129, 0.15)', iconColor: '#059669' },
        error:   { bg: 'rgba(254, 242, 242, 0.98)', border: 'rgba(239, 68, 68, 0.4)',  text: '#7F1D1D', iconBg: 'rgba(239, 68, 68, 0.15)',  iconColor: '#DC2626' },
        warning: { bg: 'rgba(255, 251, 235, 0.98)', border: 'rgba(245, 158, 11, 0.4)', text: '#78350F', iconBg: 'rgba(245, 158, 11, 0.15)', iconColor: '#D97706' },
        info:    { bg: 'rgba(245, 243, 255, 0.98)', border: 'rgba(139, 92, 246, 0.4)', text: '#4C1D95', iconBg: 'rgba(139, 92, 246, 0.15)', iconColor: '#7C3AED' }
      },
      dark: {
        success: { bg: 'rgba(6, 78, 59, 0.95)',    border: 'rgba(52, 211, 153, 0.5)',  text: '#ECFDF5', iconBg: 'rgba(52, 211, 153, 0.22)', iconColor: '#6EE7B7' },
        error:   { bg: 'rgba(127, 29, 29, 0.95)',   border: 'rgba(248, 113, 113, 0.5)', text: '#FEF2F2', iconBg: 'rgba(248, 113, 113, 0.22)',iconColor: '#FCA5A5' },
        warning: { bg: 'rgba(120, 53, 15, 0.95)',   border: 'rgba(251, 191, 36, 0.5)',  text: '#FFFBEB', iconBg: 'rgba(251, 191, 36, 0.22)', iconColor: '#FCD34D' },
        info:    { bg: 'rgba(76, 29, 149, 0.95)',   border: 'rgba(167, 139, 250, 0.5)', text: '#F5F3FF', iconBg: 'rgba(167, 139, 250, 0.22)',iconColor: '#C4B5FD' }
      }
    };

    const currentPalette = (isDark ? themeStyles.dark : themeStyles.light)[type] || (isDark ? themeStyles.dark.info : themeStyles.light.info);

    const toast = document.createElement('div');
    toast.className = `littlelux-toast toast-${type}`;
    toast.style.cssText = `
      background:${currentPalette.bg};backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
      padding:0.85rem 1.25rem;border-radius:var(--border-radius-lg, 14px);
      box-shadow:0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1);
      pointer-events:all;display:flex;align-items:center;gap:0.75rem;
      min-width:280px;max-width:440px;font-family:var(--font-body, inherit);
      font-size:var(--text-sm, 0.9rem);font-weight:600;color:${currentPalette.text};
      animation:slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border:1px solid ${currentPalette.border};line-height:1.45;
    `;

    toast.innerHTML = `
      <span class="toast-icon-wrap" style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:${currentPalette.iconBg};color:${currentPalette.iconColor};flex-shrink:0">
        ${iconHtml}
      </span>
      <span class="toast-content" style="flex:1;word-break:break-word">${textHtml}</span>
    `;

    // Ensure svg icons inside toast are properly sized
    const toastSvgs = toast.querySelectorAll('svg');
    toastSvgs.forEach(s => {
      s.style.width = '18px';
      s.style.height = '18px';
      s.style.display = 'inline-block';
      s.style.verticalAlign = 'middle';
    });

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.35s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 350);
    }, duration);
  };

  return { show };
})();

// ===== PAGE TRANSITIONS =====
const PageTransitions = (() => {
  const init = () => {
    document.body.classList.add('page-transition');
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel') && !href.startsWith('http')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          document.body.style.opacity = '0';
          document.body.style.transform = 'translateY(10px)';
          document.body.style.transition = 'all 0.3s ease';
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        });
      }
    });
  };

  return { init };
})();

// ===== FLOATING PARTICLES =====
const Particles = (() => {
  const symbols = ['✦', '✧', '★', '◆', '●', '✦'];

  const createParticle = (container) => {
    const particle = document.createElement('span');
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const size = Math.random() * 16 + 8;
    const x = Math.random() * 100;
    const duration = Math.random() * 10 + 8;
    const delay = Math.random() * 5;

    particle.textContent = symbol;
    particle.style.cssText = `
      position:absolute;left:${x}%;top:-20px;font-size:${size}px;
      opacity:${Math.random() * 0.3 + 0.1};pointer-events:none;
      animation:float-particle ${duration}s ${delay}s linear infinite;
    `;
    container.appendChild(particle);
  };

  const init = (containerSelector = '.particles-container', count = 12) => {
    const containers = document.querySelectorAll(containerSelector);
    containers.forEach(container => {
      container.style.position = 'relative';
      container.style.overflow = 'hidden';

      if (!document.querySelector('style[data-particles]')) {
        const style = document.createElement('style');
        style.dataset.particles = '';
        style.textContent = `
          @keyframes float-particle {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.3; }
            90% { opacity: 0.3; }
            100% { transform: translateY(${container.offsetHeight + 40}px) rotate(360deg); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      for (let i = 0; i < count; i++) createParticle(container);
    });
  };

  return { init };
})();

// ===== GALLERY FILTER =====
const GalleryFilter = (() => {
  const init = (filterSelector = '.filter-btn', itemSelector = '.gallery-item') => {
    const filterBtns = document.querySelectorAll(filterSelector);
    const items = document.querySelectorAll(itemSelector);
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        items.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
            item.style.animation = 'fade-in 0.4s ease';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  };

  return { init };
})();

// ===== AVAILABILITY CALENDAR =====
const AvailabilityCalendar = (() => {
  const BOOKED_SLOTS = {
    '2026-09-06': ['10:00', '14:00'],
    '2026-09-07': ['11:00'],
    '2026-09-12': ['10:00', '11:00', '14:00', '15:00'],
    '2026-09-14': ['10:00'],
    '2026-09-19': ['14:00', '15:00'],
    '2026-09-21': ['10:00', '11:00', '14:00'],
    '2026-09-26': ['11:00'],
    '2026-09-28': ['15:00'],
  };

  const TIME_SLOTS = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

  let currentYear, currentMonth, selectedDate = null;

  const formatDate = (y, m, d) => `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const isFullyBooked = (dateStr) => {
    const booked = BOOKED_SLOTS[dateStr] || [];
    return booked.length >= TIME_SLOTS.length;
  };

  const isPartiallyBooked = (dateStr) => {
    const booked = BOOKED_SLOTS[dateStr] || [];
    return booked.length > 0 && booked.length < TIME_SLOTS.length;
  };

  const renderCalendar = (container, year, month) => {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `
      <div class="cal-header">
        <button class="cal-nav-btn" id="cal-prev">‹</button>
        <span class="cal-month-year">${monthNames[month]} ${year}</span>
        <button class="cal-nav-btn" id="cal-next">›</button>
      </div>
      <div class="cal-weekdays">
        ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div>${d}</div>`).join('')}
      </div>
      <div class="cal-days">
        ${Array(firstDay).fill('<div class="cal-day empty"></div>').join('')}
    `;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDate(year, month + 1, d);
      const date = new Date(year, month, d);
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const fullBooked = isFullyBooked(dateStr);
      const partial = isPartiallyBooked(dateStr);
      const isSelected = dateStr === selectedDate;

      let classes = 'cal-day';
      if (isPast) classes += ' past';
      else if (fullBooked) classes += ' booked';
      else if (partial) classes += ' partial';
      else classes += ' available';
      if (isToday) classes += ' today';
      if (isSelected) classes += ' selected';

      const disabled = isPast || fullBooked;
      html += `<div class="${classes}" data-date="${dateStr}" ${disabled ? 'aria-disabled="true"' : ''}>${d}</div>`;
    }

    html += `</div>
      <div class="cal-legend">
        <div class="legend-item"><span class="legend-dot available"></span> Available</div>
        <div class="legend-item"><span class="legend-dot partial"></span> Partially Booked</div>
        <div class="legend-item"><span class="legend-dot booked"></span> Fully Booked</div>
      </div>
    `;

    container.innerHTML = html;

    container.querySelector('#cal-prev')?.addEventListener('click', () => {
      month--;
      if (month < 0) { month = 11; year--; }
      currentMonth = month;
      currentYear = year;
      renderCalendar(container, year, month);
    });

    container.querySelector('#cal-next')?.addEventListener('click', () => {
      month++;
      if (month > 11) { month = 0; year++; }
      currentMonth = month;
      currentYear = year;
      renderCalendar(container, year, month);
    });

    container.querySelectorAll('.cal-day.available, .cal-day.partial').forEach(day => {
      day.addEventListener('click', () => {
        selectedDate = day.dataset.date;
        renderCalendar(container, currentYear, currentMonth);
        renderTimeSlots(selectedDate);
        document.dispatchEvent(new CustomEvent('dateSelected', { detail: { date: selectedDate } }));
      });
    });
  };

  const renderTimeSlots = (dateStr) => {
    const slotsContainer = document.querySelector('.time-slots-container');
    if (!slotsContainer) return;

    const booked = BOOKED_SLOTS[dateStr] || [];

    slotsContainer.innerHTML = `
      <h4 class="slots-title">Available Times for ${dateStr}</h4>
      <div class="time-slots-grid">
        ${TIME_SLOTS.map(slot => {
          const isBooked = booked.includes(slot);
          return `
            <div class="time-slot ${isBooked ? 'booked' : 'available'}" 
                 data-time="${slot}" ${isBooked ? 'aria-disabled="true"' : ''}>
              <span class="slot-time">${slot}</span>
              <span class="slot-status">${isBooked ? 'Booked' : 'Open'}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;

    slotsContainer.querySelectorAll('.time-slot.available').forEach(slot => {
      slot.addEventListener('click', () => {
        slotsContainer.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        document.dispatchEvent(new CustomEvent('timeSelected', { detail: { time: slot.dataset.time } }));
      });
    });
  };

  const init = (containerSelector = '.availability-calendar') => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();

    renderCalendar(container, currentYear, currentMonth);
  };

  return { init };
})();

// ===== PACKAGE SELECTOR =====
const PackageSelector = (() => {
  let selectedPackage = null;

  const init = () => {
    const cards = document.querySelectorAll('[data-package]');
    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedPackage = card.dataset.package;
        document.dispatchEvent(new CustomEvent('packageSelected', { detail: { package: selectedPackage } }));
      });
    });
  };

  const getSelected = () => selectedPackage;

  return { init, getSelected };
})();

// ===== GUEST COUNTER =====
const GuestCounter = (() => {
  const init = () => {
    document.querySelectorAll('.guest-counter').forEach(counter => {
      const minusBtn = counter.querySelector('.counter-minus');
      const plusBtn = counter.querySelector('.counter-plus');
      const display = counter.querySelector('.counter-value');
      if (!minusBtn || !plusBtn || !display) return;

      const min = parseInt(counter.dataset.min) || 1;
      const max = parseInt(counter.dataset.max) || 100;
      let value = parseInt(display.textContent) || min;

      const update = () => {
        display.textContent = value;
        minusBtn.disabled = value <= min;
        plusBtn.disabled = value >= max;
        counter.dispatchEvent(new CustomEvent('countChange', { detail: { count: value } }));
      };

      minusBtn.addEventListener('click', () => { if (value > min) { value--; update(); } });
      plusBtn.addEventListener('click', () => { if (value < max) { value++; update(); } });
      update();
    });
  };

  return { init };
})();

// ===== INIT ALL =====
const App = {
  init() {
    // Restore body transition after page load
    document.body.style.opacity = '';
    document.body.style.transform = '';
    document.body.style.transition = '';

    ThemeManager.init();
    RTLManager.init();
    Navbar.init();
    ScrollReveal.init();
    AnimatedCounter.init();
    BackToTop.init();
    FormValidator.init();
    ImageZoom.init();
    HeroSlider.init();
    Accordion.init();
    GalleryFilter.init();
    AvailabilityCalendar.init();
    PackageSelector.init();
    GuestCounter.init();
    Particles.init();
  }
};

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

// Export for module usage
window.LittleLux = {
  ThemeManager,
  RTLManager,
  Navbar,
  ScrollReveal,
  AnimatedCounter,
  HeroSlider,
  Accordion,
  ImageZoom,
  BackToTop,
  FormValidator,
  Toast,
  PageTransitions,
  Particles,
  GalleryFilter,
  AvailabilityCalendar,
  PackageSelector,
  GuestCounter,
};
