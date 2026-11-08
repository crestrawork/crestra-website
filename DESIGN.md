# crestra – Design-Kontrakt (2.10.2026)

**Leitidee: Schaufenster.** crestra erzählt nicht, crestra zeigt. Der Inhalt der Seite sind die
gebauten Websites selbst: echte Screenshots, in echten Größen, scharf (2-fache Auflösung).
Keine Stock- oder KI-Bilder – das einzige „Bildmaterial“ ist die eigene Arbeit.

**Zielgruppe:** Inhaber von Betrieben mit hohem Auftragswert (Solar, Makler, Autohandel,
Energieberatung). Tonlage: ruhig, sachlich, per Sie, keine Agentur-Floskeln.

**Signature: Handy-Probe.** Gepinnter Abschnitt (kurz, ~240vh): Eine Seite im Browserfenster
schrumpft in ein Handy und wird dort winzig und unlesbar – dann wechselt der Bildschirm auf die
echte Handy-Fassung. Erzählt das Kernargument (Kunden kommen übers Handy) mit echtem Material.

**Typo:** Hanken Grotesk (variabel, 400–800) für alles, eng gesetzte Überschriften;
Newsreader kursiv für genau ein Akzentwort pro Überschrift. Bewusst nicht: Fraunces, Inter,
Instrument, Schibsted, Archivo, Manrope, Figtree, Saira, Plex, Barlow, Public Sans, Bricolage.

**Farbe:** crestra-Blau #2446e8 (aus dem App-Icon), Tinte #111725, Papier #fff / #f4f5f7,
Nacht #0e1320 für die zwei dunklen Abschnitte (Handy-Probe, Kontakt).

**Navigation:** klassische Kopfzeile, weiß, Wortmarke links, 5 klare Punkte + „Branchen“-
Ausklappmenü, blauer Knopf „Entwurf anfordern“ rechts. Handy: Burger, Vollbild-Menü.

**Bausteine Startseite (6):** ruhiger Einstieg mit Gerät (echte Kundenseite), Handy-Probe,
Branchen-Umschalter (Klick, kein Scroll), Rechner „Rechnet sich das?“, Preis als Liste,
Anfrage-Formular direkt im Abschnitt.

**Bewusst nicht:** Foto-Scroll-Through aus Standbildern (Ritter-Lehre 1.10.: überzeugt nicht),
Pillen, Karten-Schatten, Eyebrows mit Nummern, Zähler, Bento, Laufschrift, Custom-Cursor.

**Regler:** Dichte 4 (luftig, aber kompakte Abschnitte) · Kontrast 7 (klares Hell/Dunkel) ·
Bewegung 6 (eine starke Szene, sonst ruhige Reveals – die Arbeiten sollen wirken, nicht die Effekte).

## Änderung 2.10.2026 abends (Nils' Feedback)
- Alle Handy-Rahmen entfernt (Einstieg, Arbeiten, Handy-Probe-Szene, Ansichts-Umschalter): „sehen aus, als würde die Website nicht aufs Handy passen“. Lehre: keine Handy-Mockups mit verkleinerten Screenshots.
- Keine Branchen-Einschränkung mehr: 4 Branchenseiten + Menü „Branchen“ gestrichen, neuer dunkler Abschnitt „Für jeden Betrieb, der vor Ort gefunden werden will“ (8 Branchen + „Fragen Sie trotzdem“). Einstieg: Text oben, großer Bildschirm-Screenshot darunter.

