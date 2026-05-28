/* ═══════════════════════════════════════════
   诺诺的小博客空间 · 公共 JS
   文学工坊风格 · 交互增强版
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── 阅读进度条 ───
  function initReadingProgress() {
    var bar = document.getElementById('reading-progress');
    if (!bar) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollTop = window.scrollY;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── 回到顶部 ───
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          btn.classList.toggle('visible', window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── 导航栏滚动状态 ───
  function initNavScroll() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          nav.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
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
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.add('hidden');
        if (open) { open = false; document.body.style.overflow = ''; }
      });
    });
  }

  // ─── 平滑滚动 ───
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offset = target.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      });
    });
  }

  // ─── 滚动入场动画 ───
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (els.length === 0) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.dataset.delay;
          if (delay) {
            setTimeout(function () { entry.target.classList.add('visible'); }, parseInt(delay, 10));
          } else {
            entry.target.classList.add('visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { observer.observe(el); });
    setTimeout(function () {
      els.forEach(function (el) { if (!el.classList.contains('visible')) el.classList.add('visible'); });
    }, 3000);
  }

  // ─── 卡片可点击 ───
  function initCardClick() {
    document.querySelectorAll('.article-card, .card-article').forEach(function (card) {
      var link = card.querySelector('a');
      if (!link) return;
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        link.click();
      });
    });
  }

  // ─── 交错子元素动画 ───
  function initStagger() {
    var els = document.querySelectorAll('.stagger-children');
    if (els.length === 0) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { observer.observe(el); });
    setTimeout(function () {
      els.forEach(function (el) { if (!el.classList.contains('visible')) el.classList.add('visible'); });
    }, 2500);
  }

  // ─── 文字逐字揭示 ───
  function initTextReveal() {
    var elements = document.querySelectorAll('[data-text-reveal]');
    if (elements.length === 0) return;
    elements.forEach(function (el) {
      var text = el.textContent;
      el.innerHTML = '';
      text.split('').forEach(function (char) {
        var span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00a0' : char;
        el.appendChild(span);
      });
    });
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var chars = entry.target.querySelectorAll('span');
          chars.forEach(function (span, i) { span.style.transitionDelay = (i * 0.04) + 's'; });
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    elements.forEach(function (el) { observer.observe(el); });
  }

  // ─── 页面入场动画 ───
  function initPageTransition() {
    document.body.classList.add('page-enter');
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.add('page-transition-out');
        setTimeout(function () { window.location.href = href; }, 280);
      });
    });
  }

  // ─── 光标跟随 ───
  function initCursorGlow() {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var glow = document.createElement('div');
    glow.style.cssText = 'position:fixed;width:300px;height:300px;border-radius:50%;pointer-events:none;z-index:9998;opacity:0;transition:opacity 0.4s;background:radial-gradient(circle,rgba(184,134,11,0.04) 0%,transparent 70%);transform:translate(-50%,-50%);';
    document.body.appendChild(glow);
    var visible = false;
    document.addEventListener('mousemove', function (e) {
      if (!visible) { glow.style.opacity = '1'; visible = true; }
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
    document.addEventListener('mouseleave', function () { glow.style.opacity = '0'; visible = false; });
  }

  // ─── 磁性按钮 ───
  function initMagneticButtons() {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('a[class*="rounded-full"], button').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
        setTimeout(function () { btn.style.transition = ''; }, 400);
      });
    });
  }

  // ─── 墨水扩散动画 ───
  function initInkDiffusion() {
    var canvas = document.getElementById('ink-canvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }
    var ctx = canvas.getContext('2d');
    var inkDrops = [];
    var animating = true;
    var startTime = Date.now();

    function InkDrop(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.maxRadius = 80 + Math.random() * 120;
      this.speed = 0.15 + Math.random() * 0.25;
      this.opacity = 0;
      this.maxOpacity = 0.02 + Math.random() * 0.03;
      this.fadeSpeed = 0.0008 + Math.random() * 0.001;
      this.phase = 0;
      this.holdTime = 120 + Math.random() * 180;
      this.holdCounter = 0;
      this.noiseOffset = Math.random() * 1000;
      this.hueShift = Math.random() * 15 - 7;
    }

    InkDrop.prototype.update = function() {
      if (this.phase === 0) {
        this.radius += this.speed * (1 - this.radius / this.maxRadius);
        this.opacity = Math.min(this.opacity + this.fadeSpeed * 2, this.maxOpacity);
        if (this.radius >= this.maxRadius * 0.85) this.phase = 1;
      } else if (this.phase === 1) {
        this.holdCounter++;
        if (this.holdCounter >= this.holdTime) this.phase = 2;
      } else {
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0) { this.opacity = 0; return true; }
      }
      return false;
    };

    InkDrop.prototype.draw = function(c) {
      if (this.opacity <= 0 || this.radius <= 0) return;
      c.save();
      c.globalAlpha = this.opacity;
      for (var layer = 0; layer < 3; layer++) {
        var lr = this.radius * (1 - layer * 0.15);
        var ox = Math.sin(this.noiseOffset + layer * 2.1) * this.radius * 0.08;
        var oy = Math.cos(this.noiseOffset + layer * 1.7) * this.radius * 0.08;
        var gradient = c.createRadialGradient(this.x + ox, this.y + oy, 0, this.x + ox, this.y + oy, lr);
        var r = Math.round(184 + this.hueShift);
        var g = Math.round(134 + this.hueShift * 0.5);
        var b = Math.round(11 - this.hueShift * 0.3);
        gradient.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ', 0.8)');
        gradient.addColorStop(0.3, 'rgba(' + r + ',' + g + ',' + b + ', 0.4)');
        gradient.addColorStop(0.6, 'rgba(' + r + ',' + g + ',' + b + ', 0.15)');
        gradient.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ', 0)');
        c.fillStyle = gradient;
        c.beginPath();
        var segments = 36;
        for (var i = 0; i <= segments; i++) {
          var angle = (i / segments) * Math.PI * 2;
          var noise = Math.sin(angle * 3 + this.noiseOffset) * 0.08 + Math.sin(angle * 7 + this.noiseOffset * 1.3) * 0.04;
          var rr = lr * (1 + noise);
          var px = this.x + ox + Math.cos(angle) * rr;
          var py = this.y + oy + Math.sin(angle) * rr;
          if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
        }
        c.closePath();
        c.fill();
      }
      c.restore();
    };

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnDrop() {
      var rect = canvas.parentElement.getBoundingClientRect();
      var cx = rect.width * 0.5;
      var cy = rect.height * 0.45;
      var x = cx + (Math.random() - 0.5) * rect.width * 0.7;
      var y = cy + (Math.random() - 0.5) * rect.height * 0.6;
      inkDrops.push(new InkDrop(x, y));
    }

    function animate() {
      if (!animating) return;
      var elapsed = Date.now() - startTime;
      var rect = canvas.parentElement.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      if (inkDrops.length < 8 && elapsed > 500) {
        if (inkDrops.length < 3 && elapsed < 3000) {
          spawnDrop();
        } else if (Math.random() < 0.008) {
          spawnDrop();
        }
      }
      for (var i = inkDrops.length - 1; i >= 0; i--) {
        if (inkDrops[i].update()) { inkDrops.splice(i, 1); }
        else { inkDrops[i].draw(ctx); }
      }
      requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) { animating = false; }
      else { animating = true; startTime = Date.now(); animate(); }
    });
    animate();
  }


  // ─── 导航区域高亮 ───
  function initNavHighlight() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('nav a[data-nav]');
    if (sections.length === 0 || navLinks.length === 0) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollPos = window.scrollY + 120;
          var currentSection = '';
          sections.forEach(function (section) {
            if (section.offsetTop <= scrollPos) {
              currentSection = section.getAttribute('id');
            }
          });
          navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            var isActive = href === '#' + currentSection;
            if (isActive) {
              link.style.color = '#b8860b';
              link.classList.add('active');
            } else {
              link.style.color = '';
              link.classList.remove('active');
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── 图片懒加载 ───
  function initLazyLoad() {
    var images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;
    if (!('IntersectionObserver' in window)) {
      images.forEach(function (img) { img.src = img.dataset.src; });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.src = entry.target.dataset.src;
          entry.target.removeAttribute('data-src');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '100px' });
    images.forEach(function (img) { observer.observe(img); });
  }

  // ─── 启动 ───
  document.addEventListener('DOMContentLoaded', function () {
    initReadingProgress();
    initBackToTop();
    initNavScroll();
    initMobileMenu();
    initSmoothScroll();
    initReveal();
    initStagger();
    initTextReveal();
    initCardClick();
    initPageTransition();
    initCursorGlow();
    initMagneticButtons();
    initInkDiffusion();
    initNavHighlight();
    initLazyLoad();
  });

})();
