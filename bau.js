/* crestra – „Die Website baut sich“ (Startseite, 13.11.2026)
   Eine gepinnte Szene: Fenster steigt auf → Raster → Platzhalter → Worte → Farbe → Klick → Rauszoomen.
   CSS-Grundzustand = fertige Seite; hier werden nur die Startzustände gesetzt. */
(() => {
  const d = document, bau = d.querySelector('.bau');
  if (!bau) return;
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || ruhig) { bau.classList.add('statisch'); return; }
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, c = bau) => c.querySelector(s), $$ = (s, c = bau) => [...c.querySelectorAll(s)];

  const buehne = $('.bau-buehne'), held = $('.bau-held'), fenster = $('.fenster'), demo = $('.demo');
  const texte = $$('.bau-text p'), ende = $('.bau-ende');
  const raster = $('.raster'), senk = $$('.raster .v'), waag = $$('.raster .h');
  const inhalte = $$('.ds [data-sk] > span').filter(e => !e.classList.contains('faecher'));
  const faecher = $$('.faecher i'), rolle = $('.rolle path'), band = $('.farbband');
  const ziel = $('.ds-ziel'), zeiger = $('.zeiger'), klick = $('.klick'), toast = $('.toast');
  const knoepfe = $$('.ds-btn');

  const GRAU = { '--bild': '#ededed', '--bg': '#ffffff', '--ink': '#3a3a3c', '--ink2': '#8e8e93', '--acc': '#9a9aa0',
    '--f1': '#d1d1d6', '--f2': '#c7c7cc', '--f3': '#aeaeb2', '--f4': '#d1d1d6', '--f5': '#8e8e93' };
  const FARBE = { '--bild': '#efe7dc', '--bg': '#fbf6ef', '--ink': '#23201c', '--ink2': '#6b625a', '--acc': '#d4572a',
    '--f1': '#d4572a', '--f2': '#e9a23b', '--f3': '#2f6f68', '--f4': '#8fb3c9', '--f5': '#3b3a5a' };

  /* Farben selbst mischen (GSAP dreht Farb-Variablen beim Zurückscrollen nicht zuverlässig zurück) */
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const PAARE = Object.keys(GRAU).map(k => [k, hex(GRAU[k]), hex(FARBE[k])]);
  const farbe = { t: 0 };
  const male = () => PAARE.forEach(([k, a, b]) => demo.style.setProperty(k, 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * farbe.t)).join(',') + ')'));

  /* Position des Ziel-Knopfs innerhalb der Demo (unabhängig von Transformationen) */
  const zielPunkt = () => {
    let x = ziel.offsetWidth * .62, y = ziel.offsetHeight * .62, e = ziel;
    while (e && e !== demo) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x, y };
  };

  /* Startzustände */
  gsap.set(fenster, { y: () => innerHeight * (innerWidth < 761 ? .5 : .56), rotationX: 26, scale: .86, transformPerspective: 1600 });
  gsap.set(demo, { '--sko': 0 }); male();
  gsap.set(inhalte, { opacity: 0, y: 12 });
  gsap.set(faecher, { scaleY: 0 });
  gsap.set(rolle, { strokeDashoffset: 1 });
  gsap.set(ende, { opacity: 0, y: 30 });
  gsap.set(zeiger, { x: () => demo.offsetWidth * .9, y: () => demo.offsetHeight * .95, opacity: 0 });

  /* Auftritt beim Laden */
  gsap.from($$('.bau-titel .z'), { yPercent: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .12, delay: .1 });
  gsap.from(['.bau-lead', '.bau-knoepfe'].map(s => $(s)), { y: 20, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, delay: .45 });
  gsap.from(fenster, { opacity: 0, duration: 1.4, ease: 'power2.out', delay: .5 });

  const zeige = (tl, el, t) => tl.to(el, { opacity: 1, duration: .35, ease: 'power2.out' }, t);
  const weg = (tl, el, t) => tl.to(el, { opacity: 0, duration: .3, ease: 'power2.in' }, t);

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: bau, start: 'top top', end: () => '+=' + innerHeight * 3.8, pin: buehne, scrub: .7, anticipatePin: 1, invalidateOnRefresh: true,
      onToggle: st => d.documentElement.classList.toggle('in-bau', st.isActive) }
  });

  // 0 – 1.2: Einstieg geht, Fenster richtet sich auf
  tl.to(held, { y: -120, opacity: 0, duration: .45, ease: 'power1.in' }, 0)
    .to(fenster, { y: 0, rotationX: 0, scale: 1, duration: 1.1 }, .3);

  // 1.1 – 3.0: Struktur
  zeige(tl, texte[0], 1.1);
  tl.fromTo(raster, { opacity: 0 }, { opacity: 1, duration: .2 }, 1.1)
    .fromTo(senk, { scaleY: 0 }, { scaleY: 1, duration: .7, stagger: .08, ease: 'power2.out' }, 1.2)
    .fromTo(waag, { scaleX: 0 }, { scaleX: 1, duration: .7, stagger: .1, ease: 'power2.out' }, 1.5)
    .fromTo(demo, { '--sko': 0 }, { '--sko': 1, duration: .6, immediateRender: false }, 2.1);
  weg(tl, texte[0], 2.9);

  // 3.3 – 5.0: Worte
  zeige(tl, texte[1], 3.3);
  tl.to(inhalte, { opacity: 1, y: 0, duration: .5, stagger: .07, ease: 'power3.out' }, 3.4)
    .fromTo(demo, { '--sko': 1 }, { '--sko': 0, duration: 1, immediateRender: false }, 3.6)
    .to(raster, { opacity: 0, duration: .6 }, 4.2);
  weg(tl, texte[1], 4.9);

  // 5.3 – 6.8: Farbe
  zeige(tl, texte[2], 5.3);
  tl.to(band, { opacity: 1, duration: .15 }, 5.4)
    .fromTo(band, { xPercent: -120 }, { xPercent: 320, duration: 1.1, ease: 'power1.inOut' }, 5.4)
    .to(band, { opacity: 0, duration: .2 }, 6.3)
    .fromTo(farbe, { t: 0 }, { t: 1, duration: .8, ease: 'none', immediateRender: false, onUpdate: male }, 5.6)
    .fromTo(faecher, { scaleY: 0 }, { scaleY: 1, immediateRender: false, duration: .5, stagger: .08, ease: 'back.out(1.6)' }, 5.9)
    .fromTo(rolle, { strokeDashoffset: 1, opacity: 0 }, { strokeDashoffset: 0, opacity: .85, duration: .7, ease: 'power1.inOut', immediateRender: false }, 6.0);
  weg(tl, texte[2], 6.7);

  // 7.0 – 8.6: Was Kunden brauchen – Klick auf „Angebot anfragen“
  zeige(tl, texte[3], 7.0);
  tl.fromTo(knoepfe, { scale: .9 }, { scale: 1, duration: .4, stagger: .05, ease: 'back.out(2.5)' }, 7.0)
    .to(zeiger, { opacity: 1, duration: .2 }, 7.2)
    .to(zeiger, { x: () => zielPunkt().x, y: () => zielPunkt().y, duration: .6, ease: 'power2.inOut' }, 7.2)
    .to(ziel, { scale: .92, duration: .08 }, 7.85)
    .to(ziel, { scale: 1, duration: .14 }, 7.93)
    .fromTo(klick, { x: () => zielPunkt().x, y: () => zielPunkt().y, scale: .3, opacity: .9 }, { scale: 1.6, opacity: 0, duration: .4, ease: 'power2.out' }, 7.85)
    .fromTo(toast, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .35, ease: 'back.out(1.8)' }, 8.0)
    .to(zeiger, { opacity: 0, duration: .2 }, 8.4);
  weg(tl, texte[3], 8.5);

  // 8.8 – 10: Rauszoomen
  tl.to(fenster, { scale: () => innerWidth < 761 ? .5 : .56, y: () => -innerHeight * .06, duration: .9 }, 8.8)
    .to(ende, { opacity: 1, y: 0, duration: .6, ease: 'power2.out' }, 9.75)
    .to({}, { duration: .5 }, 10.35);

  /* „Ansehen, wie es entsteht“ springt an den Anfang des Aufbaus */
  const link = $('.a-link[href="#bau-start"]');
  if (link) link.addEventListener('click', e => {
    e.preventDefault();
    const st = tl.scrollTrigger;
    scrollTo({ top: st.start + (st.end - st.start) * .2, behavior: 'smooth' });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();

/* ===== Jeder Abschnitt ein Moment ===== */
(() => {
  const d = document;
  if (!d.body.classList.contains('seite-apple')) return;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Live-Kacheln laufen nur, solange sie sichtbar sind */
  const vis = $$('.vis');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('an', e.isIntersecting)), { threshold: .25 });
    vis.forEach(v => io.observe(v));
  } else vis.forEach(v => v.classList.add('an'));

  /* Satz in Wörter zerlegen */
  const satz = $('[data-woerter]'), woerter = [];
  if (satz) {
    satz.setAttribute('aria-label', satz.textContent);
    satz.innerHTML = satz.textContent.split(/\s+/).map(w => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    woerter.push(...$$('.w', satz));
  }

  if (!window.gsap || !window.ScrollTrigger || ruhig) {
    woerter.forEach(w => { w.style.opacity = 1; });
    $$('.a-schritte li').forEach(li => li.classList.add('an'));
    $$('.a-linie i').forEach(i => { i.style.transform = 'scaleX(1)'; });
    return;
  }

  // Helle Abschnitte fahren wie Kacheln auf
  $$('.kachel-auf').forEach(el => gsap.fromTo(el, { scale: .9, borderRadius: 48 }, { scale: 1, borderRadius: 0, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 20%', scrub: .4 } }));

  // Satz leuchtet Wort für Wort
  if (woerter.length) gsap.to(woerter, { opacity: 1, ease: 'none', stagger: .1,
    scrollTrigger: { trigger: satz, start: 'top 82%', end: 'bottom 40%', scrub: .5 } });

  // Drei Kacheln steigen nacheinander auf
  const kk = $$('.a-k');
  if (kk.length) gsap.from(kk, { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: kk[0], start: 'top 88%' } });

  // Spielwiese: Kacheln kippen herein
  const kacheln = $$('.a-spiel .kachel');
  if (kacheln.length) gsap.from(kacheln, { rotationX: -38, y: 90, opacity: 0, transformOrigin: '50% 100%', duration: 1.2, ease: 'expo.out', stagger: .1,
    scrollTrigger: { trigger: $('.a-spiel .spiel-raster'), start: 'top 85%' } });

  // Preis: kurze eigene Szene
  const preis = $('.a-preis');
  // Nur pinnen, wenn die Szene ganz auf den Bildschirm passt (Handy: sonst Überschrift unter der Kopfzeile, Haken unsichtbar).
  if (preis && $('.a-preis-buehne', preis).scrollHeight <= innerHeight) {
    const zahlen = $$('.a-zahlen > div', preis);
    const tl = gsap.timeline({ scrollTrigger: { trigger: preis, start: 'top top', end: () => '+=' + innerHeight * 1.1, pin: $('.a-preis-buehne', preis), scrub: .6, anticipatePin: 1, invalidateOnRefresh: true } });
    tl.from($('.a-h2', preis), { y: 50, opacity: 0, duration: .5 }, 0)
      .from($('.a-zahl', zahlen[0]), { scale: 2.4, opacity: 0, duration: .8, ease: 'power3.out' }, .3)
      .from($('.a-zahl-t', zahlen[0]), { opacity: 0, y: 14, duration: .3 }, .9)
      .from($('.a-zahl', zahlen[1]), { scale: 2.4, opacity: 0, duration: .8, ease: 'power3.out' }, 1.0)
      .from($('.a-zahl-t', zahlen[1]), { opacity: 0, y: 14, duration: .3 }, 1.6)
      .from($$('.a-haken li', preis), { y: 40, opacity: 0, stagger: .1, duration: .4, ease: 'back.out(1.6)' }, 1.7)
      .from($('.a-klein', preis), { opacity: 0, duration: .3 }, 2.3)
      .to({}, { duration: .4 }, 2.6);
  }

  // Schritte: Leuchtlinie zieht durch
  const rahmen = $('.a-schritte-rahmen');
  if (rahmen) {
    const li = $$('.a-schritte li', rahmen), linie = $('.a-linie i', rahmen);
    gsap.from(li, { y: 70, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: rahmen, start: 'top 88%' } });
    gsap.to(linie, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: rahmen, start: 'top 75%', end: 'bottom 45%', scrub: .5,
      onUpdate: st => li.forEach((l, i) => l.classList.toggle('an', st.progress > i / li.length + .06)) } });
  }

  // Riesen-Schriftzug baut sich auf
  const riesig = $$('.a-riesig span');
  if (riesig.length) gsap.from(riesig, { yPercent: 110, opacity: 0, ease: 'power2.out', stagger: .08,
    scrollTrigger: { trigger: $('.a-marke'), start: 'top 95%', end: 'bottom bottom', scrub: .6 } });

  /* ---------- Unterseiten ---------- */
  // Kopf: Auftritt beim Laden, beim Scrollen gleitet er weg
  const kopf = $('.a-kopf');
  if (kopf) {
    gsap.from([$('.pfad', kopf), $('.a-kopf-titel', kopf), $('.a-kopf-lead', kopf)], { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, delay: .05 });
    gsap.to($('.a-kopf-inhalt', kopf), { y: -90, opacity: .15, ease: 'none', scrollTrigger: { trigger: kopf, start: 'top top', end: 'bottom top', scrub: .3 } });
  }

  // Erster heller Abschnitt nach einem dunklen fährt wie eine Kachel auf
  const dunkel = el => el && (el.hasAttribute('data-dunkel') || el.classList.contains('night') || el.classList.contains('a-kopf'));
  $$('main > section.abschnitt:not(.night)').forEach(sec => {
    if (sec.classList.contains('kachel-auf') || !dunkel(sec.previousElementSibling)) return;
    gsap.fromTo(sec, { scale: .92, borderRadius: 44 }, { scale: 1, borderRadius: 0, ease: 'none', transformOrigin: '50% 0',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 25%', scrub: .4 } });
  });

  // Große Zahlen schießen ins Bild
  $$('.preiszahl[data-gross] > div').forEach((z, i) => gsap.from(z, { scale: 1.9, opacity: 0, duration: 1.2, delay: i * .15, ease: 'expo.out',
    scrollTrigger: { trigger: z, start: 'top 85%' } }));
  $$('.a-zahl-moment').forEach(m => gsap.fromTo($('.a-zahl', m), { scale: .45, opacity: 0 }, { scale: 1, opacity: 1, ease: 'power2.out',
    scrollTrigger: { trigger: m, start: 'top 90%', end: 'center 55%', scrub: .5 } }));

  // Senkrechte Leuchtlinie durch die Schritte
  $$('ol.schritte').forEach(ol => {
    const linie = d.createElement('div'); linie.className = 'v-linie'; linie.setAttribute('aria-hidden', 'true'); linie.innerHTML = '<i></i>';
    ol.prepend(linie);
    gsap.to($('i', linie), { scaleY: 1, ease: 'none', scrollTrigger: { trigger: ol, start: 'top 62%', end: 'bottom 62%', scrub: .4 } });
    $$('li', ol).forEach(li => ScrollTrigger.create({ trigger: li, start: 'top 62%', onEnter: () => li.classList.add('an'), onLeaveBack: () => li.classList.remove('an') }));
  });

  // Listen-Karten steigen nacheinander auf
  $$('.liste, .drin').forEach(ul => {
    const lis = $$(':scope > li', ul).filter(li => !li.classList.contains('auf'));
    if (lis.length) gsap.from(lis, { y: 40, opacity: 0, duration: .9, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: ul, start: 'top 86%' } });
  });

  // Fragen klappen weich auf
  $$('.faq details').forEach(det => {
    const sum = $('summary', det), ant = $('.antwort', det);
    sum.addEventListener('click', e => {
      e.preventDefault();
      if (det.open) gsap.to(ant, { height: 0, opacity: 0, duration: .35, ease: 'power2.inOut', onComplete: () => { det.open = false; gsap.set(ant, { clearProps: 'height,opacity' }); } });
      else { det.open = true; gsap.from(ant, { height: 0, opacity: 0, duration: .45, ease: 'power3.out', clearProps: 'height,opacity' }); }
    });
  });

  ScrollTrigger.sort();
  addEventListener('load', () => ScrollTrigger.refresh());
})();
