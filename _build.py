#!/usr/bin/env python3
"""crestra – Seitengenerator. Aufruf: python3 _build.py  (schreibt alle .html-Dateien neu)"""
import json, os

V = "20261113a"
BASE = "https://crestra.de/"
HIER = os.path.dirname(os.path.abspath(__file__))

FIRMA = {
    "name": "crestra", "inhaber": "Nils Cremerius", "strasse": "Rotsch 31", "plz": "52223", "ort": "Stolberg",
    "tel": "0173 9128902", "tel_link": "+491739128902", "mail": "info@crestra.de",
}

PFEIL = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
HAKEN = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10.5l4 4 8-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
LOGO = ('<svg viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="112" fill="#0e1320"/><rect x="384" y="146" width="40" height="228" rx="8" fill="#22b3c9"/>'
        '<path transform="translate(-40 0)" d="M262.46 372.76Q232.64 372.76 211.22 363.73Q189.8 354.7 176.36 338.74Q162.92 322.78 156.62 302.2Q150.32 281.62 150.32 258.52Q150.32 235 156.62 213.79Q162.92 192.58 176.15 175.57Q189.38 158.56 210.59 148.9Q231.8 139.24 261.62 139.24Q296.9 139.24 318.53 152.47Q340.16 165.7 348.77 186.7Q357.38 207.7 353.6 232.06L294.8 236.68Q295.64 221.56 291.65 211.69Q287.66 201.82 279.68 196.99Q271.7 192.16 260.36 192.16Q250.28 192.16 242.51 195.94Q234.74 199.72 229.49 207.49Q224.24 215.26 221.51 227.02Q218.78 238.78 218.78 255.16Q218.78 276.16 223.61 291.28Q228.44 306.4 238.31 314.38Q248.18 322.36 263.3 322.36Q278.84 322.36 286.82 314.8Q294.8 307.24 297.32 295.69Q299.84 284.14 298.16 272.8L360.74 275.74Q363.26 294.22 359.06 311.65Q354.86 329.08 342.89 342.94Q330.92 356.8 310.97 364.78Q291.02 372.76 262.46 372.76Z" fill="#fff"/></svg>')
MARKE = '<a class="marke" href="index.html" aria-label="crestra – zur Startseite">crestra<span class="cursor" aria-hidden="true"></span></a>'

NAV = [("leistung.html", "Leistung & Preis"), ("ablauf.html", "Ablauf"),
       ("ueber-uns.html", "Über crestra"), ("faq.html", "Fragen"), ("vertrieb.html", "Für Vertriebler")]

ORG = {
    "@context": "https://schema.org", "@type": "ProfessionalService", "@id": BASE + "#crestra",
    "name": "crestra", "url": BASE, "image": BASE + "og.jpg", "logo": BASE + "apple-touch-icon.png",
    "description": "Websites für Betriebe in ganz Deutschland: Erstellung, Hosting, Domain und Pflege für 250 € einmalig und 59 € im Monat.",
    "founder": {"@type": "Person", "name": FIRMA["inhaber"]},
    "telephone": FIRMA["tel_link"], "email": FIRMA["mail"],
    "address": {"@type": "PostalAddress", "streetAddress": FIRMA["strasse"], "postalCode": FIRMA["plz"],
                "addressLocality": FIRMA["ort"], "addressCountry": "DE"},
    "areaServed": [{"@type": "City", "name": n} for n in ("Stolberg (Rheinland)", "Aachen", "Eschweiler", "Würselen", "Alsdorf", "Herzogenrath", "Düren")] + [{"@type": "AdministrativeArea", "name": "Städteregion Aachen"}, {"@type": "Country", "name": "Deutschland"}],
    "priceRange": "250 € einmalig, 59 € monatlich",
}


def nav_html(aktiv):
    return "".join(f'<a href="{h}"{" aria-current=page" if h == aktiv else ""}>{t}</a>' for h, t in NAV)


def menue_html(aktiv):
    out = [f'<a href="{h}"{" aria-current=page" if h == aktiv else ""}>{t}</a>' for h, t in NAV]
    out.append(f'<a href="kontakt.html"{" aria-current=page" if aktiv == "kontakt.html" else ""}>Kontakt</a>')
    return "".join(out)


def kopf(titel, beschreibung, datei, aktiv=None, jsonld=None, noindex=False, startseite=False):
    url = BASE + ("" if datei == "index.html" else datei)
    ld = [ORG] + (jsonld or [])
    ld_html = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in ld)
    robots = '<meta name="robots" content="noindex">' if noindex else ""
    importmap = f'<link rel="stylesheet" href="bau.css?v={V}">\n'
    koerper = ' class="seite-apple' + (' startseite' if startseite else '') + '"'
    raum = intro = ""
    return f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titel}</title>
<meta name="description" content="{beschreibung}">
{robots}<link rel="canonical" href="{url}">
<meta name="theme-color" content="#05080f"><meta name="color-scheme" content="dark light">
<meta property="og:type" content="website"><meta property="og:locale" content="de_DE"><meta property="og:site_name" content="crestra">
<meta property="og:title" content="{titel}"><meta property="og:description" content="{beschreibung}">
<meta property="og:url" content="{url}"><meta property="og:image" content="{BASE}og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.ico?v={V}" sizes="32x32"><link rel="icon" href="favicon.svg?v={V}" type="image/svg+xml"><link rel="apple-touch-icon" href="apple-touch-icon.png?v={V}"><link rel="manifest" href="site.webmanifest?v={V}">
<link rel="preload" href="fonts/hanken-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="styles.css?v={V}">
<script>document.documentElement.classList.add('js')</script>
{importmap}{ld_html}
</head>
<body{koerper}>
{raum}<a class="skip" href="#inhalt">Zum Inhalt springen</a>
{intro}<div class="fortschritt" aria-hidden="true"></div>
<header class="kopf">
  <div class="wrap">
    {MARKE}
    <nav class="nav" aria-label="Hauptmenü">{nav_html(aktiv)}</nav>
    <a class="btn" href="kontakt.html" data-magnet="aus">Gratis-Entwurf</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menue" aria-label="Menü öffnen"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="menue" id="menue" aria-hidden="true">
  <nav aria-label="Menü">{menue_html(aktiv)}</nav>
  <div class="menue-fuss">
    <a class="btn voll" href="kontakt.html">Gratis-Entwurf anfordern {PFEIL}</a>
    <p>{FIRMA["inhaber"]} · <a href="mailto:{FIRMA["mail"]}">{FIRMA["mail"]}</a></p>
  </div>
</div>
<main id="inhalt">
'''


def fuss(cta=True, startseite=False):
    kc = f'<div class="klebe-cta"><a class="btn" href="kontakt.html">Gratis-Entwurf anfordern {PFEIL}</a></div>' if cta else ""
    return f'''</main>
<footer class="fuss">
  <div class="wrap">
    <div class="oben">
      <div>
        {MARKE}
        <p>Websites für Betriebe in ganz Deutschland.<br>Inhaber {FIRMA["inhaber"]}</p>
        <p>{FIRMA["strasse"]}, {FIRMA["plz"]} {FIRMA["ort"]}<br><a href="mailto:{FIRMA["mail"]}">{FIRMA["mail"]}</a><br><a href="tel:{FIRMA["tel_link"]}">{FIRMA["tel"]}</a></p>
      </div>
      <div><h4>Angebot</h4><ul><li><a href="leistung.html">Leistung &amp; Preis</a></li><li><a href="ablauf.html">Ablauf</a></li><li><a href="faq.html">Fragen</a></li><li><a href="website-stolberg-aachen.html">Stolberg &amp; Aachen</a></li></ul></div>
      <div><h4>Mehr</h4><ul><li><a href="ueber-uns.html">Über crestra</a></li><li><a href="ratgeber.html">Ratgeber</a></li><li><a href="vertrieb.html">Für Vertriebler</a></li><li><a href="kontakt.html">Kontakt</a></li><li><a href="impressum.html">Impressum</a></li><li><a href="datenschutz.html">Datenschutz</a></li><li><a href="#cookie-einstellungen" data-cookie-settings>Cookie-Einstellungen</a></li></ul></div>
    </div>
    <div class="unten"><span>© <span data-jahr>2026</span> crestra · {FIRMA["inhaber"]}</span><span>Ohne Werbe-Tracking.</span></div>
  </div>
</footer>
{kc}
<script src="vendor/gsap.min.js" defer></script>
<script src="vendor/ScrollTrigger.min.js" defer></script>
<script src="https://sales.crestra.de/a.js" defer data-privacy="datenschutz.html"></script>
<script src="welle.js?v={V}" defer></script>
<script src="main.js?v={V}" defer></script>
<script src="bau.js?v={V}" defer></script>
</body>
</html>
'''


def seitenkopf(pfad, h1, lead):
    pf = ' <span aria-hidden="true">/</span> '.join(
        [f'<a href="{h}">{t}</a>' if h else f'<span aria-current="page">{t}</span>' for h, t in pfad])
    h1 = h1.replace('<em class="a">', '<span class="verlauf">').replace('<em class=\\"a\\">', '<span class="verlauf">').replace('</em>', '</span>')
    return f'''<section class="a-kopf" data-dunkel><div class="a-glut" aria-hidden="true"><i></i><i></i></div><div class="wrap a-kopf-inhalt">
  <nav class="pfad" aria-label="Brotkrümel">{pf}</nav>
  <h1 class="a-kopf-titel">{h1}</h1>
  <p class="a-kopf-lead">{lead}</p>
