(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const form = document.getElementById('rsvp-form');
  const formStatus = document.getElementById('form-status');
  const langButtons = document.querySelectorAll('.lang-btn');

  let currentLang = localStorage.getItem('wedding-lang') || 'en';

  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  function applyLanguage(lang) {
    const strings = window.WEDDING_I18N[lang];
    if (!strings) return;

    currentLang = lang;
    localStorage.setItem('wedding-lang', lang);
    document.documentElement.lang = lang;

    document.title = strings.meta.title;
    document.querySelector('meta[name="description"]').content = strings.meta.description;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = getNestedValue(strings, el.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = getNestedValue(strings, el.dataset.i18nHtml);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = getNestedValue(strings, el.dataset.i18nPlaceholder);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', getNestedValue(strings, el.dataset.i18nAria));
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.title = getNestedValue(strings, el.dataset.i18nTitle);
    });

    langButtons.forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });

    if (navToggle && !navLinks.classList.contains('open')) {
      navToggle.setAttribute(
        'aria-label',
        getNestedValue(strings, 'nav.openMenu')
      );
    }
  }

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  applyLanguage(currentLang);

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    const strings = window.WEDDING_I18N[currentLang];
    navToggle.setAttribute(
      'aria-label',
      isOpen ? strings.nav.closeMenu : strings.nav.openMenu
    );
  });

  navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', window.WEDDING_I18N[currentLang].nav.openMenu);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => observer.observe(section));

  if (form) {
    form.addEventListener('submit', async (e) => {
      const strings = window.WEDDING_I18N[currentLang].rsvp;
      const action = form.getAttribute('action');

      if (action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        formStatus.textContent = strings.notConnected;
        formStatus.className = 'form-note error';
        return;
      }

      e.preventDefault();
      formStatus.textContent = strings.sending;
      formStatus.className = 'form-note';

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          form.reset();
          formStatus.textContent = strings.success;
          formStatus.className = 'form-note success';
        } else {
          throw new Error('Submission failed');
        }
      } catch {
        formStatus.textContent = strings.error;
        formStatus.className = 'form-note error';
      }
    });
  }
})();
