(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenisInstance = null;

  function boot(name, fn) {
    try { fn(); }
    catch (error) { console.error('[blog:init] ' + name, error); }
  }

  function createNativeSmoothScroll() {
    return {
      scrollTo: function (target) {
        var top = typeof target === 'number' ? target : 0;
        window.scrollTo({ top: top, behavior: 'smooth' });
      },
      on: function () {},
      raf: function () {}
    };
  }

  function initLenis() {
    if (reduceMotion) return;
    if (typeof Lenis !== 'undefined') {
      lenisInstance = new Lenis({
        duration: 1.08,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.15
      });
    } else {
      lenisInstance = createNativeSmoothScroll();
      document.documentElement.classList.add('lenis-fallback');
    }
    window.__blogLenis = lenisInstance;
  }

  function initReadingProgress() {
    var bar = document.getElementById('reading-progress');
    if (!bar) return;
    function update() {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = docHeight > 0 ? (window.scrollY / docHeight * 100) + '%' : '0%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    function update() { btn.classList.toggle('visible', window.scrollY > 500); }
    window.addEventListener('scroll', update, { passive: true });
    btn.addEventListener('click', function () {
      if (lenisInstance) lenisInstance.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    update();
  }

  function initNavScroll() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    function update() { nav.classList.toggle('scrolled', window.scrollY > 60); }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initMobileMenu() {
    var btn = document.getElementById('menuBtn');
    var menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    var open = false;
    btn.addEventListener('click', function () {
      open = !open;
      menu.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        open = false;
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 72;
        if (lenisInstance) lenisInstance.scrollTo(top);
        else window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
  }

  function initReveal() {
    var elements = document.querySelectorAll('.reveal, .motion-reveal');
    if (!elements.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    elements.forEach(function (el) { observer.observe(el); });
  }

  function initStagger() {
    var containers = document.querySelectorAll('.stagger-children, .motion-stagger');
    if (!containers.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion) {
      containers.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    containers.forEach(function (el) { observer.observe(el); });
  }

  function initTextReveal() {
    var elements = document.querySelectorAll('[data-text-reveal]:not(.editorial-hero__title)');
    if (!elements.length) return;
    elements.forEach(function (el) {
      if (el.dataset.revealReady) return;
      var nodes = Array.prototype.slice.call(el.childNodes);
      el.innerHTML = '';
      nodes.forEach(function (node) {
        var wrapper = document.createElement(node.nodeType === 1 ? node.tagName.toLowerCase() : 'span');
        if (node.nodeType === 1) wrapper.className = node.className || '';
        (node.textContent || '').split('').forEach(function (char) {
          var span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00a0' : char;
          wrapper.appendChild(span);
        });
        el.appendChild(wrapper);
      });
      el.dataset.revealReady = 'true';
    });
    setTimeout(function () {
      elements.forEach(function (el) {
        el.querySelectorAll('span span, > span').forEach(function (span, i) {
          span.style.transitionDelay = (i * 0.025) + 's';
        });
        el.classList.add('visible');
      });
    }, reduceMotion ? 0 : 180);
  }

  function initCardClick() {
    document.querySelectorAll('.article-card, .card-article').forEach(function (card) {
      var link = card.querySelector('a[href]');
      if (!link) return;
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return;
        link.click();
      });
    });
  }

  function initPageTransition() {
    document.body.classList.add('page-enter');
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || a.target === '_blank') return;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.add('page-transition-out');
        setTimeout(function () { window.location.href = href; }, reduceMotion ? 0 : 220);
      });
    });
  }

  function initCursorGlow() {
    if (reduceMotion || window.matchMedia('(max-width: 768px)').matches) return;
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    document.addEventListener('mousemove', function (e) {
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
    document.addEventListener('mouseleave', function () { glow.style.opacity = '0'; });
  }

  function initMagneticButtons() {
    if (reduceMotion || window.matchMedia('(max-width: 768px)').matches) return;
    document.querySelectorAll('.editorial-button, a[class*="rounded-full"], button').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.12) + 'px, ' + (y * 0.12) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  function initInkDiffusion() {
    var canvas = document.getElementById('ink-canvas');
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext('2d');
    var drops = [];
    var running = true;

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn() {
      var rect = canvas.parentElement.getBoundingClientRect();
      drops.push({ x: rect.width * (0.18 + Math.random() * 0.64), y: rect.height * (0.18 + Math.random() * 0.62), r: 0, max: 90 + Math.random() * 170, alpha: 0.035 + Math.random() * 0.035, noise: Math.random() * 10 });
    }
    function drawDrop(drop) {
      drop.r += (drop.max - drop.r) * 0.006;
      drop.alpha *= 0.9975;
      ctx.save();
      ctx.globalAlpha = drop.alpha;
      var gradient = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, drop.r);
      gradient.addColorStop(0, 'rgba(212,160,23,0.65)');
      gradient.addColorStop(0.45, 'rgba(146,64,14,0.22)');
      gradient.addColorStop(1, 'rgba(28,25,23,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      for (var i = 0; i <= 40; i++) {
        var angle = i / 40 * Math.PI * 2;
        var wave = Math.sin(angle * 3 + drop.noise) * 0.07 + Math.sin(angle * 7) * 0.035;
        var radius = drop.r * (1 + wave);
        var px = drop.x + Math.cos(angle) * radius;
        var py = drop.y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    function frame() {
      if (!running) return;
      var rect = canvas.parentElement.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      if (drops.length < 7 && Math.random() < 0.025) spawn();
      for (var i = drops.length - 1; i >= 0; i--) {
        drawDrop(drops[i]);
        if (drops[i].alpha < 0.003) drops.splice(i, 1);
      }
      requestAnimationFrame(frame);
    }
    resize();
    spawn();
    spawn();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) frame();
    });
    frame();
  }

  function initNavHighlight() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('nav a[data-nav]');
    if (!sections.length || !navLinks.length) return;
    function update() {
      var scrollPos = window.scrollY + 130;
      var current = '';
      sections.forEach(function (section) { if (section.offsetTop <= scrollPos) current = section.id; });
      navLinks.forEach(function (link) {
        var active = link.getAttribute('href') === '#' + current;
        link.classList.toggle('active', active);
        link.style.color = active ? 'var(--gold)' : '';
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initLazyLoad() {
    var images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;
    if (!('IntersectionObserver' in window)) {
      images.forEach(function (img) { img.src = img.dataset.src; });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.src = entry.target.dataset.src;
        entry.target.removeAttribute('data-src');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '120px' });
    images.forEach(function (img) { observer.observe(img); });
  }

  function initThemeToggle() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    function preferred() {
      var saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
    apply(preferred());
    toggle.addEventListener('click', function () {
      apply((document.documentElement.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark');
    });
  }

  function initTagFilter() {
    var container = document.getElementById('articleTagFilters');
    if (!container) return;
    var buttons = container.querySelectorAll('.tag-filter-btn');
    var articles = document.querySelectorAll('.article-filterable');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        articles.forEach(function (article) {
          var tags = (article.getAttribute('data-tags') || '').split(',');
          var show = filter === 'all' || tags.indexOf(filter) !== -1;
          article.classList.toggle('hidden-filter', !show);
          article.hidden = !show;
        });
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
    });
  }

  function initGSAPAnimations() {
    if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    document.documentElement.classList.add('gsap-active');
    gsap.registerPlugin(ScrollTrigger);
    if (lenisInstance) {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenisInstance.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    gsap.fromTo('.editorial-hero__copy', { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.12 });
    gsap.fromTo('.daily-poem', { autoAlpha: 0, y: 28, rotate: -1.5 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1, ease: 'power3.out', delay: 0.32 });
    gsap.utils.toArray('.section-header').forEach(function (el) {
      gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } });
      var title = el.querySelector('h2');
      if (title) gsap.to(title, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } });
    });
    var staggerSelectors = '.journey-timeline > *, .skills-grid > .card-editorial, .articles-grid > .card-article, .project-card-enhanced, .contact-card, .view-all-btn, .other-abilities-card, .articles-featured';
    gsap.utils.toArray(staggerSelectors).forEach(function (el, i) {
      gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.82, delay: (i % 4) * 0.035, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    gsap.utils.toArray('.brush-stroke').forEach(function (el) {
      gsap.to(el, { scaleX: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    gsap.utils.toArray('.timeline-track, .scroll-line').forEach(function (el) {
      gsap.to(el, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top 75%', end: 'bottom 70%', scrub: true } });
    });
    ScrollTrigger.refresh();
  }

  document.addEventListener('DOMContentLoaded', function () {
    boot('lenis', initLenis);
    boot('readingProgress', initReadingProgress);
    boot('backToTop', initBackToTop);
    boot('navScroll', initNavScroll);
    boot('mobileMenu', initMobileMenu);
    boot('smoothScroll', initSmoothScroll);
    boot('reveal', initReveal);
    boot('stagger', initStagger);
    boot('textReveal', initTextReveal);
    boot('cardClick', initCardClick);
    boot('pageTransition', initPageTransition);
    boot('cursorGlow', initCursorGlow);
    boot('magneticButtons', initMagneticButtons);
    boot('inkDiffusion', initInkDiffusion);
    boot('navHighlight', initNavHighlight);
    boot('lazyLoad', initLazyLoad);
    boot('themeToggle', initThemeToggle);
    boot('tagFilter', initTagFilter);
    boot('gsapAnimations', initGSAPAnimations);
  });
})();