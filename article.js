(function(){
  'use strict';
  var header=document.querySelector('[data-header]');
  var theme=document.querySelector('[data-theme-toggle]');
  var progress=document.querySelector('.article-progress span');
  var article=document.querySelector('.article-prose');
  var tocLinks=Array.prototype.slice.call(document.querySelectorAll('[data-toc]'));
  var sections=Array.prototype.slice.call(document.querySelectorAll('[data-article-section], #opening'));
  var topButton=document.querySelector('[data-back-top]');
  function setTheme(value){document.documentElement.dataset.theme=value;localStorage.setItem('nuo-demo-theme',value);document.querySelector('meta[name="theme-color"]').content=value==='dark'?'#0d1318':'#ffffff';}
  if(theme)theme.addEventListener('click',function(){setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark')});
  function updateActiveSection(){var marker=scrollY+innerHeight*.34;var current=sections[0]?sections[0].id:'';sections.forEach(function(section){var top=section.getBoundingClientRect().top+scrollY;if(top<=marker)current=section.id});if(current)mark(current)}
  function update(){
    var y=scrollY;
    if(header)header.classList.toggle('is-scrolled',y>20);
    if(topButton)topButton.classList.toggle('is-visible',y>700);
    if(article&&progress){var articleTop=article.getBoundingClientRect().top+y;var end=articleTop+article.offsetHeight-innerHeight;var value=end>articleTop?Math.max(0,Math.min(1,(y-articleTop)/(end-articleTop))):0;progress.style.transform='scaleX('+value+')';document.documentElement.style.setProperty('--toc-progress',(value*100)+'%');}
    updateActiveSection();
  }
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
  if(topButton)topButton.addEventListener('click',function(){scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
  function mark(id){tocLinks.forEach(function(a){var active=a.getAttribute('href')==='#'+id;a.classList.toggle('is-active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
})();