</div></section>'''


def cta_band(titel="Lassen Sie sich gratis einen Entwurf erstellen.", text="Schicken Sie uns Ihre Firma und Ihre jetzige Website. Wir erstellen Ihnen einen Entwurf Ihrer neuen Startseite – gratis und unverbindlich.", branche=None):
    q = f"?branche={branche}" if branche else ""
    return f'''<section class="abschnitt" style="padding-top:0"><div class="wrap"><div class="cta-band leuchtrand auf">
  <div><h2>{titel}</h2><p>{text}</p></div>
  <a class="btn" href="kontakt.html{q}">Gratis-Entwurf anfordern {PFEIL}</a>
</div></div></section>'''


BRANCHE_OPTS = [("", "Bitte wählen"), ("handwerk", "Handwerk"), ("gastronomie", "Gastronomie"), ("auto", "Autohaus & Werkstatt"),
                ("immobilien", "Immobilien"), ("energie", "Solar, Energie & Haustechnik"), ("gesundheit", "Praxis & Gesundheit"),
                ("handel", "Handel & Geschäfte"), ("dienstleistung", "Dienstleistung"), ("sonstiges", "Etwas anderes")]


STILE = [("Modern im Apple-Stil", "mit Animationen beim Scrollen"), ("Onepager", "alles auf einer Seite"), ("Mehrere Seiten", "eine Seite je Leistung"),
         ("Schlicht und ruhig", "klar, ohne viel Bewegung"), ("Sie entscheiden", "überraschen Sie mich")]


def formular(kontext="seite"):
    opts = "".join(f'<option value="{v}">{t}</option>' for v, t in BRANCHE_OPTS)
    stil_chips = "".join(f'<label class="chip"><input type="checkbox" name="stil" value="{t}"><span><strong>{t}</strong><small>{u}</small></span></label>' for t, u in STILE)
    return f'''<form class="formular" data-anfrage novalidate>
  <div class="f"><label for="f-firma-{kontext}">Firma</label><input id="f-firma-{kontext}" name="firma" autocomplete="organization" required maxlength="200"><span class="fehler-t">Bitte den Firmennamen angeben.</span></div>
  <div class="f"><label for="f-name-{kontext}">Ihr Name <small>(optional)</small></label><input id="f-name-{kontext}" name="name" autocomplete="name" maxlength="200"></div>
  <div class="f"><label for="f-email-{kontext}">E-Mail</label><input id="f-email-{kontext}" name="email" type="email" autocomplete="email" required maxlength="200"><span class="fehler-t">Bitte eine gültige E-Mail-Adresse angeben.</span></div>
  <div class="f"><label for="f-tel-{kontext}">Telefon <small>(optional)</small></label><input id="f-tel-{kontext}" name="telefon" type="tel" autocomplete="tel" maxlength="60"></div>
  <div class="f"><label for="f-web-{kontext}">Jetzige Website <small>(falls vorhanden)</small></label><input id="f-web-{kontext}" name="website" inputmode="url" placeholder="z. B. ihre-firma.de" maxlength="300"></div>
  <div class="f"><label for="f-branche-{kontext}">Branche</label><select id="f-branche-{kontext}" name="branche">{opts}</select></div>
  <fieldset class="f ganz stilwahl"><legend>Wie soll Ihre Website aussehen? <small>(mehrere möglich)</small></legend>
    <div class="chips">{stil_chips}</div>
  </fieldset>
  <div class="f ganz"><label for="f-text-{kontext}">Weitere Wünsche <small>(optional)</small></label><textarea id="f-text-{kontext}" name="nachricht" maxlength="4000" placeholder="z. B. Farben, eine Website, die Ihnen gefällt, bestimmte Funktionen …"></textarea></div>
  <div class="honig" aria-hidden="true"><label for="f-hp-{kontext}">Bitte leer lassen</label><input id="f-hp-{kontext}" name="firmenwebsite2" tabindex="-1" autocomplete="off"></div>
  <p class="zustimmung ganz">Mit dem Absenden werden Ihre Angaben gespeichert, um Ihre Anfrage zu bearbeiten. Mehr dazu in der <a class="link" href="datenschutz.html">Datenschutzerklärung</a>.</p>
  <div class="ganz"><button class="btn" type="submit">Gratis-Entwurf anfordern {PFEIL}</button></div>
  <p class="status ganz" role="status" aria-live="polite"></p>
</form>'''


def rechner(wert="4.000", marge="25", hinweis=True):
    vorl = [("Handwerksauftrag", 4000, 25), ("Solaranlage", 20000, 15), ("Gebrauchtwagen", 15000, 8), ("Maklerprovision", 9000, 60), ("Stammkunde im Jahr", 800, 30)]
    knoepfe = "".join(f'<button type="button" data-w="{w}" data-m="{m}">{t}</button>' for t, w, m in vorl)
    return f'''<div class="rechner" data-rechner>
  <div class="felder">
    <div class="feld-e"><label for="r-wert">Wert eines typischen Auftrags</label><div class="eingabe"><input id="r-wert" inputmode="decimal" value="{wert}" autocomplete="off"><span>€</span></div>
      <div class="vorlagen" aria-label="Beispielwerte">{knoepfe}</div>
      <span class="hilfe">Die Knöpfe setzen Beispielwerte. Am genauesten wird es mit Ihren eigenen Zahlen.</span></div>
    <div class="feld-e"><label for="r-marge">Davon bleibt Ihnen als Gewinn</label><div class="eingabe"><input id="r-marge" inputmode="decimal" value="{marge}" autocomplete="off"><span>%</span></div></div>
  </div>
  <div class="ergebnis" aria-live="polite">
    <p class="gross"></p>
    <ul class="rechnung">
      <li><span>Gewinn aus einem Auftrag</span><span data-g></span></li>
      <li><span>Website im ersten Jahr (250 € + 12 × 59 €)</span><span data-j1></span></li>
      <li><span>Website in jedem weiteren Jahr</span><span data-jf></span></li>
    </ul>
    {'<p class="klein">Rechenbeispiel ohne Gewähr. Wie viele Aufträge eine Website bringt, hängt von Ihrem Markt ab – das kann niemand seriös versprechen.</p>' if hinweis else ''}
  </div>
</div>'''


SEITEN = {}


def seite(datei, titel, beschreibung, inhalt, aktiv=None, jsonld=None, noindex=False, startseite=False, cta=True):
    assert len(titel) <= 65, (datei, len(titel), titel)
    assert len(beschreibung) <= 155, (datei, len(beschreibung))
    SEITEN[datei] = kopf(titel, beschreibung, datei, aktiv or datei, jsonld, noindex, startseite) + inhalt + fuss(cta, startseite)


# =====================================================================  STARTSEITE
seite("index.html", "Website erstellen lassen in Stolberg & Aachen | crestra",
      "Websites für Betriebe jeder Branche, von Hand gebaut. Gratis-Entwurf, dann 250 € einmalig und 59 € im Monat – Hosting, Domain und Pflege inklusive.",
      f'''
<section class="bau" id="bau" data-dunkel aria-label="So entsteht Ihre Website">
  <div class="bau-buehne">
    <div class="bau-held">
      <h1 class="bau-titel"><span class="z">Websites, die man</span> <span class="z"><span class="verlauf">nicht vergisst.</span></span></h1>
      <p class="bau-lead">Von Hand gebaut. Gratis als Entwurf. Für Betriebe in ganz Deutschland.</p>
      <div class="bau-knoepfe"><a class="a-btn" href="#anfrage">Gratis-Entwurf anfordern</a><a class="a-link" href="#bau-start">Ansehen, wie es entsteht <span aria-hidden="true">↓</span></a></div>
    </div>
    <div class="bau-text" aria-hidden="true">
      <p><span>Erst die <b>Struktur.</b></span></p>
      <p><span>Dann die <b>Worte.</b></span></p>
      <p><span>Dann <b>Farbe.</b></span></p>
      <p><span>Dann alles, was <b>Kunden brauchen.</b></span></p>
    </div>
    <div class="fenster">
      <div class="fenster-leiste"><i></i><i></i><i></i><span class="url">ihr-betrieb.de</span></div>
      <div class="demo" aria-hidden="true">
        <div class="raster"><i class="v" style="left:6%"></i><i class="v" style="left:28%"></i><i class="v" style="left:50%"></i><i class="v" style="left:72%"></i><i class="v" style="left:94%"></i><i class="h" style="top:12%"></i><i class="h" style="top:66%"></i><i class="h" style="top:94%"></i></div>
        <div class="ds">
          <div class="ds-kopf">
            <b class="ds-logo" data-sk><span>Lindner<i>.</i></span></b>
            <span class="ds-nav"><span data-sk><span>Leistungen</span></span><span data-sk><span>Arbeiten</span></span><span data-sk><span>Kontakt</span></span></span>
            <span class="ds-btn klein" data-sk><span>Anrufen</span></span>
          </div>
          <div class="ds-held">
            <div class="ds-text">
              <p class="ds-ueber" data-sk><span>Malerbetrieb seit 1987</span></p>
              <p class="ds-titel" data-sk><span>Farbe, die <em>bleibt.</em></span></p>
              <p class="ds-lead" data-sk><span>Innenräume, Fassaden und Tapeten – sauber gemacht und pünktlich fertig.</span></p>
              <div class="ds-knoepfe"><span class="ds-btn ds-ziel" data-sk><span>Angebot anfragen</span></span><span class="ds-btn zwei" data-sk><span>Unsere Arbeiten</span></span></div>
            </div>
            <div class="ds-bild" data-sk>
              <span class="faecher"><i></i><i></i><i></i><i></i><i></i></span>
              <svg class="rolle" viewBox="0 0 200 120"><path d="M8 92 C 50 40, 90 120, 130 60 S 180 30, 194 22" pathLength="1"/></svg>
            </div>
          </div>
          <div class="ds-karten">
            <div data-sk><span><b>Innenräume</b><small>Wände, Decken, Lacke</small></span></div>
            <div data-sk><span><b>Fassaden</b><small>Anstrich und Schutz</small></span></div>
            <div data-sk><span><b>Tapeten</b><small>Vlies, Raufaser, Design</small></span></div>
          </div>
        </div>
        <div class="farbband"></div>
        <svg class="zeiger" viewBox="0 0 24 24"><path d="M5 2.5v17.2l4.6-4.4 3 6.6 3.1-1.4-3-6.5 6.4-.3z"/></svg>
        <div class="klick"></div>
        <div class="toast"><span>✓</span> Anfrage gesendet</div>
      </div>
    </div>
    <div class="bau-ende">
      <h2>Das bauen wir <span class="verlauf">für Sie.</span></h2>
      <p>Wir erstellen Ihnen gratis einen Entwurf Ihrer neuen Website. Gefällt er Ihnen nicht, kostet Sie das nichts.</p>
      <a class="a-btn" href="#anfrage">Gratis-Entwurf anfordern</a>
    </div>
  </div>
  <span id="bau-start" class="bau-anker"></span>