## Fassung 3.10.2026 – „viel krasser“ (Nils: „wir verkaufen Websites, das muss alles noch viel krasser sein“)
- Einstieg dunkel, bildschirmfüllend: live gerechnete WebGL2-Wellenlandschaft (`welle.js`, Höhenlinien in Türkis, folgt der Maus, pausiert außerhalb des Bildes), Überschrift Buchstabe für Buchstabe, blinkender Cursor aus dem Logo, Lichtkegel folgt der Maus.
- Manifest-Text färbt sich beim Scrollen Wort für Wort.
- „So bekommen Sie Ihren Gratis-Entwurf“: gepinnte waagerechte Fahrt mit Riesenwörtern (Anfrage → Entwurf → Entscheidung → Live.), Fortschrittslinie; Handy: senkrecht.
- Branchen-Wand: Riesenwörter leuchten nacheinander auf.
- Preis-Bühne dunkel mit Zahlen aus der Maske (Verlauf Weiß→Türkis).
- Anfrage + alle Unterseiten-Köpfe mit leiser Welle im Hintergrund. Kopfzeile schaltet über dunklen Abschnitten auf hell.
- Gepinnt nur die waagerechte Fahrt (Warin-Regel).

## 3.10.2026 nachmittags – „lagged ein bisschen, immer noch zu unspannend“
- Leistung: Welle in 0,75-facher Auflösung, 4 statt 5 Rauschebenen, Verzerrung per sin statt Rauschen, max. ~45 Bilder/s → Messung 60 fps stehend und beim Scrollen (vorher 41). Lenis direkter (lerp .14), kein mix-blend-mode.
- Neu: Überschrift weicht der Maus aus und leuchtet; „Erst sehen. Dann entscheiden.“ – Flug in den Punkt (scharfe Kreis-Blende per clip-path, füllt den Bildschirm weiß → Manifest); Spielwiese „Fühlen Sie mal.“ (Text würfelt, 3D-Karte mit Glanz, Magnet-Knopf, Lichtspur).
- Gepinnt: Punkt-Flug (kurz, sticky) + waagerechte Fahrt.

## 3.10.2026 abends – 3D (Nils wählte Noomo + Active Theory als Vorbild)
- Startseite komplett dunkel; `raum.js` (Three.js 0.170 per Importmap/jsDelivr): fester Hintergrund mit 14 000 Partikeln (Handy 6 500), die je Abschnitt die Form wechseln (Wolke → Wellenlandschaft → Tunnel bei der waagerechten Fahrt → „c“ aus Partikeln bei Branchen/Preis), weichen der Maus aus.
- Logo als 3D-Objekt: chromfarbenes, schillerndes „c“ + leuchtender, blinkender Cursor-Strich; fliegt je Abschnitt an eine neue Stelle (`ZIELE`/`KLEIN` in raum.js), dreht sich mit Maus und Scrolltempo.
- Punkt-Flug entfernt (weißer Blitz passte nicht in die dunkle Seite). Abschnitte transparent, Rechner/Formular als Glas.
- Leistung: echte GPU (M4) ~570 fps ohne Bildratenbegrenzung → reichlich Luft. Headless-Tests laufen mit Software-Grafik (SwiftShader) und sind dafür nicht aussagekräftig – für Messungen `perf-gpu.js` (headed) nutzen.

## 9.11.2026 – ruhige Fassung (Nils: „ein bisschen zu anstrengend“)
- 3D-Partikelwelt (raum.js), WebGL-Welle (welle.js), Intro, Seitenvorhang, Lenis, GSAP, Magnet-Knöpfe, Spielwiese, gepinnte Fahrt, Branchen-Wand, Preis-Bühne: alles entfernt. Keine externen Skripte mehr.
- Startseite hell, normales Scrollen, nur sanftes Einblenden (IntersectionObserver): Einstieg (Text + Eckdaten), 4 Schritte, Für jeden Betrieb, Rechner, Preis, Anfrage (dunkel), Hinweis „Für Vertriebler“.
- Neu: vertrieb.html (Für Vertriebler, 250 €/Kunde, Bewerbungsformular → Supabase-Tabelle `bewerbungen`, SQL in supabase/bewerbungen.sql) + danke-bewerbung.html. Menüpunkt „Für Vertriebler“ statt „Ratgeber“ (Ratgeber im Fuß).
- Formulare prüfen Felder beim Tippen statt beim Verlassen (vorher rutschte der Knopf beim Klick weg).
