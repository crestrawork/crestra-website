/* crestra – main.js */
(() => {
  const d = document, root = d.documentElement;
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const hatGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ---------- Lenis + GSAP ---------- */
  let lenis = null;
  // Handy: Ein-/Ausblenden der Adressleiste löst sonst Neuberechnung aus, gepinnte Szenen springen.
  if (hatGsap) { gsap.registerPlugin(ScrollTrigger); ScrollTrigger.config({ ignoreMobileResize: true }); }
  /* Kein Lenis mehr (9.11.2026: Nils fand das Nachgleiten zäh) – normales Scrollen */
  const nachLaden = () => hatGsap && ScrollTrigger.refresh();
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(nachLaden);
  addEventListener('load', nachLaden);

  /* ---------- Kopfzeile, Fortschritt, Sticky-CTA ---------- */
  const kopf = $('.kopf'), fort = $('.fortschritt'), kc = $('.klebe-cta');
  const ziel = $('#anfrage') || $('.fuss');
  const dunkle = $$('[data-dunkel], .fuss');
  const beimScrollen = () => {
    const y = scrollY, h = d.documentElement.scrollHeight - innerHeight;
    if (kopf) kopf.classList.toggle('linie', y > 8);
    if (kopf) {
      const yk = 36;
      kopf.classList.toggle('dunkel', (d.body.classList.contains('seite-dunkel') || d.body.classList.contains('seite-apple')) || dunkle.some(e => { if (!e.hasAttribute('data-dunkel') && !e.classList.contains('fuss')) return false; const r = e.getBoundingClientRect(); return r.top <= yk && r.bottom > yk; }));
    }
    if (fort) fort.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
    if (kc) {
      const zielTop = ziel ? ziel.getBoundingClientRect().top : Infinity;
      kc.classList.toggle('sichtbar', y > innerHeight * 0.7 && zielTop > innerHeight * 0.9);
    }
  };
  addEventListener('scroll', beimScrollen, { passive: true });
  beimScrollen();

  /* ---------- Ausklappmenü ---------- */
  $$('.aus').forEach(a => {
    const b = $('button', a);
    const setze = o => { a.classList.toggle('offen', o); b.setAttribute('aria-expanded', o); };
    b.addEventListener('click', e => { e.stopPropagation(); setze(!a.classList.contains('offen')); });
    if (matchMedia('(hover:hover)').matches) {
      let t;
      a.addEventListener('mouseenter', () => { clearTimeout(t); setze(true); });
      a.addEventListener('mouseleave', () => { t = setTimeout(() => setze(false), 160); });
    }
    d.addEventListener('click', e => { if (!a.contains(e.target)) setze(false); });
    a.addEventListener('keydown', e => { if (e.key === 'Escape') { setze(false); b.focus(); } });
  });

  /* ---------- Handy-Menü ---------- */
  const burger = $('.burger');
  if (burger) {
    const menue = $('.menue');
    const setze = o => {
      root.classList.toggle('menue-offen', o);
      burger.setAttribute('aria-expanded', o);
      burger.setAttribute('aria-label', o ? 'Menü schließen' : 'Menü öffnen');
      menue.setAttribute('aria-hidden', !o);
      $$('a', menue).forEach((l, i) => { l.style.transitionDelay = o ? `${60 + i * 35}ms` : '0ms'; l.tabIndex = o ? 0 : -1; });
      if (lenis) o ? lenis.stop() : lenis.start();
      d.body.style.overflow = o ? 'hidden' : '';
    };
    setze(false);
    burger.addEventListener('click', () => setze(!root.classList.contains('menue-offen')));
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menue-offen')) { setze(false); burger.focus(); } });
  }

  /* ---------- Seitenübergang + Intro ---------- */
  const vorhang = $('.vorhang');
  if (vorhang && !ruhig) {
    d.addEventListener('click', e => {
      const a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const href = a.getAttribute('href') || '';
      if (a.target || a.hasAttribute('download') || !/\.html(\?|$)/.test(href) || /^(https?:|mailto:|tel:)/.test(href)) return;
      e.preventDefault();
      vorhang.classList.remove('raus'); vorhang.classList.add('rein');
      setTimeout(() => { location.href = a.href; }, 430);
    });
    addEventListener('pageshow', e => { if (e.persisted) vorhang.classList.remove('rein', 'raus'); });
  }
  const intro = $('.intro');
  if (intro) {
    let gesehen = false;
    try { gesehen = sessionStorage.getItem('crestra-intro') === '1'; sessionStorage.setItem('crestra-intro', '1'); } catch (e) { gesehen = true; }
    if (gesehen || ruhig || !hatGsap) intro.remove();
    else {
      const m = $('.marke', intro);
      gsap.timeline({ onComplete: () => intro.remove() })
        .from(m, { y: 24, opacity: 0, duration: .6, ease: 'expo.out' })
        .to(m, { y: -16, opacity: 0, duration: .35, ease: 'power2.in' }, '+=.35')
        .to(intro, { opacity: 0, duration: .35, ease: 'power2.out' }, '-=.1');
    }
  }

  /* ---------- Knöpfe: Lichtreflex + Magnet ---------- */
  if (matchMedia('(hover:hover)').matches && !ruhig) {
    $$('.btn').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        b.style.setProperty('--mx', x + 'px'); b.style.setProperty('--my', y + 'px');
        if (hatGsap && b.dataset.magnet !== 'aus') gsap.to(b, { x: (x - r.width / 2) * .12, y: (y - r.height / 2) * .2, duration: .3, ease: 'power3.out' });
      });
      b.addEventListener('pointerleave', () => hatGsap && gsap.to(b, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1,.5)' }));
    });
  }

  /* ---------- Reveals ---------- */
  if (hatGsap) {
    $$('.wr').forEach(h => {
      const teile = [];
      const geh = (n) => {
        [...n.childNodes].forEach(c => {
          if (c.nodeType === 3) {
            const frag = d.createDocumentFragment();
            c.nodeValue.split(/(\s+)/).forEach(t => {
              if (!t) return;
              if (/^\s+$/.test(t)) { frag.appendChild(d.createTextNode(t)); return; }
              const w = d.createElement('span'); w.className = 'w';
              const i = d.createElement('span'); i.textContent = t; w.appendChild(i); frag.appendChild(w); teile.push(i);
            });
            c.replaceWith(frag);
          } else if (c.nodeType === 1 && c.tagName !== 'BR') {
            if (c.tagName === 'EM') { const w = d.createElement('span'); w.className = 'w'; c.replaceWith(w); const i = d.createElement('span'); i.appendChild(c); w.appendChild(i); teile.push(i); }
            else geh(c);
          }
        });
      };
      geh(h);
      if (ruhig) return;
      const sofort = h.closest('.einstieg, .seitenkopf');
      h.classList.add('laeuft');
      gsap.from(teile, { yPercent: 105, duration: 1, ease: 'expo.out', stagger: .045, delay: sofort ? .15 : 0,
        onComplete: () => h.classList.remove('laeuft'),
        scrollTrigger: sofort ? null : { trigger: h, start: 'top 88%' } });
    });
    if (ruhig) $$('.auf').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
    else $$('.auf').forEach(e => {
      const sofort = e.closest('.einstieg, .seitenkopf');
      gsap.to(e, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: sofort ? .35 + (+e.dataset.v || 0) : 0,
        scrollTrigger: sofort ? null : { trigger: e, start: 'top 90%' } });
    });
  } else $$('.auf').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });


  /* ---------- Held: Buchstaben, Licht, Ausfahrt ---------- */
  const held = $('.held');
  if (held) {
    const titel = $('[data-buchstaben]', held), buchst = [];
    const zerlege = (knoten) => {
      [...knoten.childNodes].forEach(c => {
        if (c.nodeType === 3) {
          const frag = d.createDocumentFragment();
          c.nodeValue.split(/(\s+)/).forEach(wort => {
            if (!wort) return;
            if (/^\s+$/.test(wort)) { frag.appendChild(d.createTextNode(' ')); return; }
            const wo = d.createElement('span'); wo.className = 'wo';
            [...wort].forEach(z => { const b = d.createElement('span'); b.className = 'bs'; b.textContent = z; wo.appendChild(b); buchst.push(b); });
            frag.appendChild(wo);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1 && !c.classList.contains('cursor')) zerlege(c);
      });
    };
    if (titel) { titel.setAttribute('aria-label', titel.textContent.replace(/\s+/g, ' ').trim()); zerlege(titel); [...titel.children].forEach(k => k.setAttribute('aria-hidden', 'true')); }
    if (hatGsap && !ruhig) {
      gsap.from(buchst, { yPercent: 110, rotate: 6, opacity: 0, duration: 1.15, ease: 'expo.out', stagger: .028, delay: .15 });
      if ($('.welle', held)) gsap.from($('.welle', held), { opacity: 0, scale: 1.08, duration: 2.2, ease: 'power2.out' });
      gsap.to($('.held-inhalt', held), { yPercent: -18, opacity: .15, ease: 'none', scrollTrigger: { trigger: held, start: 'top top', end: 'bottom top', scrub: .6 } });
      if ($('.welle', held)) gsap.to($('.welle', held), { scale: 1.18, ease: 'none', scrollTrigger: { trigger: held, start: 'top top', end: 'bottom top', scrub: .6 } });
    }
    const licht = $('.held-licht', held);
    if (licht && matchMedia('(hover:hover)').matches) held.addEventListener('pointermove', e => {
      const r = held.getBoundingClientRect();
      licht.style.setProperty('--lx', (e.clientX - r.left) + 'px'); licht.style.setProperty('--ly', (e.clientY - r.top) + 'px');
    });
  }


  /* ---------- Held: Buchstaben weichen der Maus ---------- */
  if (held && hatGsap && !ruhig && matchMedia('(hover:hover)').matches) {
    const bs = $$('.held-titel .bs', held);
    let bereit = false, px = -9999, py = -9999, an = false;
    setTimeout(() => { bereit = true; }, 2300);
    const qy = bs.map(b => gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' }));
    const qs = bs.map(b => gsap.quickTo(b, 'scale', { duration: .5, ease: 'power3' }));
    const rechne = () => {
      an = false; if (!bereit) return;
      bs.forEach((b, i) => {
        const r = b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const n = Math.max(0, 1 - Math.hypot(px - cx, py - cy) / 200);
        qy[i](-n * 22); qs[i](1 + n * .1); b.classList.toggle('nah', n > .45);
      });
    };
    held.addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; if (!an) { an = true; requestAnimationFrame(rechne); } });
    held.addEventListener('pointerleave', () => { px = py = -9999; requestAnimationFrame(rechne); });
  }

  /* ---------- Zoom durch den Punkt ---------- */
  const zoom = $('.zoom');
  if (zoom) {
    const worte = $('.zoom-worte', zoom), punkt = $('.zoom-punkt', zoom), blende = $('.zoom-blende', zoom), klebt = $('.zoom-klebt', zoom);
    if (hatGsap && !ruhig) {
      let g = { x: 0, y: 0, r: 0, R: 0 };
      const miss = () => {
        const k = klebt.getBoundingClientRect(), p = punkt.getBoundingClientRect();
        const x = p.left - k.left + p.width / 2, y = p.top - k.top + p.height / 2;
        g = { x, y, r: p.width / 2, R: Math.max(Math.hypot(x, y), Math.hypot(k.width - x, y), Math.hypot(x, k.height - y), Math.hypot(k.width - x, k.height - y)) + 10 };
      };
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: zoom, start: 'top top', end: 'bottom bottom', scrub: .4, invalidateOnRefresh: true,
        onRefresh: miss, onUpdate: st => { if (st.progress > .97) zoom.removeAttribute('data-dunkel'); else zoom.setAttribute('data-dunkel', ''); } } });
      miss();
      tl.fromTo([worte, punkt], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: .22, ease: 'power2.out' })
        .to({}, { duration: .13 })
        .fromTo(blende, { opacity: 1, clipPath: () => `circle(${g.r}px at ${g.x}px ${g.y}px)` }, { clipPath: () => `circle(${g.R}px at ${g.x}px ${g.y}px)`, duration: .65, ease: 'power3.in', immediateRender: false }, '>')
        .to(worte, { opacity: 0, duration: .2 }, '<+.25');
    }
  }

  /* ---------- Spielwiese (Maus + Finger + läuft von allein) ---------- */
  const ZEICHEN = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const imBild = (el, an, aus) => new IntersectionObserver(es => es[0].isIntersecting ? an() : (aus && aus()), { threshold: .35 }).observe(el);
  $$('[data-scramble]').forEach(k => {
    const el = $('.scramble-wort', k), wort = el.dataset.wort; let laeuft = false, uhr = null;
    const los = () => {
      if (laeuft || ruhig) return; laeuft = true; const t0 = performance.now(), dauer = 1100;
      const schritt = (t) => {
        const p = Math.min(1, (t - t0) / dauer), fertig = Math.floor(p * wort.length);
        el.innerHTML = [...wort].map((z, i) => i < fertig ? z : `<span class="z">${i === 0 ? ZEICHEN[Math.floor(Math.random() * ZEICHEN.length)] : ZEICHEN[Math.floor(Math.random() * ZEICHEN.length)].toLowerCase()}</span>`).join('');
        if (p < 1) requestAnimationFrame(schritt); else { el.textContent = wort; laeuft = false; }
      };
      requestAnimationFrame(schritt);
    };
    k.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') los(); });
    k.addEventListener('click', los); k.addEventListener('focus', los);
    imBild(k, () => { los(); clearInterval(uhr); uhr = setInterval(los, 3800); }, () => clearInterval(uhr));
  });
  $$('[data-kippen]').forEach(karte => {
    const feld = karte.parentElement; let zuletzt = 0, sicht = false;
    const kipp = (x, y, schnell) => {
      karte.style.transition = schnell ? 'transform .12s linear' : 'transform .9s cubic-bezier(.16,1,.3,1)';
      karte.style.transform = `rotateY(${(x - .5) * 30}deg) rotateX(${(.5 - y) * 24}deg) scale(1.04)`;
      karte.style.setProperty('--gx', x * 100 + '%'); karte.style.setProperty('--gy', y * 100 + '%');
    };
    const bei = e => { const r = karte.getBoundingClientRect(); zuletzt = performance.now(); kipp(Math.min(1.2, Math.max(-.2, (e.clientX - r.left) / r.width)), Math.min(1.2, Math.max(-.2, (e.clientY - r.top) / r.height)), true); };
    feld.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.buttons) bei(e); });
    karte.addEventListener('pointerdown', e => { karte.setPointerCapture(e.pointerId); bei(e); });
    feld.addEventListener('pointerleave', () => { zuletzt = 0; });
    imBild(feld, () => { sicht = true; requestAnimationFrame(leer); }, () => { sicht = false; });
    const leer = (t) => {
      if (!sicht) return;
      if (!ruhig && performance.now() - zuletzt > 1800) { const w = t / 1000; kipp(.5 + Math.sin(w * .9) * .32, .5 + Math.cos(w * .7) * .28, true); }
      requestAnimationFrame(leer);
    };
  });
  $$('[data-magnet-feld]').forEach(feld => {
    const kn = $('.magnet-knopf', feld);
    if (!hatGsap) return;
    const qx = gsap.quickTo(kn, 'x', { duration: .45, ease: 'power3' }), qy2 = gsap.quickTo(kn, 'y', { duration: .45, ease: 'power3' });
    const zu = (e, f) => { const r = feld.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * f); qy2((e.clientY - r.top - r.height / 2) * f); };
    const zurueck = () => gsap.to(kn, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1,.35)', overwrite: true });
    feld.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') zu(e, .45); });
    feld.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') zurueck(); });
    feld.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' && e.target !== kn) { zu(e, .7); setTimeout(zurueck, 380); } });
    kn.addEventListener('click', () => { kn.classList.remove('platz'); void kn.offsetWidth; kn.classList.add('platz'); kn.textContent = kn.textContent === 'Klick mich' ? 'Nochmal!' : 'Klick mich'; });
  });
  $$('[data-spur]').forEach(feld => {
    const punkte = $$('i', feld); let zx = 0, zy = 0, letzte = -1e9, sichtbar = false;
    const pos = punkte.map(() => ({ x: 0, y: 0 }));
    const setz = e => { const r = feld.getBoundingClientRect(); zx = e.clientX - r.left; zy = e.clientY - r.top; letzte = performance.now(); };
    feld.addEventListener('pointermove', setz); feld.addEventListener('pointerdown', setz);
    imBild(feld, () => { sichtbar = true; requestAnimationFrame(lauf); }, () => { sichtbar = false; });
    const lauf = (t) => {
      if (!sichtbar) return;
      if (t - letzte > 2200) { const r = feld.getBoundingClientRect(); zx = r.width / 2 + Math.cos(t / 650) * r.width * .3; zy = r.height / 2 + Math.sin(t / 430) * r.height * .26; }
      pos.forEach((p, i) => { const v = i ? pos[i - 1] : { x: zx, y: zy }; p.x += (v.x - p.x) * .34; p.y += (v.y - p.y) * .34; punkte[i].style.transform = `translate(${p.x}px,${p.y}px) scale(${1 - i * .075})`; punkte[i].style.opacity = 1 - i * .085; });
      requestAnimationFrame(lauf);
    };
  });

  /* ---------- Manifest: Wort für Wort einfärben ---------- */
  $$('[data-faerben]').forEach(t => {
    const woerter = [];
    const geh = (n) => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const frag = d.createDocumentFragment();
        c.nodeValue.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) { frag.appendChild(d.createTextNode(w)); return; } const s = d.createElement('span'); s.className = 'mw'; s.textContent = w; frag.appendChild(s); woerter.push(s); });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) geh(c);
    });
    geh(t);
    if (!hatGsap || ruhig) { woerter.forEach(w => { w.style.opacity = 1; }); return; }
    gsap.to(woerter, { opacity: 1, ease: 'none', stagger: .1, scrollTrigger: { trigger: t, start: 'top 78%', end: 'bottom 42%', scrub: .5 } });
  });

  /* ---------- Weg: waagerechte Fahrt ---------- */
  const weg = $('.weg');
  if (weg && hatGsap && !ruhig) {
    const mmw = gsap.matchMedia();
    mmw.add('(min-width: 761px)', () => {
      const spur = $('.weg-spur', weg), leiste = $('.weg-leiste i', weg);
      const weite = () => Math.max(0, spur.scrollWidth - innerWidth);
      const tl = gsap.timeline({ scrollTrigger: { trigger: weg, start: 'top top', end: () => '+=' + weite(), pin: $('.weg-klebt', weg), scrub: .8, invalidateOnRefresh: true, anticipatePin: 1 } });
      tl.to(spur, { x: () => -weite(), ease: 'none' }, 0).to(leiste, { scaleX: 1, ease: 'none' }, 0);
      $$('.weg-wort', weg).forEach((w, i) => { if (i) gsap.from(w, { opacity: .15, x: 80, ease: 'none', scrollTrigger: { trigger: w, containerAnimation: tl, start: 'left 95%', end: 'left 45%', scrub: true } }); });
      return () => tl.scrollTrigger && tl.scrollTrigger.kill();
    });
  }

  /* ---------- Wand: Branchen leuchten auf ---------- */
  $$('.wand-liste li').forEach(li => {
    if (!hatGsap || ruhig) { li.classList.add('an'); return; }
    ScrollTrigger.create({ trigger: li, start: 'top 66%', end: 'bottom 34%', toggleClass: 'an' });
  });

  /* ---------- Preis: Zahlen aus der Maske ---------- */
  if (hatGsap && !ruhig) $$('[data-maske]').forEach((z, i) => {
    gsap.fromTo(z, { clipPath: 'inset(0% 0% 100% 0%)', yPercent: 30 }, { clipPath: 'inset(0% 0% -10% 0%)', yPercent: 0, duration: 1.4, delay: i * .12, ease: 'expo.out', scrollTrigger: { trigger: z, start: 'top 88%' } });
  });

  /* ---------- Rechner ---------- */
  const r = $('[data-rechner]');
  if (r) {
    const wert = $('#r-wert', r), marge = $('#r-marge', r), aus = $('.ergebnis', r);
    const JAHR1 = 250 + 12 * 59, FOLGE = 12 * 59;
    const zahl = s => { const v = parseFloat(String(s).replace(/\./g, '').replace(',', '.')); return isFinite(v) && v > 0 ? v : 0; };
    const eur = v => Math.round(v).toLocaleString('de-DE') + ' €';
    const rechne = () => {
      const w = zahl(wert.value), m = Math.min(100, zahl(marge.value));
      const g = w * m / 100;
      let satz;
      if (!g) satz = 'Tragen Sie Ihren Auftragswert und Ihren Gewinnanteil ein.';
      else if (g >= JAHR1) {
        const jahre = 1 + Math.floor((g - JAHR1) / FOLGE);
        satz = `Ein einziger zusätzlicher Auftrag bezahlt Ihre Website für <b>${jahre} ${jahre === 1 ? 'Jahr' : 'Jahre'}</b>.`;
      } else {
        const n = Math.ceil(JAHR1 / g);
        satz = `Nach <b>${n} zusätzlichen Aufträgen</b> im Jahr ist die Website bezahlt.`;
      }
      $('.gross', aus).innerHTML = satz;
      $('[data-g]', aus).textContent = g ? eur(g) : '–';
      $('[data-j1]', aus).textContent = eur(JAHR1);
      $('[data-jf]', aus).textContent = eur(FOLGE);
    };
    [wert, marge].forEach(i => i.addEventListener('input', rechne));
    $$('.vorlagen button', r).forEach(b => b.addEventListener('click', () => { wert.value = Number(b.dataset.w).toLocaleString('de-DE'); marge.value = b.dataset.m; rechne(); }));
    rechne();
  }

  /* ---------- Formular ---------- */
  const SB = 'https://mvcwhvntbvnldqimjiki.supabase.co/rest/v1/anfragen';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Y3dodm50YnZubGRxaW1qaWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MDE3MzAsImV4cCI6MjEwNjE3NzczMH0._Ar5wQHzxZInIL9VhbtEFjLjb7VxZ9WishHm6lGJtFo';
  $$('form[data-anfrage]').forEach(f => {
    const thema = new URLSearchParams(location.search).get('branche');
    if (thema && f.branche) [...f.branche.options].forEach(o => { if (o.value === thema) o.selected = true; });
    const status = $('.status', f), knopf = $('button[type=submit]', f);
    const pruefe = (feld) => {
      const box = feld.closest('.f'); if (!box) return true;
      let ok = feld.checkValidity();
      if (feld.type === 'email') ok = ok && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(feld.value.trim());
      if (feld.required && !feld.value.trim()) ok = false;
      box.classList.toggle('falsch', !ok);
      feld.setAttribute('aria-invalid', !ok);
      return ok;
    };
    $$('input, select, textarea', f).forEach(i => ['input', 'change'].forEach(t => i.addEventListener(t, () => { if (i.closest('.f.falsch')) pruefe(i); })));
    f.addEventListener('submit', async e => {
      e.preventDefault();
      if (f.querySelector('.honig input').value) return;
      const felder = $$('[required]', f);
      const ok = felder.map(pruefe).every(Boolean);
      if (!ok) { const erst = $('.falsch input, .falsch select, .falsch textarea', f); erst && erst.focus(); status.className = 'status fehler'; status.textContent = 'Bitte die markierten Felder ausfüllen.'; return; }
      const daten = {
        firma: f.firma.value.trim(), name: f.name.value.trim() || null, email: f.email.value.trim(),
        telefon: f.telefon.value.trim() || null, website: f.website.value.trim() || null,
        branche: f.branche.value || null, nachricht: f.nachricht.value.trim() || null,
        stil: $$('input[name=stil]:checked', f).map(i => i.value).join(', ') || null,
        quelle: (location.pathname.split('/').pop() || 'index.html').slice(0, 120)
      };
      knopf.disabled = true; status.className = 'status'; status.textContent = 'Wird gesendet …';
      try {
        const res = await fetch(SB, { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(daten) });
        if (!res.ok) throw new Error(res.status);
        location.href = 'danke.html';
      } catch (err) {
        knopf.disabled = false;
        const text = encodeURIComponent(`Firma: ${daten.firma}\nName: ${daten.name || ''}\nE-Mail: ${daten.email}\nTelefon: ${daten.telefon || ''}\nWebsite: ${daten.website || ''}\nBranche: ${daten.branche || ''}\nStil: ${daten.stil || ''}\n\n${daten.nachricht || ''}`);
        status.className = 'status fehler';
        status.innerHTML = `Das Senden hat gerade nicht geklappt. <a class="link" href="mailto:info@crestra.de?subject=${encodeURIComponent('Entwurf anfordern: ' + daten.firma)}&body=${text}">Stattdessen per E-Mail schicken</a>`;
      }
    });
  });

  /* ---------- Bewerbung Vertrieb ---------- */
  $$('form[data-bewerbung]').forEach(f => {
    const status = $('.status', f), knopf = $('button[type=submit]', f);
    const pruefe = (feld) => {
      const box = feld.closest('.f'); if (!box) return true;
      let ok = feld.checkValidity();
      if (feld.type === 'email') ok = ok && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(feld.value.trim());
      if (feld.type === 'tel') ok = ok && feld.value.replace(/\D/g, '').length >= 6;
      if (feld.required && !feld.value.trim()) ok = false;
      box.classList.toggle('falsch', !ok); feld.setAttribute('aria-invalid', !ok);
      return ok;
    };
    $$('input, select, textarea', f).forEach(i => ['input', 'change'].forEach(t => i.addEventListener(t, () => { if (i.closest('.f.falsch')) pruefe(i); })));
    f.addEventListener('submit', async e => {
      e.preventDefault();
      if (f.querySelector('.honig input').value) return;
      if (!$$('[required]', f).map(pruefe).every(Boolean)) { const erst = $('.falsch input', f); erst && erst.focus(); status.className = 'status fehler'; status.textContent = 'Bitte die markierten Felder ausfüllen.'; return; }
      const daten = {
        name: f.name.value.trim(), ort: f.ort.value.trim() || null, email: f.email.value.trim(), telefon: f.telefon.value.trim(),
        erfahrung: f.erfahrung.value || null, stunden: f.stunden.value || null, nachricht: f.nachricht.value.trim() || null,
        quelle: (location.pathname.split('/').pop() || 'vertrieb.html').slice(0, 120)
      };
      knopf.disabled = true; status.className = 'status'; status.textContent = 'Wird gesendet …';
      try {
        const res = await fetch(SB.replace('/anfragen', '/bewerbungen'), { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(daten) });
        if (!res.ok) throw new Error(res.status);
        location.href = 'danke-bewerbung.html';
      } catch (err) {
        knopf.disabled = false;
        const text = encodeURIComponent(`Name: ${daten.name}\nWohnort: ${daten.ort || ''}\nE-Mail: ${daten.email}\nTelefon: ${daten.telefon}\nErfahrung: ${daten.erfahrung || ''}\nZeit pro Woche: ${daten.stunden || ''}\n\n${daten.nachricht || ''}`);
        status.className = 'status fehler';
        status.innerHTML = `Das Senden hat gerade nicht geklappt. <a class="link" href="mailto:info@crestra.de?subject=${encodeURIComponent('Bewerbung Vertrieb: ' + daten.name)}&body=${text}">Stattdessen per E-Mail schicken</a>`;
      }
    });
  });

  /* ---------- Jahr ---------- */
  $$('[data-jahr]').forEach(e => { e.textContent = new Date().getFullYear(); });
})();
