/* AXIS Design Lab — main.js */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme toggle ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // the nav and hero stay dark in both themes, so the browser chrome does too
    if (themeMeta) themeMeta.setAttribute('content', '#0b0d10');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('axis-theme', next); } catch (e) { /* private mode */ }
    });
  }

  /* ---------- language toggle (EN / KO) ---------- */
  /* English is the source of truth in the HTML; this dictionary only holds
     Korean. On load the English strings are captured from the DOM so the
     toggle can swap back without a reload. */
  var KO = {
    'nav.home': '홈',
    'nav.research': '연구',
    'nav.publications': '논문',
    'nav.professor': '교수',
    'nav.members': '구성원',
    'nav.contact': '연락처',
    'hero.tagline': 'AXIS 설계연구실 — 아날로그·혼성신호 집적회로의 중심축이 되는 연구실입니다.',
    'hero.desc': '정밀 아날로그 회로, 데이터 컨버터, 전력관리 IC, 그리고 AI 시스템을 위한 회로까지 아우르며, 성능과 효율의 한계를 넓히는 다목적 집적회로와 시스템을 연구합니다.',
    'hero.cta.explore': '연구 분야 보기',
    'hero.cta.join': '연구실 지원',
    'mission.eyebrow': '미션',
    'mission.title': '모든 축에서 —<br>정밀하게, 효율적으로, 작게, 강인하게.',
    'mission.body': 'AXIS는 정밀 아날로그 프런트엔드부터 고해상도 데이터 컨버터, 전력관리 IC, AI 시스템을 위한 회로까지 폭넓은 집적회로와 시스템을 설계합니다. 연구실 이름의 X는 변수입니다. 응용은 계속 달라지지만 기준은 달라지지 않습니다 — 정확도, 에너지 효율, 소형화, 그리고 강건성.',
    'recruit.title': '신입 연구원 모집',
    'recruit.desc': '열정 있는 <strong>석사</strong>·<strong>박사</strong> 과정 및 <strong>박사후연구원</strong>을 모집합니다. <a href="mailto:jrhee@gachon.ac.kr">jrhee@gachon.ac.kr</a>로 연락해 주세요.',
    'research.eyebrow': '연구 분야',
    'research.title': '무엇을 연구하는가',
    'research.lede': 'AXIS는 초저전력·고정밀 센서 인터페이스, 전력관리·에너지 하베스팅, 데이터 컨버터, 그리고 엣지 AI·인-센서 컴퓨팅을 위한 혼성신호 집적회로를 연구합니다. 우리의 미션은 네 개의 축 위에 있습니다 — 시간과 온도에도 유지되는 정확도, 시스템 수준의 에너지 효율, 소형·고집적 설계, 그리고 실환경에서의 강건성.',
    'focus.label': '핵심 주제',
    'theme1.title': '전력관리·에너지 하베스팅 IC',
    'theme1.body': '배터리 제약이 있거나 배터리 없이 동작하는 분산 센서·엣지 디바이스를 위한 PMIC를 연구합니다. 자율 스타트업, 적응형 전력 추적 알고리즘, 보호·안전 기능을 내장한 멀티모드 DC–DC 변환을 다루며, LDO와 정밀 기준회로(BGR)를 이용한 온칩 레귤레이션, AI 서버·HBM 스택을 위한 전력 전달도 연구합니다.',
    'theme1.focus': '에너지 부족 소스의 스타트업 · 최대전력추적 제어 · 모드 전환 효율 · 온칩 레귤레이션(LDO) · 정밀 기준회로(BGR) · AI 서버 / HBM 전력 전달.',
    'theme2.title': '정밀 아날로그·센서 인터페이스',
    'theme2.body': '환경·산업·바이오 센싱을 위한 저전력·저드리프트 아날로그 프런트엔드를 설계합니다. 온도와 수명 전반의 정확도, 센서 소스 특성에 맞춘 입력단, 간섭에 대한 강건성에 중점을 둡니다.',
    'theme2.focus': '정밀 증폭 · 소스 특성에 맞춘 리드아웃 · 캘리브레이션과 시스템 수준 선형성.',
    'theme3.title': '데이터 컨버터 (ADC / DAC)',
    'theme3.body': '센싱·계측에 특화된 고효율 데이터 컨버터를 개발합니다. 응용별로 아키텍처를 선택해 낮은 공급 전압에서 높은 유효 해상도를 달성하고, 아날로그 프런트엔드·디지털 후처리와 공동 최적화합니다.',
    'theme3.focus': '컨버터-시스템 공동 설계 · 다이내믹 레인지 관리 · 백그라운드 캘리브레이션 · 동작 모델부터 실리콘까지의 검증.',
    'theme4.title': '인-센서 컴퓨팅·엣지 AI',
    'theme4.body': '데이터 이동과 에너지를 줄이는 근센서 아날로그 전처리와 저비용 특징 추출을 탐구합니다. 센싱 방식과 후단 디지털 파이프라인에 맞춰 공동 최적화합니다.',
    'theme4.focus': '아날로그 도메인 전처리 · 이벤트 구동 캡처 · 포토닉·저항성·용량성 센서를 위한 표준 인터페이스.',
    'pubs.eyebrow': '대표 논문',
    'pubs.title': '논문',
    'pubs.note': '저널·학회 논문 <b>28</b>편 · <i class="ast">*</i> 교신저자',
    'pubs.filter.all': '전체',
    'pubs.filter.journal': '저널',
    'pubs.filter.conf': '학회',
    'prof.eyebrow': '지도교수',
    'prof.title': '교수',
    'prof.role': '조교수',
    'prof.dept': '가천대학교 시스템반도체학과',
    'label.email': '이메일',
    'label.tel': '전화',
    'label.office': '연구실',
    'edu.label': '학력',
    'edu1.deg': '박사, 전기·정보공학부',
    'edu1.inst': '서울대학교, 서울',
    'edu2.deg': '석사(M.Eng.), 전기공학',
    'edu2.inst': '토론토대학교, 캐나다',
    'edu3.deg': '학사, 전기·컴퓨터공학',
    'edu3.inst': '토론토대학교, 캐나다',
    'exp.label': '경력',
    'exp0.when': '2022.09 – 현재',
    'exp0.deg': '조교수',
    'exp0.inst': '가천대학교 시스템반도체학과, 성남',
    'exp1.deg': '스태프 엔지니어',
    'exp1.inst': '삼성전자, 화성',
    'exp2.deg': '박사후연구원',
    'exp2.inst': '서울대학교, 서울',
    'interests.label': '연구 관심 분야',
    'int1': '정밀 아날로그 회로',
    'int2': '고정밀 아날로그-디지털 변환기 (ADC)',
    'int3': '전력관리 집적회로 (PMIC)',
    'int4': '디지털 보조 아날로그/혼성신호 회로',
    'int5': '디지털 캘리브레이션·보정 기법',
    'members.eyebrow': '구성원',
    'members.title': '연구실 멤버',
    'members.lede': 'AXIS 설계연구실에는 정밀 아날로그 설계, 데이터 컨버터, 전력관리, 인-센서 컴퓨팅을 연구하는 대학원 연구원들이 함께하고 있습니다.',
    'members.grad': '대학원 연구원',
    'members.ugrad': '학부 연구원',
    'role.msphd': '석박사 통합과정',
    'role.ms': '석사과정',
    'role.bs': '학부연구생',
    'openings.title': '모집 안내',
    'openings.desc': '아날로그/혼성신호 IC 설계에 관심 있는 석·박사 과정 및 박사후연구원의 지원 문의를 환영합니다. CV와 간단한 관심 분야 소개를 <a href="mailto:jrhee@gachon.ac.kr">jrhee@gachon.ac.kr</a>로 보내 주세요.',
    'openings.btn': '이메일로 지원하기',
    'footer.brand': 'Analog X Integrated Systems 설계연구실 · 가천대학교 시스템반도체학과, 경기도 성남시, 대한민국.',
    'footer.contact': '연락처',
    'footer.navigate': '바로가기',
    'footer.top': '↑ 맨 위로'
  };

  var langToggle = document.getElementById('langToggle');
  var EN = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (!(key in EN)) EN[key] = el.innerHTML;
  });

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang === 'ko' ? 'ko' : 'en');
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var html = lang === 'ko' ? KO[key] : EN[key];
      if (html !== undefined) el.innerHTML = html;
    });
    if (langToggle) {
      langToggle.textContent = lang === 'ko' ? 'EN' : 'KO';
      langToggle.setAttribute('aria-label', lang === 'ko' ? 'View in English' : '한국어로 보기');
    }
  }

  var initialLang = 'en';
  try {
    var storedLang = localStorage.getItem('axis-lang');
    if (storedLang === 'ko' || storedLang === 'en') initialLang = storedLang;
    else if ((navigator.language || '').toLowerCase().indexOf('ko') === 0) initialLang = 'ko';
  } catch (e) { /* private mode */ }
  if (initialLang === 'ko') applyLang('ko');

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('lang') === 'ko' ? 'en' : 'ko';
      applyLang(next);
      try { localStorage.setItem('axis-lang', next); } catch (e) { /* private mode */ }
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
      // the hero is dark in both themes, so the traces always use the dark palette
      var dim = width < 640 ? 0.62 : 1; // keep hero text readable on phones
      return {
        analog: 'rgba(255, 138, 61, ' + (0.62 * dim) + ')',
        analogGlow: 'rgba(255, 138, 61, ' + (0.4 * dim) + ')',
        digital: 'rgba(91, 168, 255, ' + (0.3 * dim) + ')'
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
  }
})();
