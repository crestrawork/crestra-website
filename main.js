/* crestra – main.js (ruhige Fassung 9.11.2026: kein Smooth-Scroll, keine 3D-/Scroll-Szenen) */
(() => {
  const d = document, root = d.documentElement;
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];

  /* ---------- Kopfzeile + Sticky-CTA ---------- */
  const kopf = $('.kopf'), kc = $('.klebe-cta');
  const ziel = $('#anfrage') || $('.fuss');
  const beimScrollen = () => {
    const y = scrollY;
    if (kopf) kopf.classList.toggle('linie', y > 8);
    if (kc) {
      const zielTop = ziel ? ziel.getBoundingClientRect().top : Infinity;
      kc.classList.toggle('sichtbar', y > innerHeight * 0.7 && zielTop > innerHeight * 0.9);
    }
  };
  addEventListener('scroll', beimScrollen, { passive: true });
  beimScrollen();

  /* ---------- Handy-Menü ---------- */
  const burger = $('.burger');
  if (burger) {
    const menue = $('.menue');
    const setze = o => {
      root.classList.toggle('menue-offen', o);
      burger.setAttribute('aria-expanded', o);
      burger.setAttribute('aria-label', o ? 'Menü schließen' : 'Menü öffnen');
      menue.setAttribute('aria-hidden', !o);
      $$('a', menue).forEach(l => { l.tabIndex = o ? 0 : -1; });
      d.body.style.overflow = o ? 'hidden' : '';
    };
    setze(false);
    burger.addEventListener('click', () => setze(!root.classList.contains('menue-offen')));
    $$('a', menue).forEach(l => l.addEventListener('click', () => setze(false)));
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menue-offen')) { setze(false); burger.focus(); } });
  }

  /* ---------- Sanftes Einblenden ---------- */
  const auf = $$('.auf');
  const zeige = e => e.classList.add('da');
  if (ruhig || !('IntersectionObserver' in window)) auf.forEach(zeige);
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { zeige(e.target); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    auf.forEach(e => io.observe(e));
  }

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