</section>

<section class="a-hell a-satz kachel-auf"><div class="wrap">
  <p class="a-gross" data-woerter>Kein Baukasten. Keine Vorlage. Jede Seite von Hand gebaut – für Ihren Betrieb.</p>
  <ul class="a-drei">
    <li class="a-k">
      <div class="vis vis-fluss" aria-hidden="true"><div class="fl-rahmen"><i class="fl-a"></i><i class="fl-b"></i><i class="fl-c"></i><i class="fl-d"></i></div></div>
      <strong>Auf jedem Gerät</strong><span>Am Handy genauso stark wie am Bildschirm. Da, wo Ihre Kunden suchen.</span></li>
    <li class="a-k">
      <div class="vis vis-schnell" aria-hidden="true"><div class="sn-leiste"><i></i></div><div class="sn-seite"><i></i><i></i><i></i><i></i></div><b class="sn-fertig">Geladen.</b></div>
      <strong>Schnell geladen</strong><span>Keine schweren Baukästen. Die Seite steht, bevor jemand weiterklickt.</span></li>
    <li class="a-k">
      <div class="vis vis-chat" aria-hidden="true"><p class="ch-sie">Neue Öffnungszeiten: Sa 9–13 Uhr</p><p class="ch-tippt"><i></i><i></i><i></i></p><p class="ch-wir">Erledigt – ist online. ✓</p></div>
      <strong>Wir kümmern uns</strong><span>Hosting, Domain, Pflege. Änderungen schicken Sie einfach per E-Mail.</span></li>
  </ul>
</div></section>

<section class="spiel a-spiel" data-dunkel aria-label="Effekte zum Ausprobieren"><div class="wrap">
  <h2 class="a-h2 auf">Fühlen Sie <span class="verlauf">mal.</span></h2>
  <p class="a-unter auf">Kleine Details, die Besucher länger bleiben lassen. Bewegen Sie die Maus darüber – oder tippen Sie.</p>
  <div class="spiel-raster">
    <div class="kachel" data-scramble tabindex="0"><span class="kachel-name">Text, der lebendig wird <em>Tippen</em></span><div class="buehne-k"><p class="scramble-wort" data-wort="Aufmerksamkeit">Aufmerksamkeit</p></div></div>
    <div class="kachel"><span class="kachel-name">Karten mit Tiefe <em>Karte ziehen</em></span><div class="buehne-k kachel-tief"><div class="tief-karte" data-kippen><div class="tief-glanz"></div><strong>59 €</strong><span>im Monat, alles drin</span></div></div></div>
    <div class="kachel"><span class="kachel-name">Knöpfe, die anziehen <em>Daneben tippen</em></span><div class="buehne-k" data-magnet-feld><button type="button" class="magnet-knopf">Klick mich</button></div></div>
    <div class="kachel kachel-dunkel"><span class="kachel-name">Licht, das folgt <em>Mit dem Finger malen</em></span><div class="buehne-k" data-spur><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
  </div>
</div></section>

<section class="a-preis" data-dunkel id="preis"><div class="a-preis-buehne"><div class="wrap">
  <h2 class="a-h2">Ein Paket. <span class="verlauf">Alles drin.</span></h2>
  <div class="a-zahlen">
    <div><span class="a-zahl">250 €</span><span class="a-zahl-t">einmalig</span></div>
    <div><span class="a-zahl">59 €</span><span class="a-zahl-t">im Monat</span></div>
  </div>
  <ul class="a-haken">
    <li >{HAKEN}<span>Ihre Website, von Hand gebaut</span></li>
    <li >{HAKEN}<span>Hosting, Domain und Sicherheitszertifikat</span></li>
    <li >{HAKEN}<span>Laufende Pflege per E-Mail</span></li>
    <li >{HAKEN}<span>Wartung und Fehlerbehebung</span></li>
  </ul>
  <p class="a-klein">Mindestlaufzeit 12 Monate, danach monatlich kündbar. Nur für Unternehmen. <a class="link" href="leistung.html">Alle Details</a></p>
</div></div></section>

<section class="a-hell a-weg kachel-auf" id="ablauf"><div class="wrap">
  <h2 class="a-h2 auf">Erst sehen. <span class="verlauf">Dann entscheiden.</span></h2>
  <div class="a-schritte-rahmen"><div class="a-linie" aria-hidden="true"><i></i></div><ol class="a-schritte">
    <li><span>01</span><strong>Anfrage</strong><p>Firma und jetzige Website schicken. Kein Anruf nötig.</p></li>
    <li><span>02</span><strong>Entwurf</strong><p>Wir bauen Ihre neue Startseite – gratis. Sie bekommen einen Link.</p></li>
    <li><span>03</span><strong>Entscheidung</strong><p>Gefällt sie Ihnen, machen wir sie fertig. Wenn nicht, ist nichts passiert.</p></li>
    <li><span>04</span><strong>Live</strong><p>Domain, Hosting, Pflege – wir kümmern uns.</p></li>
  </ol></div>
</div></section>

<section class="abschnitt night anfrage-held" data-dunkel id="anfrage">
  <div class="wrap anfrage">
  <div>
    <h2 class="a-h2 links auf">Ihr Entwurf. <span class="verlauf">Gratis.</span></h2>
    <p class="lead auf" style="margin-top:22px">Schicken Sie uns Ihre Firma und – falls vorhanden – Ihre jetzige Website. Wir melden uns per E-Mail mit dem Link zu Ihrem Entwurf.</p>
  </div>
  <div class="auf leuchtrand">{formular("start")}</div>
</div></section>

<section class="vertrieb-hinweis" data-dunkel><div class="wrap"><div class="vt-band auf">
  <div><p class="vt-klein">Für Vertriebler</p><h2>Sie verkaufen gern? Verdienen Sie <span class="verlauf">250 €</span> pro Kunde.</h2>
    <p>Freie Mitarbeit von zu Hause, Zeiten bestimmen Sie selbst. Kontakte und Entwürfe bekommen Sie von uns.</p></div>
  <a class="btn hell" href="vertrieb.html">Mehr erfahren {PFEIL}</a>
</div></div></section>

<section class="a-marke" aria-label="crestra"><p class="a-riesig" aria-hidden="true"><span>c</span><span>r</span><span>e</span><span>s</span><span>t</span><span>r</span><span>a</span><i class="cur"></i></p></section>
''', startseite=True)

# =====================================================================  VERTRIEB
BEW_ERF = ["Noch keine", "Etwas (z. B. Nebenjob, Kundenservice)", "Viel (Vertrieb, Telefonverkauf, Außendienst)"]
BEW_STD = ["Unter 10 Stunden", "10–20 Stunden", "Mehr als 20 Stunden"]


def bewerbung_formular():
    erf = '<option value="">Bitte wählen</option>' + "".join(f'<option>{t}</option>' for t in BEW_ERF)
    std = '<option value="">Bitte wählen</option>' + "".join(f'<option>{t}</option>' for t in BEW_STD)
    return f'''<form class="formular" data-bewerbung novalidate>
  <div class="f"><label for="b-name">Ihr Name</label><input id="b-name" name="name" autocomplete="name" required maxlength="200"><span class="fehler-t">Bitte Ihren Namen angeben.</span></div>
  <div class="f"><label for="b-ort">Wohnort <small>(optional)</small></label><input id="b-ort" name="ort" autocomplete="address-level2" maxlength="200"></div>
  <div class="f"><label for="b-email">E-Mail</label><input id="b-email" name="email" type="email" autocomplete="email" required maxlength="200"><span class="fehler-t">Bitte eine gültige E-Mail-Adresse angeben.</span></div>
  <div class="f"><label for="b-tel">Telefon</label><input id="b-tel" name="telefon" type="tel" autocomplete="tel" required maxlength="60"><span class="fehler-t">Bitte eine Telefonnummer angeben.</span></div>
  <div class="f"><label for="b-erf">Erfahrung im Verkauf</label><select id="b-erf" name="erfahrung">{erf}</select></div>
  <div class="f"><label for="b-std">Zeit pro Woche</label><select id="b-std" name="stunden">{std}</select></div>
  <div class="f ganz"><label for="b-text">Ein paar Sätze über Sie <small>(optional)</small></label><textarea id="b-text" name="nachricht" maxlength="4000" placeholder="Was haben Sie bisher gemacht? Wann können Sie anfangen?"></textarea></div>
  <div class="honig" aria-hidden="true"><label for="b-hp">Bitte leer lassen</label><input id="b-hp" name="firmenwebsite2" tabindex="-1" autocomplete="off"></div>
  <p class="zustimmung ganz">Mit dem Absenden werden Ihre Angaben gespeichert, um Ihre Bewerbung zu bearbeiten. Mehr dazu in der <a class="link" href="datenschutz.html">Datenschutzerklärung</a>.</p>
  <div class="ganz"><button class="btn" type="submit">Bewerbung abschicken {PFEIL}</button></div>
  <p class="status ganz" role="status" aria-live="polite"></p>
