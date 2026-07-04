/* AXIS Design Lab — main.js */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme toggle ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0b0d10' : '#faf9f5');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('axis-theme', next); } catch (e) { /* private mode */ }
    });
  }

  /* ---------- mobile menu ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');

  function closeMenu(restoreFocus) {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      if (restoreFocus) menuToggle.focus();
    }
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var open = !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) {
        var first = navLinks.querySelector('a');
        if (first) first.focus();
      }
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu(true);
    });
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu(false);
      }
    });
  }

  /* ---------- nav shrink on scroll ---------- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    // the short footer can never win the intersection contest, so pin it manually
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      setActive('contact');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- scrollspy ---------- */
  var spyTargets = ['home', 'research', 'publications', 'professor', 'members', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var linkFor = {};
  document.querySelectorAll('.nav-link').forEach(function (a) {
    var id = (a.getAttribute('href') || '').replace('#', '');
    if (id) linkFor[id] = a;
  });

  function setActive(id) {
    Object.keys(linkFor).forEach(function (key) {
      linkFor[key].classList.toggle('is-active', key === id);
    });
  }

  if ('IntersectionObserver' in window && spyTargets.length) {
    var currentVisible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        currentVisible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      var best = null, bestRatio = 0;
      spyTargets.forEach(function (t) {
        var r = currentVisible[t.id] || 0;
        if (r > bestRatio) { bestRatio = r; best = t.id; }
      });
      if (best) setActive(best);
    }, { rootMargin: '-72px 0px -35% 0px', threshold: [0.05, 0.2, 0.5] });
    spyTargets.forEach(function (t) { spy.observe(t); });
  }
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---------- publications filter ---------- */
  var filterButtons = document.querySelectorAll('.pub-filter');
  var pubs = document.querySelectorAll('.pub');
  var yearGroups = document.querySelectorAll('.pub-year-group');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      pubs.forEach(function (p) {
        var show = filter === 'all' || p.getAttribute('data-type') === filter;
        p.classList.toggle('is-hidden', !show);
      });
      yearGroups.forEach(function (g) {
        var visible = g.querySelectorAll('.pub:not(.is-hidden)').length > 0;
        g.classList.toggle('is-empty', !visible);
      });
    });
  });

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- oscilloscope hero canvas ---------- */
  var canvas = document.getElementById('scope');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var width = 0, height = 0;
    var running = false;
    var rafId = null;
    var t = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function themeColors() {
      var light = document.documentElement.getAttribute('data-theme') === 'light';
      var dim = width < 640 ? 0.62 : 1; // keep hero text readable on phones
      return {
        analog: light ? 'rgba(235, 110, 30, ' + (0.55 * dim) + ')' : 'rgba(255, 138, 61, ' + (0.62 * dim) + ')',
        analogGlow: light ? 'rgba(235, 110, 30, ' + (0.25 * dim) + ')' : 'rgba(255, 138, 61, ' + (0.4 * dim) + ')',
        digital: light ? 'rgba(45, 111, 209, ' + (0.34 * dim) + ')' : 'rgba(91, 168, 255, ' + (0.3 * dim) + ')'
      };
    }

    // analog waveform: layered sines with a slow breathing envelope
    function signal(x, time) {
      var k = (Math.PI * 2) / Math.max(width, 1);
      var env = 0.72 + 0.28 * Math.sin(time * 0.00042 + x * k * 0.8);
      return (
        Math.sin(x * k * 2.2 - time * 0.0011) * 0.62 +
        Math.sin(x * k * 4.4 - time * 0.0019 + 1.3) * 0.22 +
        Math.sin(x * k * 8.8 + time * 0.0007) * 0.08
      ) * env;
    }

    function draw(now) {
      t = now;
      ctx.clearRect(0, 0, width, height);
      var colors = themeColors();
      var midY = height * 0.5;
      var amp = Math.min(height * 0.16, 150);

      // quantized staircase trace (the "digital" echo of the analog wave)
      var stepPx = Math.max(18, width / 56);
      var levels = 14;
      ctx.beginPath();
      var firstY = null;
      for (var sx = 0; sx <= width + stepPx; sx += stepPx) {
        var v = signal(sx, now - 900);
        var q = Math.round(v * levels) / levels;
        var y = midY + q * amp;
        if (firstY === null) { ctx.moveTo(sx, y); firstY = y; }
        else { ctx.lineTo(sx, y); }
        ctx.lineTo(sx + stepPx, y);
      }
      ctx.strokeStyle = colors.digital;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // analog trace: a wide translucent under-stroke fakes the glow far
      // cheaper than per-frame shadowBlur on a full-viewport path
      ctx.beginPath();
      for (var x = 0; x <= width; x += 3) {
        var yy = midY + signal(x, now) * amp;
        if (x === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.strokeStyle = colors.analogGlow;
      ctx.lineWidth = 7;
      ctx.stroke();
      ctx.strokeStyle = colors.analog;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function loop(now) {
      draw(now);
      rafId = running ? requestAnimationFrame(loop) : null;
    }

    function start() {
      if (running || prefersReducedMotion) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }

    resize();
    if (prefersReducedMotion) {
      draw(4200); // single static frame
    } else {
      if ('IntersectionObserver' in window) {
        var heroObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) start();
            else stop();
          });
        }, { threshold: 0.02 });
        heroObs.observe(canvas);
      } else {
        start();
      }
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop();
        else if (canvas.getBoundingClientRect().bottom > 0) start();
      });
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        if (!running) draw(t || 4200);
      }, 120);
    });

    // repaint the paused/static frame when the theme changes
    if ('MutationObserver' in window) {
      new MutationObserver(function () {
        if (!running) draw(t || 4200);
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
  }
})();
