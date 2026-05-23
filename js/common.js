/* ═══════════════════════════════════════════
   诺诺的小博客空间 · 公共 JS
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── 阅读进度条 ───
  function initReadingProgress() {
    var bar = document.getElementById('reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
    });
  }

  // ─── 回到顶部 ───
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 600);
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── 导航滚动阴影 ───
  function initNavShadow() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('shadow-md', window.scrollY > 50);
    });
  }

  // ─── 移动端菜单 ───
  function initMobileMenu() {
    var btn = document.getElementById('menuBtn');
    var menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    var open = false;
    btn.addEventListener('click', function () {
      open = !open;
      menu.classList.toggle('hidden');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // 点击菜单项后关闭
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.add('hidden');
        if (open) { open = false; document.body.style.overflow = ''; }
      });
    });
  }

  // ─── 平滑滚动（锚点链接） ───
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
        }
      });
    });
  }

  // ─── 滚动入场动画（核心！） ───
  function initReveal() {
    var revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    // 如果浏览器不支持 IntersectionObserver，直接显示所有元素
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );
    revealElements.forEach(function (el) { observer.observe(el); });

    // 安全兜底：2秒后如果还有未显示的元素，强制全部显示
    setTimeout(function () {
      revealElements.forEach(function (el) {
        if (!el.classList.contains('visible')) {
          el.classList.add('visible');
        }
      });
    }, 2000);
  }

  // ─── 整张卡片可点击 ───
  function initCardClick() {
    document.querySelectorAll('.article-card').forEach(function (card) {
      var link = card.querySelector('a');
      if (!link) return;
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        link.click();
      });
    });
  }

  // ─── 启动 ───
  document.addEventListener('DOMContentLoaded', function () {
    initReadingProgress();
    initBackToTop();
    initNavShadow();
    initMobileMenu();
    initSmoothScroll();
    initReveal();
    initCardClick();
  });

})();