</form>'''


seite("vertrieb.html", "Für Vertriebler – freie Mitarbeit bei crestra",
      "Verkaufen Sie Websites an Betriebe: freie Mitarbeit von zu Hause, 250 € Provision pro Kunde, Kontakte und Entwürfe von crestra. Jetzt bewerben.",
      seitenkopf([("index.html", "Start"), (None, "Für Vertriebler")], "250 € für jeden <em class=\"a\">Kunden</em>, den Sie gewinnen.",
                 "Sie telefonieren mit Betrieben, wir bauen die Websites. Freie Mitarbeit von zu Hause – wann und wie viel, entscheiden Sie.")
      + f'''
<section class="a-zahl-moment" data-dunkel><div class="wrap">
  <span class="a-zahl" data-gross>250 €</span>
  <p>pro gewonnenem Kunden. Ohne Obergrenze.</p>
</div></section>
<section class="abschnitt"><div class="wrap zwei-sp">
  <div><h2 class="wr">So läuft es <em class="a">ab.</em></h2>
    <p class="lead auf" style="margin-top:20px">Sie müssen keine Websites bauen und nichts Technisches verstehen. Sie führen Gespräche – den Rest machen wir.</p></div>
  <ol class="schritte schritte-klein">
    <li class="auf"><h3>Kontakte bekommen</h3><div><p>In unserer App finden Sie Betriebe mit veralteter oder fehlender Website – nach Region und Branche sortiert. Niemand sonst ruft dieselben Betriebe an.</p></div></li>
    <li class="auf"><h3>Gespräch führen</h3><div><p>Sie rufen an, stellen crestra vor und bieten einen kostenlosen Entwurf an. Ein Leitfaden hilft beim Einstieg.</p></div></li>
    <li class="auf"><h3>Wir bauen den Entwurf</h3><div><p>Will der Betrieb einen Entwurf, geben Sie uns Bescheid. Wir bauen ihn und schicken Ihnen den Link für das zweite Gespräch.</p></div></li>
    <li class="auf"><h3>Provision kassieren</h3><div><p>Unterschreibt der Kunde, bekommen Sie 250 € – sobald seine Einmalzahlung da ist und die Rücktrittsfrist vorbei ist.</p></div></li>
  </ol>
</div></section>

<section class="abschnitt grau"><div class="wrap zwei-sp">
  <div><h2 class="wr">Was Sie <em class="a">bekommen</em></h2></div>
  <ul class="drin auf">
    <li>{HAKEN}<div><strong>250 € pro Kunde</strong><span>Für jeden neuen Kunden, ohne Obergrenze.</span></div></li>
    <li>{HAKEN}<div><strong>Ein Angebot, das leicht zu verkaufen ist</strong><span>Der Kunde sieht seine Website, bevor er sich entscheidet. 250 € einmalig und 59 € im Monat, alles inklusive.</span></div></li>
    <li>{HAKEN}<div><strong>Kontakte und Werkzeuge</strong><span>Betriebe in der App, Gesprächsleitfaden, Unterlagen zum Angebot.</span></div></li>
    <li>{HAKEN}<div><strong>Freie Zeiteinteilung</strong><span>Von zu Hause, neben dem Studium oder als Hauptberuf – Sie entscheiden, wann und wie viel.</span></div></li>
    <li>{HAKEN}<div><strong>Ein fester Ansprechpartner</strong><span>Fragen klären Sie direkt mit Nils Cremerius, dem Inhaber.</span></div></li>
  </ul>
</div></section>

<section class="abschnitt"><div class="wrap zwei-sp">
  <div><h2 class="wr">Was Sie <em class="a">mitbringen</em></h2></div>
  <ul class="liste auf">
    <li><strong>Freude am Telefonieren</strong><span>Sie gehen gern auf Menschen zu und bleiben freundlich, auch wenn jemand Nein sagt.</span></li>
    <li><strong>Gutes Deutsch</strong><span>Sie sprechen Inhaber von Betrieben an – klar und auf Augenhöhe.</span></li>
    <li><strong>Selbstständiges Arbeiten</strong><span>Sie arbeiten als freier Handelsvertreter auf eigene Rechnung. Dafür brauchen Sie ein Gewerbe – wir erklären Ihnen, wie das geht.</span></li>
    <li><strong>Handy oder Computer</strong><span>Mehr Ausrüstung brauchen Sie nicht.</span></li>
  </ul>
</div></section>

<section class="abschnitt night" id="bewerben"><div class="wrap anfrage">
  <div>
    <h2 class="wr">Jetzt <em class="a">bewerben.</em></h2>
    <p class="lead auf" style="margin-top:22px">Kein Anschreiben, kein Lebenslauf nötig. Wir melden uns innerhalb weniger Tage für ein kurzes Kennenlernen.</p>
    <ul class="weiter auf">
      <li><strong>Lieber per E-Mail?</strong><span><a class="link" href="mailto:{FIRMA["mail"]}?subject=Bewerbung%20Vertrieb">{FIRMA["mail"]}</a></span></li>
    </ul>
  </div>
  <div class="auf leuchtrand">{bewerbung_formular()}</div>
</div></section>
''', cta=False)

seite("danke-bewerbung.html", "Danke für Ihre Bewerbung – crestra", "Ihre Bewerbung ist angekommen. Wir melden uns in den nächsten Tagen.",
      seitenkopf([("index.html", "Start"), ("vertrieb.html", "Für Vertriebler"), (None, "Danke")], "Danke, Ihre Bewerbung ist <em class=\"a\">angekommen.</em>",
                 "Wir sehen uns Ihre Angaben an und melden uns in den nächsten Tagen per E-Mail oder Telefon.")
      + '<section class="abschnitt"><div class="wrap"><div class="knoepfe"><a class="btn" href="index.html">Zur Startseite</a><a class="btn zwei" href="leistung.html">Unser Angebot ansehen</a></div></div></section>',
      noindex=True, cta=False)


# =====================================================================  LEISTUNG & PREIS
seite("leistung.html", "Website-Preis: 250 € + 59 €/Monat – Leistung | crestra",
      "250 € einmalig und 59 € im Monat: Erstellung, Hosting, Domain, Pflege und Wartung. 12 Monate Mindestlaufzeit, danach monatlich kündbar.",
      seitenkopf([("index.html", "Start"), (None, "Leistung & Preis")], "Ein Preis, <em class=\"a\">ohne</em> Kleingedrucktes.",
                 "250 € einmalig und 59 € im Monat. Dafür bekommen Sie eine fertige Website und jemanden, der sich darum kümmert.")
      + f'''
<section class="abschnitt"><div class="wrap preis">
  <div>
    <h2 class="wr">Was enthalten ist</h2>
    <div class="preiszahl" data-gross><div><strong>250 €</strong><span>einmalig</span></div><div><strong>59 €</strong><span>im Monat</span></div></div>
    <p class="auf" style="color:var(--ink-2)">Mindestlaufzeit 12 Monate. Danach verlängert sich der Vertrag automatisch und ist monatlich kündbar.</p>
  </div>
  <ul class="drin">
    <li class="auf">{HAKEN}<div><strong>Erstellung</strong><span>Aufbau, Gestaltung und Seiten passend zu Ihrem Betrieb und Ihrer Branche. Von Hand gebaut, ohne Baukasten.</span></div></li>
    <li class="auf">{HAKEN}<div><strong>Hosting</strong><span>Ihre Seite liegt auf schnellen Servern, mit verschlüsselter Verbindung (https).</span></div></li>
    <li class="auf">{HAKEN}<div><strong>Domain</strong><span>crestra registriert Ihre Adresse, z. B. ihre-firma.de. Eine vorhandene Domain lässt sich meist weiter nutzen.</span></div></li>
    <li class="auf">{HAKEN}<div><strong>Pflege im üblichen Umfang</strong><span>Texte, Preise, Öffnungszeiten, Fotos und Neuigkeiten ändern wir für Sie. Sie schicken die Änderung per E-Mail.</span></div></li>
    <li class="auf">{HAKEN}<div><strong>Fehlerbehebung und Wartung</strong><span>Funktioniert etwas nicht, beheben wir es – ohne Extrarechnung.</span></div></li>
    <li class="auf">{HAKEN}<div><strong>Besucherstatistik auf Wunsch</strong><span>Damit Sie sehen, ob sich die Seite lohnt. Dafür ist eventuell ein Cookie-Hinweis nötig.</span></div></li>
  </ul>
