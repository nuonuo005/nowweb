(function () {
  'use strict';

  document.documentElement.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var openingIntro = document.querySelector('[data-opening-intro]');
  var openingVideo = document.querySelector('[data-intro-video]');
  var introSkip = document.querySelector('[data-intro-skip]');
  var introFinished = false;
  var header = document.querySelector('[data-header]');
  var progress = document.querySelector('.reading-progress span');
  var hero = document.querySelector('.hero');
  var themeToggle = document.querySelector('[data-theme-toggle]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.getElementById('mobile-menu');
  var skyVideo = document.querySelector('.sky-video');
  var heroVisual = document.querySelector('[data-hero-visual]');

  function finishIntro() {
    if (introFinished) return;
    introFinished = true;
    try { localStorage.setItem('nuo-demo-intro-seen', '1'); } catch (error) { /* Keep the page usable without storage. */ }
    document.documentElement.classList.remove('intro-pending');
    if (hero) hero.classList.add('is-ready');
    if (!openingIntro) return;
    openingIntro.classList.add('is-leaving');
    openingIntro.setAttribute('aria-hidden', 'true');
    if (openingVideo) openingVideo.pause();
    window.setTimeout(function () {
      openingIntro.classList.add('is-finished');
    }, reduceMotion.matches ? 200 : 680);
  }

  function initOpeningIntro() {
    if (document.documentElement.classList.contains('intro-seen')) {
      finishIntro();
      return;
    }
    if (!openingIntro) {
      document.documentElement.classList.remove('intro-pending');
      if (hero) hero.classList.add('is-ready');
      return;
    }
    if (introSkip) introSkip.addEventListener('click', finishIntro);
    if (openingVideo && !reduceMotion.matches) {
      var play = openingVideo.play();
      if (play && typeof play.then === 'function') {
        play.then(function () { openingVideo.classList.add('is-playing'); }).catch(function () {});
      }
    }
    window.setTimeout(finishIntro, reduceMotion.matches ? 350 : 1750);
  }

  initOpeningIntro();

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('nuo-demo-theme', theme);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#11171c' : '#ffffff');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  function closeMenu() {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      mobileMenu.hidden = open;
      document.body.classList.toggle('menu-open', !open);
      if (!open) {
        var first = mobileMenu.querySelector('a');
        if (first) first.focus();
      }
    });
    mobileMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  function updateScrollState() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (progress) {
      var total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, y / total)) + ')';
    }
  }
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState);
  updateScrollState();

  if (!openingIntro) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (hero) hero.classList.add('is-ready');
      });
    });
  }

  function maybePlayVideo() {
    if (!skyVideo) return;
    if (reduceMotion.matches || window.innerWidth < 720 || document.hidden) {
      skyVideo.pause();
      skyVideo.classList.remove('is-playing');
      return;
    }
    var play = skyVideo.play();
    if (play && typeof play.then === 'function') {
      play.then(function () { skyVideo.classList.add('is-playing'); }).catch(function () {});
    }
  }
  maybePlayVideo();
  reduceMotion.addEventListener('change', maybePlayVideo);
  window.addEventListener('resize', maybePlayVideo);
  document.addEventListener('visibilitychange', maybePlayVideo);

  if (heroVisual && finePointer.matches && !reduceMotion.matches) {
    var bridge = heroVisual.querySelector('.bridge-layer');
    var frame = heroVisual.querySelector('.sky-frame');
    heroVisual.addEventListener('pointermove', function (event) {
      var rect = heroVisual.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - .5;
      var y = (event.clientY - rect.top) / rect.height - .5;
      if (bridge) {
        bridge.style.setProperty('--bridge-x', (x * 7).toFixed(2) + 'px');
        bridge.style.setProperty('--bridge-y', (y * 4).toFixed(2) + 'px');
      }
      if (frame) {
        frame.style.setProperty('--glint-x', ((x + .5) * 100).toFixed(1) + '%');
        frame.style.setProperty('--glint-y', ((y + .5) * 100).toFixed(1) + '%');
      }
    }, { passive: true });
    heroVisual.addEventListener('pointerleave', function () {
      if (bridge) {
        bridge.style.setProperty('--bridge-x', '0px');
        bridge.style.setProperty('--bridge-y', '0px');
      }
    });
  }

  var revealElements = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    revealElements.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  }

  var chapters = Array.prototype.slice.call(document.querySelectorAll('[data-chapter]'));
  var chapterLinks = Array.prototype.slice.call(document.querySelectorAll('[data-chapter-link]'));
  function markChapter(id) {
    chapterLinks.forEach(function (link) {
      var active = link.dataset.chapterLink === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window && chapters.length) {
    var chapterObserver = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; }).sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (visible[0]) markChapter(visible[0].target.dataset.chapter);
    }, { rootMargin: '-30% 0px -52% 0px', threshold: [0, .1, .25, .5] });
    chapters.forEach(function (chapter) { chapterObserver.observe(chapter); });
  }
  markChapter(null);

  var articleScene = document.querySelector('.scene--articles');
  if (articleScene) {
    var articleImages = Array.prototype.slice.call(articleScene.querySelectorAll('.scene-image'));
    var previewTitle = articleScene.querySelector('[data-preview-title]');
    var previewMeta = articleScene.querySelector('[data-preview-meta]');
    var previewIndex = articleScene.querySelector('[data-scene-index]');
    var previewTargets = document.querySelectorAll('[data-article-preview]');

    function showArticlePreview(target) {
      var index = Number(target.dataset.articlePreview || 0);
      articleImages.forEach(function (image, i) { image.classList.toggle('is-active', i === index); });
      if (previewIndex) previewIndex.textContent = String(index + 1).padStart(2, '0');
      if (previewTitle) previewTitle.textContent = target.dataset.title || '重装电脑后的两天，把工作重新接起来';
      if (previewMeta) previewMeta.textContent = target.dataset.meta || '工作日志 #007 · 2026.08.25';
    }
    previewTargets.forEach(function (target) {
      target.addEventListener('pointerenter', function () { showArticlePreview(target); });
      target.addEventListener('focusin', function () { showArticlePreview(target); });
    });
  }

  var projectEntries = Array.prototype.slice.call(document.querySelectorAll('[data-project]'));
  var projectImages = Array.prototype.slice.call(document.querySelectorAll('.screen-images img'));
  var projectTitle = document.querySelector('[data-project-title]');
  var projectDomain = document.querySelector('[data-project-domain]');
  var projectData = [
    { title: 'Ogden 850 · 打字学英语', domain: 'typing-english.html' },
    { title: '语音转写 · 本地语音输入工具', domain: 'yuyin-zhuanxie.html' }
  ];
  function showProject(index) {
    projectEntries.forEach(function (entry, i) { entry.classList.toggle('is-active', i === index); });
    projectImages.forEach(function (image, i) { image.classList.toggle('is-active', i === index); });
    if (projectTitle) projectTitle.textContent = projectData[index].title;
    if (projectDomain) projectDomain.textContent = projectData[index].domain;
  }
  projectEntries.forEach(function (entry, index) {
    entry.addEventListener('pointerenter', function () { showProject(index); });
    entry.addEventListener('focusin', function () { showProject(index); });
  });

  var timelineItems = Array.prototype.slice.call(document.querySelectorAll('.timeline li'));
  var yearDisplay = document.querySelector('[data-year-display]');
  var horizon = document.querySelector('.horizon-line');
  var yearPositions = ['0%', '48%', 'calc(100% - 42px)'];
  function showYear(index) {
    timelineItems.forEach(function (item, i) { item.classList.toggle('is-active', i === index); });
    if (yearDisplay) yearDisplay.textContent = timelineItems[index].dataset.year;
    if (horizon) horizon.style.setProperty('--year-pos', yearPositions[index]);
  }
  timelineItems.forEach(function (item, index) {
    item.addEventListener('pointerenter', function () { showYear(index); });
    item.addEventListener('focusin', function () { showYear(index); });
  });
  showYear(0);

  var easter = document.querySelector('[data-easter]');
  if (easter) {
    var contactSky = easter.closest('.contact-sky');
    var timer;
    easter.addEventListener('click', function () {
      contactSky.classList.remove('is-awake');
      void contactSky.offsetWidth;
      contactSky.classList.add('is-awake');
      clearTimeout(timer);
      timer = setTimeout(function () { contactSky.classList.remove('is-awake'); }, 1600);
    });
  }
})();
