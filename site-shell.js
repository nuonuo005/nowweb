(function () {
  'use strict';
  var header = document.querySelector('[data-header]');
  var theme = document.querySelector('[data-theme-toggle]');
  var menu = document.querySelector('[data-menu-toggle]');
  var mobile = document.getElementById('mobile-menu');
  function setTheme(value) {
    document.documentElement.dataset.theme = value;
    try { localStorage.setItem('nuo-demo-theme', value); } catch (error) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = value === 'dark' ? '#0d1318' : '#ffffff';
  }
  if (theme) theme.addEventListener('click', function () {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  function closeMenu() {
    if (!menu || !mobile) return;
    menu.setAttribute('aria-expanded', 'false');
    mobile.hidden = true;
    document.body.classList.remove('menu-open');
  }
  if (menu && mobile) {
    menu.addEventListener('click', function () {
      var open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      mobile.hidden = !open;
      document.body.classList.toggle('menu-open', open);
    });
    mobile.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        closeMenu(); menu.focus();
      }
    });
    addEventListener('resize', function () { if (innerWidth > 859) closeMenu(); });
  }
  function update() { if (header) header.classList.toggle('is-scrolled', scrollY > 20); }
  addEventListener('scroll', update, { passive: true });
  update();
})();