</div></section>
<section class="abschnitt grau"><div class="wrap zwei-sp">
  <div><h2 class="wr">Was extra kostet</h2><p class="lead auf" style="margin-top:20px">Damit es später keine Überraschungen gibt.</p></div>
  <ul class="liste auf">
    <li><strong>Neue Seiten und Funktionen</strong><span>Zum Beispiel ein Buchungssystem oder ein neuer Leistungsbereich. Das besprechen wir vorher und vereinbaren einen Preis.</span></li>
    <li><strong>Komplett neue Gestaltung</strong><span>Ein Umbau des Designs ist nicht in der Pflege enthalten und wird individuell vereinbart.</span></li>
    <li><strong>Umzug der Domain nach einer Kündigung</strong><span>Die Domain wird auf Sie übertragen. Die Kosten der Übertragung tragen Sie.</span></li>
  </ul>
</div></section>
<section class="abschnitt"><div class="wrap zwei-sp">
  <div><h2 class="wr">Gut zu wissen</h2></div>
  <ul class="liste auf">
    <li><strong>Fotos</strong><span>Am besten wirken Ihre eigenen Fotos. Haben Sie keine, nehmen wir lizenzfreie Bilder.</span></li>
    <li><strong>Nach einer Kündigung</strong><span>Die Website geht offline, die Domain wird auf Wunsch an Sie übertragen.</span></li>
    <li><strong>Nur für Unternehmen</strong><span>Das Angebot richtet sich an Gewerbetreibende und Freiberufler, nicht an Privatpersonen.</span></li>
    <li><strong>Kaufen statt mieten?</strong><span>Was der Unterschied ist, steht im Ratgeber: <a class="link" href="ratgeber-kaufen-oder-mieten.html">Website kaufen oder mieten</a>.</span></li>
  </ul>
</div></section>
<section class="abschnitt grau"><div class="wrap">
  <div class="kopfzeile"><h2 class="wr">Rechnet sich <em class="a">das?</em></h2><p class="lead auf">Ein Auftrag mehr im Jahr – reicht das schon?</p></div>
  <div class="auf">{rechner()}</div>
</div></section>
''' + cta_band())

# =====================================================================  ABLAUF
seite("ablauf.html", "Ablauf – vom Entwurf zur fertigen Website | crestra",
      "Erst sehen, dann entscheiden: Anfrage, Gratis-Entwurf, Entscheidung, Inhalte, Livegang und Pflege.",
      seitenkopf([("index.html", "Start"), (None, "Ablauf")], "Erst sehen, <em class=\"a\">dann</em> entscheiden.",
                 "Sie müssen sich nichts vorstellen und kein Konzept lesen. Sie sehen Ihre Seite, bevor Sie etwas unterschreiben.")
      + '''
<section class="abschnitt"><div class="wrap"><ol class="schritte">
  <li class="auf"><h2>Anfrage</h2><div><p>Sie schicken uns Ihre Firma und Ihre jetzige Website über das Formular oder per E-Mail. Ein Anruf ist nicht nötig.</p></div></li>
  <li class="auf"><h2>Entwurf</h2><div><p>Wir bauen einen Entwurf Ihrer Startseite mit Ihren Inhalten und schicken Ihnen einen Link. Sie sehen ihn sich in Ruhe an, am Bildschirm und auf dem Handy.</p><p>Der Entwurf ist gratis und unverbindlich.</p></div></li>
  <li class="auf"><h2>Entscheidung</h2><div><p>Gefällt Ihnen der Entwurf, schließen wir den Vertrag: 250 € einmalig, 59 € im Monat, 12 Monate Mindestlaufzeit. Gefällt er Ihnen nicht, ist nichts passiert.</p></div></li>
  <li class="auf"><h2>Inhalte</h2><div><p>Wir bauen die übrigen Seiten. Von Ihnen brauchen wir Fotos (wenn vorhanden), Angaben fürs Impressum und Ihre Korrekturen an den Texten.</p></div></li>
  <li class="auf"><h2>Livegang</h2><div><p>Wir richten Domain und Hosting ein und schalten die Seite frei. Eine bestehende Adresse lässt sich meist übernehmen.</p></div></li>
  <li class="auf"><h2>Pflege</h2><div><p>Neue Preise, Öffnungszeiten, Fotos oder Neuigkeiten schicken Sie per E-Mail – wir setzen sie ein. Größere Erweiterungen besprechen wir vorher.</p></div></li>
</ol></div></section>''' + cta_band())

# =====================================================================  STOLBERG & AACHEN
seite("website-stolberg-aachen.html", "Webdesign in Stolberg, Aachen & Städteregion | crestra",
      "Websites für Betriebe aus Stolberg, Aachen, Eschweiler, Würselen und der Städteregion. Gratis-Entwurf, dann 250 € einmalig und 59 € im Monat.",
      seitenkopf([("index.html", "Start"), (None, "Stolberg & Aachen")], "Ihre Website, <em class=\"a\">gebaut</em> in Stolberg.",
                 "crestra sitzt in Stolberg (Rheinland). Wir bauen Websites für Betriebe aus Stolberg, Aachen und der ganzen Städteregion – und für Betriebe in ganz Deutschland.")
      + f"""
<section class="abschnitt"><div class="wrap"><div class="prose">
<h2>Ein Ansprechpartner aus der Region</h2>
<p>Hinter crestra steht {FIRMA["inhaber"]}, {FIRMA["strasse"]}, {FIRMA["plz"]} {FIRMA["ort"]}. Sie erreichen ihn direkt unter <a href="tel:{FIRMA["tel_link"]}">{FIRMA["tel"]}</a> oder per <a href="mailto:{FIRMA["mail"]}">E-Mail</a> – ohne Callcenter und ohne wechselnde Zuständigkeiten.</p>
<h2>Für welche Betriebe?</h2>
<p>Für Handwerksbetriebe, Restaurants und Imbisse, Praxen, Händler, Dienstleister und Vereine aus Stolberg, Aachen, Eschweiler, Würselen, Alsdorf, Herzogenrath, Düren und Umgebung. Ob Sie zum ersten Mal eine Website brauchen oder Ihre alte Seite ersetzen wollen: Sie bekommen eine Seite, die auf dem Handy gut aussieht, schnell lädt und Kunden zeigt, wie sie Sie erreichen.</p>
<h2>Was es kostet</h2>
<p>250 € einmalig für die Erstellung und 59 € im Monat für Hosting, Domain, Pflege und Wartung. Die Mindestlaufzeit beträgt 12 Monate, danach ist der Vertrag monatlich kündbar. Alle Einzelheiten stehen unter <a href="leistung.html">Leistung &amp; Preis</a>.</p>
<h2>So läuft es ab</h2>
<p>Sie schicken uns Ihre Firma und Ihre jetzige Website. Wir bauen einen Entwurf Ihrer Startseite und schicken Ihnen den Link – gratis und unverbindlich. Gefällt er Ihnen, bauen wir die übrigen Seiten, richten Domain und Hosting ein und schalten die Seite frei. Danach schicken Sie Änderungen einfach per E-Mail. Mehr dazu unter <a href="ablauf.html">Ablauf</a>.</p>
</div></div></section>""" + cta_band())

# =====================================================================  ÜBER
seite("ueber-uns.html", "Über crestra – Nils Cremerius, Stolberg",
      "crestra baut Websites für Betriebe in ganz Deutschland. Inhaber Nils Cremerius, Stolberg. Jede Seite von Hand gebaut, ohne Baukasten.",
      seitenkopf([("index.html", "Start"), (None, "Über crestra")], "Ein Ansprechpartner. <em class=\"a\">Kein</em> Baukasten.",
                 "crestra ist ein Website-Studio aus Stolberg bei Aachen – für Betriebe in ganz Deutschland. Inhaber ist Nils Cremerius.")
      + f'''
<section class="abschnitt"><div class="wrap">
  <p class="a-gross" data-woerter>Viele Betriebe machen hervorragende Arbeit – und haben eine Website, die das nicht zeigt.</p>
</div></section>
<section class="abschnitt grau"><div class="wrap zwei-sp">
  <div><h2 class="wr">Warum es crestra gibt</h2></div>
  <div class="prose auf">
    <p>Oft wurde die Website vor Jahren mit einem Baukasten gebaut, ist auf dem Handy kaum lesbar, und niemand fühlt sich mehr zuständig.</p>
    <p>crestra baut jede Seite von Hand, passend zum Betrieb, und kümmert sich danach weiter darum. Sie haben einen festen Ansprechpartner, und Änderungen schicken Sie einfach per E-Mail.</p>
    <p>Weil wir den Entwurf vorher bauen, müssen Sie sich nicht auf Versprechen verlassen. Sie sehen das Ergebnis, bevor Sie sich entscheiden.</p>
  </div>
</div></section>
<section class="abschnitt grau"><div class="wrap zwei-sp">
  <div><h2 class="wr">Wie wir bauen</h2></div>
  <ul class="liste auf">
    <li><strong>Handy zuerst</strong><span>Jede Seite wird auf dem Handy und am Bildschirm getestet, in Chrome und Safari.</span></li>
    <li><strong>Schnell und schlank</strong><span>Keine schweren Baukästen. Schriften liegen auf dem eigenen Server, Karten laden erst auf Klick.</span></li>
    <li><strong>Ohne Cookie-Banner, wo es geht</strong><span>Ohne Tracking und fremde Dienste braucht eine Seite oft gar keinen Banner. Wer eine Besucherstatistik möchte, bekommt einen schlanken, ehrlichen Hinweis.</span></li>
    <li><strong>Echte Inhalte</strong><span>Ihre Fotos, Ihre Leistungen, Ihre Sprache. Keine erfundenen Kundenstimmen, keine geschönten Zahlen.</span></li>
  </ul>
</div></section>
<section class="abschnitt"><div class="wrap zwei-sp">
  <div><h2 class="wr">Kontakt</h2></div>
  <div class="prose auf"><p>crestra · Inhaber {FIRMA["inhaber"]}<br>{FIRMA["strasse"]}, {FIRMA["plz"]} {FIRMA["ort"]}</p><p><a href="mailto:{FIRMA["mail"]}">{FIRMA["mail"]}</a><br><a href="tel:{FIRMA["tel_link"]}">{FIRMA["tel"]}</a></p></div>
</div></section>''' + cta_band())

# =====================================================================  FAQ
FAQ = [
    ("Was kostet eine Website bei crestra?", "250 € einmalig und 59 € im Monat. Darin sind Erstellung, Hosting, Domain, die laufende Pflege im üblichen Umfang sowie Fehlerbehebung und Wartung enthalten."),
    ("Wie lange läuft der Vertrag?", "Die Mindestlaufzeit beträgt 12 Monate. Danach verlängert sich der Vertrag automatisch und ist monatlich kündbar."),
    ("Kostet der Entwurf etwas?", "Nein. Wir erstellen Ihnen den Entwurf Ihrer Startseite gratis und unverbindlich. Erst wenn er Ihnen gefällt, schließen wir einen Vertrag."),
    ("Was gehört zur Pflege?", "Änderungen an Texten, Preisen, Öffnungszeiten, Fotos und Neuigkeiten. Neue Seiten, neue Funktionen oder eine komplett neue Gestaltung gehören nicht dazu – das besprechen wir vorher und vereinbaren einen Preis."),
    ("Wem gehört die Domain?", "crestra registriert die Domain für die Dauer des Vertrags. Nach einer Kündigung wird sie auf Wunsch an Sie übertragen; die Kosten der Übertragung tragen Sie."),
    ("Was passiert nach einer Kündigung?", "Die Website geht offline. Die Domain können Sie übernehmen und mit einem anderen Anbieter weiter nutzen."),
    ("Kann ich meine bisherige Domain behalten?", "In den meisten Fällen ja. Wir prüfen das vor dem Livegang mit Ihnen gemeinsam."),
    ("Woher kommen die Fotos?", "Am besten von Ihnen – echte Fotos aus Ihrem Betrieb wirken am stärksten. Haben Sie keine, verwenden wir lizenzfreie Bilder."),
    ("Brauche ich einen Cookie-Banner?", "Oft nicht. Wir bauen Seiten so, dass sie ohne Tracking und ohne fremde Dienste auskommen: Schriften liegen auf dem eigenen Server, Karten laden erst auf Klick. Wünschen Sie eine Besucherstatistik, kann ein Hinweis nötig werden."),
    ("Für wen ist das Angebot?", "Für Unternehmen jeder Branche, Gewerbetreibende und Freiberufler – vom Handwerksbetrieb über das Restaurant bis zur Kanzlei. An Privatpersonen verkaufen wir nicht."),
    ("Machen Sie auch Websites für meine Branche?", "Ja. Wir bauen keine Vorlagen, sondern jede Seite passend zum Betrieb. Schicken Sie uns einfach Ihre Anfrage."),
    ("Muss ich telefonieren?", "Nein. Anfrage, Entwurf und Abstimmung funktionieren komplett per E-Mail. Wenn Sie lieber sprechen, geht das natürlich auch."),
]
faq_html = "".join(f'<details class="auf"><summary>{q}<i aria-hidden="true"></i></summary><div class="antwort"><p>{a}</p></div></details>' for q, a in FAQ)
seite("faq.html", "Fragen und Antworten – crestra",
      "Preis, Laufzeit, Domain, Pflege, Fotos, Cookie-Banner: die häufigsten Fragen zu Websites von crestra.",
      seitenkopf([("index.html", "Start"), (None, "Fragen")], "Fragen und <em class=\"a\">Antworten</em>", "Was Betriebe uns am häufigsten fragen. Ihre Frage ist nicht dabei? Schreiben Sie uns.")
      + f'<section class="abschnitt"><div class="wrap"><div class="faq" style="max-width:900px">{faq_html}</div><p style="margin-top:40px"><a class="link" href="ratgeber.html">Mehr im Ratgeber</a></p></div></section>' + cta_band(),
      jsonld=[{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
          {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}])

# =====================================================================  RATGEBER
ARTIKEL = [
    ("ratgeber-handy.html", "Warum Ihre Website zuerst fürs Handy gebaut sein muss",
     "Google bewertet die Handy-Fassung, und Ihre Kunden suchen unterwegs. Fünf Fragen, mit denen Sie Ihre Seite selbst prüfen.",
     "Website fürs Handy: warum es entscheidend ist | crestra"),
    ("ratgeber-impressum-datenschutz.html", "Impressum, Datenschutz, Cookies: Was auf eine Firmen-Website gehört",
     "Pflichtangaben nach § 5 DDG, Datenschutzerklärung und wann ein Cookie-Banner nötig ist – verständlich erklärt.",
     "Impressum & Datenschutz für Firmen-Websites | crestra"),
    ("ratgeber-kaufen-oder-mieten.html", "Website kaufen oder mieten?",
     "Einmal bezahlen oder monatlich? Die Unterschiede, Vor- und Nachteile beider Modelle – ehrlich verglichen.",
     "Website kaufen oder mieten? Ein ehrlicher Vergleich | crestra"),
]
liste = "".join(f'<li class="auf"><a href="{h}"><div><h2>{t}</h2><p>{b}</p></div>{PFEIL}</a></li>' for h, t, b, _ in ARTIKEL)
seite("ratgeber.html", "Ratgeber – Websites für Betriebe | crestra",
      "Kurze Antworten für Inhaber: Handy-Fassung, Impressum und Datenschutz, Website kaufen oder mieten.",
      seitenkopf([("index.html", "Start"), (None, "Ratgeber")], "Ratgeber", "Kurze, ehrliche Antworten auf Fragen, die Inhaber zu ihrer Website haben.")
      + f'<section class="abschnitt"><div class="wrap"><ul class="artikel-liste">{liste}</ul></div></section>' + cta_band())


def artikel(datei, inhalt_html):
    h, t, b, mt = next(a for a in ARTIKEL if a[0] == datei)
    ld = {"@context": "https://schema.org", "@type": "Article", "headline": t, "description": b, "inLanguage": "de",
          "datePublished": "2026-10-02", "dateModified": "2026-10-02", "author": {"@type": "Person", "name": FIRMA["inhaber"]},
          "publisher": {"@id": BASE + "#crestra"}, "mainEntityOfPage": BASE + datei}
    seite(datei, mt, b, seitenkopf([("index.html", "Start"), ("ratgeber.html", "Ratgeber"), (None, "Artikel")], t, b)
          + f'<section class="abschnitt" style="padding-top:clamp(48px,6vw,80px)"><div class="wrap"><article class="prose">{inhalt_html}<p class="klein" style="margin-top:2.5em">Stand: November 2026. Allgemeine Information, keine Rechtsberatung.</p></article></div></section>' + cta_band(),
          aktiv="ratgeber.html", jsonld=[ld])


artikel("ratgeber-handy.html", '''
<p>Wer heute einen Handwerker, einen Makler oder ein Autohaus sucht, tut das meistens nicht am Schreibtisch. Er sucht unterwegs, auf dem Sofa, in der Mittagspause – auf dem Handy. Wenn Ihre Seite dort klein, langsam oder unübersichtlich ist, ist der Besucher nach wenigen Sekunden beim nächsten Anbieter.</p>
<h2>Google schaut zuerst auf die Handy-Fassung</h2>
<p>Google bewertet Websites seit einigen Jahren grundsätzlich anhand ihrer Handy-Fassung (die sogenannte Mobile-First-Indexierung). Was auf dem Handy fehlt oder schlecht funktioniert, zählt auch für Ihre Platzierung in der Suche.</p>
<h2>Was eine gute Handy-Fassung ausmacht</h2>
<ul>
<li><strong>Lesbar ohne Zoomen.</strong> Texte müssen groß genug sein, ohne dass man mit zwei Fingern vergrößern muss.</li>
<li><strong>Anrufen mit einem Tipp.</strong> Die Telefonnummer ist ein Link, kein Bild und kein Text zum Abschreiben.</li>
<li><strong>Knöpfe, die man trifft.</strong> Menüpunkte und Schaltflächen sind groß genug für einen Daumen.</li>
<li><strong>Schnell geladen.</strong> Bilder werden in passender Größe ausgeliefert, nicht als riesige Originaldateien.</li>
<li><strong>Formulare, die funktionieren.</strong> Die richtige Tastatur erscheint (Zahlen für Telefon, @ für E-Mail), und Fehler werden verständlich angezeigt.</li>
</ul>
<h2>Fünf Fragen, mit denen Sie Ihre Seite selbst prüfen</h2>
<ol>
<li>Können Sie auf Ihrem Handy Ihre Startseite lesen, ohne zu zoomen?</li>
<li>Rufen Sie sich selbst an: Klappt das mit einem Tipp auf die Nummer?</li>
<li>Finden Sie in zehn Sekunden heraus, was Ihr Betrieb anbietet und wo er sitzt?</li>
<li>Schicken Sie sich selbst eine Anfrage über das Formular. Kommt sie an?</li>
<li>Öffnen Sie die Seite unterwegs, ohne WLAN. Wie lange dauert es, bis etwas zu sehen ist?</li>
</ol>
<p>Wenn Sie bei einer dieser Fragen zögern, verlieren Sie wahrscheinlich Anfragen, ohne es zu merken. Denn wer abspringt, meldet sich nicht.</p>
<h2>Und am großen Bildschirm?</h2>
<p>Der bleibt wichtig – etwa für Geschäftskunden, die im Büro vergleichen. Eine gute Website ist für beides gebaut. Bei crestra prüfen wir jede Seite auf dem Handy und am Bildschirm, in Chrome und in Safari.</p>
''')

artikel("ratgeber-impressum-datenschutz.html", '''
<p>Fast jede Firmen-Website braucht ein Impressum und eine Datenschutzerklärung. Fehlen Angaben, drohen Abmahnungen. Hier steht, was dazugehört – als Überblick, nicht als Rechtsberatung.</p>
<h2>Das Impressum (§ 5 DDG)</h2>
<p>Seit Mai 2024 steht die Impressumspflicht im Digitale-Dienste-Gesetz (DDG); vorher war es das Telemediengesetz. Inhaltlich hat sich wenig geändert. Zu den üblichen Angaben gehören:</p>
<ul>
<li><strong>Name und Anschrift</strong> – bei Einzelunternehmern der vollständige Vor- und Nachname, bei Gesellschaften Firma und Rechtsform. Ein Postfach reicht nicht.</li>
<li><strong>Vertretungsberechtigte</strong> – bei einer GmbH zum Beispiel die Geschäftsführer.</li>
<li><strong>Kontakt</strong> – eine E-Mail-Adresse und ein weiterer schneller Weg, in der Regel eine Telefonnummer.</li>
<li><strong>Register</strong> – Registergericht und Nummer, wenn Sie im Handelsregister eingetragen sind.</li>
<li><strong>Umsatzsteuer-Identifikationsnummer</strong> oder Wirtschafts-Identifikationsnummer, falls vorhanden.</li>
<li><strong>Aufsichtsbehörde</strong> bei erlaubnispflichtigen Tätigkeiten – bei Immobilienmaklern etwa die Behörde, die die Erlaubnis nach § 34c GewO erteilt hat.</li>
<li><strong>Berufsrechtliche Angaben</strong> bei reglementierten Berufen, zum Beispiel Kammer und Berufsbezeichnung.</li>
</ul>
<p>Veröffentlichen Sie eigene Artikel, etwa einen Ratgeber, kommt meist noch ein inhaltlich Verantwortlicher nach § 18 Abs. 2 Medienstaatsvertrag dazu.</p>
<h2>Die Datenschutzerklärung</h2>
<p>Sobald Ihre Seite personenbezogene Daten verarbeitet – und das tut praktisch jede, schon über die Server-Protokolle –, müssen Sie Besucher nach Art. 13 DSGVO informieren: Wer ist verantwortlich, welche Daten werden wofür verarbeitet, auf welcher Rechtsgrundlage, wie lange, an wen gehen sie, und welche Rechte haben Besucher.</p>
<p>Wichtig ist, dass die Erklärung zu <em>Ihrer</em> Seite passt. Ein kopierter Text, der Dienste nennt, die Sie gar nicht nutzen – oder Dienste verschweigt, die Sie nutzen – hilft nicht.</p>
<h2>Wann braucht man einen Cookie-Banner?</h2>
<p>Eine Einwilligung ist nach § 25 TDDDG nötig, wenn Ihre Seite Informationen auf dem Gerät des Besuchers speichert oder ausliest, die für den Betrieb nicht unbedingt erforderlich sind – typisch sind Statistik- und Werbedienste. Auch eingebettete Karten, Videos oder Schriften von fremden Servern übertragen Daten an Dritte und machen die Sache komplizierter.</p>
<p>Der einfachste Weg ist oft, solche Dienste gar nicht erst einzubauen:</p>
<ul>
<li>Schriften auf dem eigenen Server statt bei Google Fonts.</li>
<li>Karten erst laden, wenn der Besucher darauf klickt.</li>
<li>Videos selbst hosten oder erst nach Klick laden.</li>
<li>Auf Werbe-Tracking verzichten.</li>
</ul>
<p>So kommt auch diese Seite ohne Cookie-Banner aus.</p>
<h2>Was wir bei crestra übernehmen</h2>
<p>Wir erstellen Impressum und Datenschutzerklärung nach Ihren Angaben und passend zu dem, was auf Ihrer Seite tatsächlich eingebaut ist. Für die Richtigkeit Ihrer Angaben – etwa Registernummer oder Aufsichtsbehörde – sind Sie als Betreiber verantwortlich. Bei Unsicherheit lohnt sich die Frage an Ihren Anwalt oder Ihre Kammer.</p>
''')

artikel("ratgeber-kaufen-oder-mieten.html", '''
<p>Für eine Firmen-Website gibt es grob zwei Modelle: Sie kaufen sie einmal, oder Sie zahlen monatlich für Website und Betreuung. Beides kann sinnvoll sein. Hier die Unterschiede, ohne Schönfärberei.</p>
<h2>Kaufen: einmal bezahlen</h2>
<p>Eine Agentur oder ein Freelancer baut die Seite, Sie bezahlen einmal und erhalten die Dateien.</p>
<ul>
<li><strong>Vorteil:</strong> Die Seite gehört Ihnen. Sie können später jeden beliebigen Anbieter für Hosting und Änderungen beauftragen.</li>
<li><strong>Vorteil:</strong> Keine laufenden Kosten an die Agentur, wenn Sie nichts ändern.</li>
<li><strong>Nachteil:</strong> Höhere Kosten am Anfang.</li>
<li><strong>Nachteil:</strong> Hosting, Domain, Sicherheits-Updates und Änderungen müssen Sie selbst organisieren – und meistens einzeln bezahlen.</li>
<li><strong>Nachteil:</strong> Oft fühlt sich nach dem Start niemand mehr zuständig. Viele veraltete Websites sind genau so entstanden.</li>
</ul>
<h2>Mieten: monatlich zahlen</h2>
<p>Sie zahlen einen kleineren Betrag zum Start und dann monatlich. Dafür kümmert sich der Anbieter um Technik und Änderungen.</p>
<ul>
<li><strong>Vorteil:</strong> Geringe Kosten am Anfang, planbare Kosten danach.</li>
<li><strong>Vorteil:</strong> Ein fester Ansprechpartner für Änderungen, Fehler und Technik.</li>
<li><strong>Vorteil:</strong> Die Seite bleibt aktuell, weil Pflege schon bezahlt ist.</li>
<li><strong>Nachteil:</strong> Sie sind an den Anbieter gebunden, meist mit einer Mindestlaufzeit.</li>
<li><strong>Nachteil:</strong> Kündigen Sie, geht die Seite in der Regel offline. Wichtig ist deshalb, dass Sie Ihre Domain mitnehmen können.</li>
</ul>
<h2>Im Überblick</h2>
<table>
<thead><tr><th></th><th>Kaufen</th><th>Mieten</th></tr></thead>
<tbody>
<tr><th>Kosten am Anfang</th><td>höher</td><td>gering</td></tr>
<tr><th>Laufende Kosten</th><td>Hosting, Domain, Änderungen einzeln</td><td>fester Monatsbetrag</td></tr>
<tr><th>Pflege und Technik</th><td>selbst organisieren</td><td>übernimmt der Anbieter</td></tr>
<tr><th>Bindung</th><td>keine</td><td>meist Mindestlaufzeit</td></tr>
<tr><th>Nach dem Ende</th><td>Seite bleibt Ihre</td><td>Seite offline, Domain übertragbar</td></tr>
</tbody>
</table>
<h2>Was passt zu wem?</h2>
<p><strong>Kaufen</strong> lohnt sich, wenn Sie jemanden im Haus haben, der sich um Technik und Änderungen kümmert, oder wenn Ihre Seite sich jahrelang nicht ändern soll.</p>
<p><strong>Mieten</strong> passt, wenn Sie keine Zeit für Ihre Website haben wollen und trotzdem möchten, dass sie aktuell bleibt.</p>
<h2>Wie es bei crestra ist</h2>
<p>crestra arbeitet mit dem Mietmodell: 250 € einmalig und 59 € im Monat, 12 Monate Mindestlaufzeit, danach monatlich kündbar. Nach einer Kündigung wird die Domain auf Wunsch an Sie übertragen; die Übertragungskosten tragen Sie. Die Website selbst geht dann offline. Alle Details stehen unter <a href="leistung.html">Leistung &amp; Preis</a>.</p>
''')

# =====================================================================  KONTAKT, DANKE, 404
seite("kontakt.html", "Gratis-Entwurf für Ihre Website anfordern – crestra Stolberg",
      "Lassen Sie sich gratis einen Entwurf Ihrer neuen Website erstellen. Firma und jetzige Website schicken – unverbindlich.",
      seitenkopf([("index.html", "Start"), (None, "Kontakt")], "Ihr <em class=\"a\">Gratis</em>-Entwurf",
                 "Ein paar Angaben genügen. Wir erstellen Ihren Entwurf und schicken Ihnen den Link – gratis und unverbindlich.")
      + f'''
<section class="abschnitt night"><div class="wrap anfrage">
  <div>
    <h2 class="wr" style="font-size:clamp(28px,3vw,40px)">Lieber direkt?</h2>
    <ul class="liste auf" style="margin-top:24px">
      <li><strong>E-Mail</strong><span><a class="link" href="mailto:{FIRMA["mail"]}">{FIRMA["mail"]}</a></span></li>
      <li><strong>Telefon</strong><span><a class="link" href="tel:{FIRMA["tel_link"]}">{FIRMA["tel"]}</a></span></li>
      <li><strong>Adresse</strong><span>crestra · {FIRMA["inhaber"]}<br>{FIRMA["strasse"]}, {FIRMA["plz"]} {FIRMA["ort"]}</span></li>
    </ul>
  </div>
  <div class="auf leuchtrand" id="anfrage">{formular("kontakt")}</div>
</div></section>''', cta=False)

seite("danke.html", "Danke für Ihre Anfrage – crestra", "Ihre Anfrage ist angekommen. Wir melden uns per E-Mail.",
      seitenkopf([("index.html", "Start"), (None, "Danke")], "Danke, Ihre Anfrage ist <em class=\"a\">angekommen.</em>",
                 "Wir sehen uns Ihre Angaben an und melden uns per E-Mail – mit dem Link zu Ihrem Entwurf oder mit einer Rückfrage.")
      + '<section class="abschnitt"><div class="wrap"><div class="knoepfe"><a class="btn" href="index.html">Zur Startseite</a><a class="btn zwei" href="ratgeber.html">Zum Ratgeber</a></div></div></section>',
      noindex=True, cta=False)

seite("404.html", "Seite nicht gefunden – crestra", "Diese Seite gibt es nicht (mehr). Zur Startseite von crestra, zu Leistung und Preis oder zum Gratis-Entwurf.",
      seitenkopf([("index.html", "Start"), (None, "404")], "Diese Seite gibt es <em class=\"a\">nicht.</em>",
                 "Vielleicht hat sich die Adresse geändert. Hier geht es weiter:")
      + '<section class="abschnitt"><div class="wrap"><div class="knoepfe"><a class="btn" href="index.html">Zur Startseite</a><a class="btn zwei" href="leistung.html">Leistung &amp; Preis</a><a class="btn zwei" href="kontakt.html">Kontakt</a></div></div></section>',
      noindex=True, cta=False)

# =====================================================================  RECHTLICHES
seite("impressum.html", "Impressum – crestra", "Impressum von crestra, Inhaber Nils Cremerius, Stolberg.",
      seitenkopf([("index.html", "Start"), (None, "Impressum")], "Impressum", "Angaben gemäß § 5 DDG")
      + f'''<section class="abschnitt" style="padding-top:clamp(48px,6vw,80px)"><div class="wrap"><div class="prose">
<h2>Anbieter</h2>
<p>{FIRMA["inhaber"]}<br>crestra<br>{FIRMA["strasse"]}<br>{FIRMA["plz"]} {FIRMA["ort"]}<br>Deutschland</p>
<h2>Kontakt</h2>
<p>Telefon: <a href="tel:{FIRMA["tel_link"]}">{FIRMA["tel"]}</a><br>E-Mail: <a href="mailto:{FIRMA["mail"]}">{FIRMA["mail"]}</a></p>
<h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
<p>{FIRMA["inhaber"]}, Anschrift wie oben</p>
<h2>Verbraucherstreitbeilegung</h2>
<p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Unser Angebot richtet sich ausschließlich an Unternehmen.</p>
<h2>Haftung für Links</h2>
<p>Diese Seite enthält Links zu Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese Inhalte ist der jeweilige Anbieter verantwortlich. Bei Bekanntwerden von Rechtsverletzungen entfernen wir solche Links umgehend.</p>
</div></div></section>''', noindex=False, cta=False)

seite("datenschutz.html", "Datenschutzerklärung – crestra", "Wie crestra beim Besuch dieser Website und bei Anfragen mit Ihren Daten umgeht.",
      seitenkopf([("index.html", "Start"), (None, "Datenschutz")], "Datenschutz", "Kurz gesagt: keine Werbe-Cookies, keine Analyse durch Dritte. Seitenaufrufe zählen wir selbst und anonym, mehr nur mit Ihrer Einwilligung.")
      + f'''<section class="abschnitt" style="padding-top:clamp(48px,6vw,80px)"><div class="wrap"><div class="prose">
<h2>Verantwortlicher</h2>
<p>{FIRMA["inhaber"]} (crestra), {FIRMA["strasse"]}, {FIRMA["plz"]} {FIRMA["ort"]}<br>E-Mail: <a href="mailto:{FIRMA["mail"]}">{FIRMA["mail"]}</a>, Telefon: {FIRMA["tel"]}</p>
<h2>Hosting und Server-Protokolle</h2>
<p>Diese Website wird bei GitHub Pages gehostet (GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). Beim Aufruf verarbeitet der Hoster technisch notwendige Daten wie IP-Adresse, Zeitpunkt, aufgerufene Seite und Browser-Kennung, um die Seite auszuliefern und vor Missbrauch zu schützen. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und zuverlässigen Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Dabei können Daten in die USA übermittelt werden; GitHub ist nach dem EU-US Data Privacy Framework zertifiziert. Mehr dazu in der <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">Datenschutzerklärung von GitHub</a>.</p>
<h2>Schriften und Skripte</h2>
<p>Schriften und Skripte (z. B. für Animationen) liegen auf unserem eigenen Server. Es werden keine Verbindungen zu Google Fonts oder anderen Content-Delivery-Netzwerken aufgebaut.</p>
<h2>Reichweitenmessung</h2>
<p>Um unser Angebot zu verbessern, zählen wir Seitenaufrufe mit einem eigenen Verfahren, ohne Drittanbieter. <b>Ohne Ihre Einwilligung</b> speichern wir nichts auf Ihrem Gerät. Erfasst werden nur die aufgerufene Seite, die verweisende Website, Kampagnenkennzeichen aus dem Link, Gerätetyp, Browserfamilie und Land. Ihre IP-Adresse wird nicht gespeichert. Rechtsgrundlage ist unser berechtigtes Interesse an der Verbesserung des Angebots (Art. 6 Abs. 1 lit. f DSGVO).</p>
<p><b>Mit Ihrer Einwilligung</b> (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG) speichern wir zusätzlich eine zufällige Kennung im Speicher Ihres Browsers. So erkennen wir, welche Seiten Sie bei einem Besuch ansehen und ob Sie wiederkommen. Sie können die Einwilligung jederzeit über „Cookie-Einstellungen“ im Seitenfuß widerrufen. Die Zähldaten werden auf Servern von Cloudflare, Inc. (USA, zertifiziert nach dem EU-US Data Privacy Framework) verarbeitet und nach 13 Monaten auf anonyme Tagessummen reduziert.</p>
<h2>Cookies und Browserspeicher</h2>
<p>Diese Website setzt keine Cookies und verwendet keine Werbedienste. Ihre Auswahl im Einwilligungsbanner wird im Speicher Ihres Browsers abgelegt (§ 25 Abs. 2 TDDDG). Im Speicher Ihres Browsers (Session Storage) wird lediglich vermerkt, dass die Begrüßungsanimation schon gezeigt wurde; dieser Eintrag wird beim Schließen des Tabs gelöscht und ist für die gewünschte Darstellung erforderlich (§ 25 Abs. 2 TDDDG).</p>
<h2>Anfrageformular</h2>
<p>Wenn Sie das Formular nutzen, speichern wir Ihre Angaben (Firma, Name, E-Mail, Telefon, Website, Branche, gewünschter Stil, Nachricht) und die Seite, von der Sie die Anfrage geschickt haben, um Ihre Anfrage zu bearbeiten und Ihnen einen Entwurf zu schicken. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Anbahnung eines Vertrags). Die Daten werden in einer Datenbank des Anbieters Supabase gespeichert (Supabase Inc.; Serverstandort Irland, EU) und gelöscht, wenn sie für die Bearbeitung nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
<h2>Bewerbungsformular</h2>
<p>Wenn Sie sich über das Formular auf der Seite „Für Vertriebler“ bewerben, speichern wir Ihre Angaben (Name, Wohnort, E-Mail, Telefon, Erfahrung, Zeit pro Woche, Nachricht), um Ihre Bewerbung zu prüfen und mit Ihnen Kontakt aufzunehmen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Anbahnung eines Vertragsverhältnisses). Die Daten liegen bei unserem Datenbank-Dienstleister Supabase (Server in der EU, Irland). Kommt keine Zusammenarbeit zustande, löschen wir Ihre Angaben spätestens sechs Monate nach der Absage.</p>
<h2>E-Mail</h2>
<p>Schreiben Sie uns per E-Mail, verarbeiten wir Ihre Nachricht zur Beantwortung (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Unser E-Mail-Postfach wird bei der STRATO GmbH (Otto-Ostrowski-Straße 7, 10249 Berlin) mit Servern in Deutschland geführt.</p>
<h2>Ihre Rechte</h2>
<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wenden Sie sich dafür einfach an die oben genannte Adresse. Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.</p>
<p class="klein">Stand: November 2026</p>
</div></div></section>''', cta=False)

# =====================================================================  SCHREIBEN
for datei, html in SEITEN.items():
    with open(os.path.join(HIER, datei), "w", encoding="utf-8") as f:
        f.write(html)

sitemap = "".join(f"<url><loc>{BASE}{'' if d == 'index.html' else d}</loc><lastmod>2026-10-02</lastmod></url>"
                  for d in SEITEN if d not in ("danke.html", "404.html"))
with open(os.path.join(HIER, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{sitemap}</urlset>\n')
with open(os.path.join(HIER, "robots.txt"), "w", encoding="utf-8") as f:
    f.write(f"User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n")
with open(os.path.join(HIER, "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(LOGO.replace(' aria-hidden="true"', ' xmlns="http://www.w3.org/2000/svg"'))
print("geschrieben:", len(SEITEN), "Seiten")
