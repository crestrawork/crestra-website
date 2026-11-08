/* crestra – 3D-Raum: Partikelwelt + chromfarbenes Logo, das durch die Seite fliegt. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const cv = document.querySelector('canvas.raum');
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const klein = matchMedia('(max-width: 760px)').matches;
const maus = matchMedia('(hover:hover)').matches;

let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: !klein, alpha: false, powerPreference: 'high-performance' }); }
catch (e) { cv.remove(); throw e; }
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, klein ? 1.3 : 1.5));
renderer.setClearColor(0x05080f, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const szene = new THREE.Scene();
szene.fog = new THREE.FogExp2(0x05080f, .045);
const kamera = new THREE.PerspectiveCamera(42, 1, .1, 100);
kamera.position.set(0, 0, 11);

const pmrem = new THREE.PMREMGenerator(renderer);
szene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;

/* ---------- Logo: chromfarbenes c + leuchtender Cursor ---------- */
const logo = new THREE.Group();
const chrom = new THREE.MeshPhysicalMaterial({ color: 0xdfeef2, metalness: 1, roughness: .16, clearcoat: 1, clearcoatRoughness: .08, iridescence: .55, iridescenceIOR: 1.6, envMapIntensity: 1.25 });
const bogen = Math.PI * 1.52;
const ring = new THREE.Mesh(new THREE.TorusGeometry(1, .34, 40, 140, bogen), chrom);
ring.rotation.z = (Math.PI * 2 - bogen) / 2; // Öffnung nach rechts
logo.add(ring);
const kappe = new THREE.SphereGeometry(.34, 32, 20);
[0, bogen].forEach(w => { const k = new THREE.Mesh(kappe, chrom); k.position.set(Math.cos(w + ring.rotation.z), Math.sin(w + ring.rotation.z), 0); logo.add(k); });
const strichMat = new THREE.MeshStandardMaterial({ color: 0x6fd0de, emissive: 0x22b3c9, emissiveIntensity: 2.2, roughness: .3 });
const strich = new THREE.Mesh(new THREE.CapsuleGeometry(.15, 1.75, 8, 20), strichMat);
strich.position.set(1.72, 0, 0);
logo.add(strich);
const glanz = new THREE.PointLight(0x22b3c9, 6, 7, 2); glanz.position.set(1.72, 0, .6); logo.add(glanz);
logo.position.set(2.6, .2, 0);
szene.add(logo);
szene.add(new THREE.AmbientLight(0x88aabb, .25));
const rand = new THREE.DirectionalLight(0x6fd0de, 2.2); rand.position.set(-4, 3, 2); szene.add(rand);
const gegen = new THREE.DirectionalLight(0xffffff, 1.2); gegen.position.set(5, -2, 6); szene.add(gegen);

/* ---------- Partikel mit vier Formationen ---------- */
const N = klein ? 6500 : 14000;
const A = new Float32Array(N * 3), B = new Float32Array(N * 3), C = new Float32Array(N * 3), D = new Float32Array(N * 3), Z = new Float32Array(N);
const zufall = (a, b) => a + Math.random() * (b - a);
for (let i = 0; i < N; i++) {
  const j = i * 3;
  // A: Wolke (Kugelschale)
  const r = Math.cbrt(zufall(.15, 1)) * 10, th = Math.acos(zufall(-1, 1)), ph = zufall(0, Math.PI * 2);
  A[j] = r * Math.sin(th) * Math.cos(ph) * 1.4; A[j + 1] = r * Math.sin(th) * Math.sin(ph) * .8; A[j + 2] = r * Math.cos(th) - 3;
  // B: Wellenlandschaft
  const gx = zufall(-14, 14), gz = zufall(-14, 4);
  B[j] = gx; B[j + 2] = gz; B[j + 1] = -2.6 + Math.sin(gx * .55) * .6 + Math.cos(gz * .45 + gx * .2) * .7;
  // C: wird nach dem Laden der Schrift mit dem Schriftzug „crestra|“ gefüllt (bauWort)
  C[j] = A[j]; C[j + 1] = A[j + 1]; C[j + 2] = A[j + 2];
  // D: Tunnel
  const tw = zufall(0, Math.PI * 2), tr = zufall(4.2, 6.5);
  D[j] = Math.cos(tw) * tr; D[j + 1] = Math.sin(tw) * tr * .75; D[j + 2] = zufall(-40, 8);
  Z[i] = Math.random();
}
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(A, 3));
geo.setAttribute('pB', new THREE.BufferAttribute(B, 3));
geo.setAttribute('pC', new THREE.BufferAttribute(C, 3));
geo.setAttribute('pD', new THREE.BufferAttribute(D, 3));
geo.setAttribute('z', new THREE.BufferAttribute(Z, 1));
const uni = { uT: { value: 0 }, uStufe: { value: 0 }, uMaus: { value: new THREE.Vector3(99, 99, 0) }, uPx: { value: renderer.getPixelRatio() }, uFlug: { value: 0 } };
const pMat = new THREE.ShaderMaterial({
  uniforms: uni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `
    attribute vec3 pB; attribute vec3 pC; attribute vec3 pD; attribute float z;
    uniform float uT, uStufe, uPx, uFlug; uniform vec3 uMaus;
    varying float vA; varying float vZ;
    void main(){
      float wA = clamp(1. - abs(uStufe - 0.), 0., 1.), wB = clamp(1. - abs(uStufe - 1.), 0., 1.);
      float wC = clamp(1. - abs(uStufe - 2.), 0., 1.), wD = clamp(1. - abs(uStufe - 3.), 0., 1.);
      vec3 p = position*wA + pB*wB + pC*wC + pD*wD;
      p.y += wB * (sin(p.x*.6 + uT*.8) * .35 + cos(p.z*.5 + uT*.6) * .3);
      p.z += wD * mod(uFlug + uT*2., 48.) ; if (wD > .5 && p.z > 9.) p.z -= 48.;
      p += vec3(sin(uT*.5 + z*40.), cos(uT*.4 + z*31.), sin(uT*.3 + z*17.)) * (.12 + wA*.25) * (1. - wC*.88);
      vec3 d = p - uMaus; float dl = length(d.xy);
      p.xy += normalize(d.xy + 1e-4) * smoothstep(1.5, 0., dl) * .7;
      vec4 mv = modelViewMatrix * vec4(p, 1.);
      gl_Position = projectionMatrix * mv;
      float s = mix(mix(1.4, 4.0, z*z), 3.1, wC) * (1. + smoothstep(1.5, 0., dl));
      gl_PointSize = s * uPx * (14. / -mv.z);
      vA = smoothstep(42., 4., -mv.z) * mix(.35 + .65*z, 1.15, wC);
      vZ = z;
    }`,
  fragmentShader: `
    varying float vA; varying float vZ;
    void main(){
      vec2 c = gl_PointCoord - .5; float d = length(c);
      float a = smoothstep(.5, .0, d);
      vec3 farbe = mix(vec3(.13,.70,.79), vec3(.82,.96,.98), step(.86, vZ));
      gl_FragColor = vec4(farbe, a * vA * 1.1);
    }`
});
const punkte = new THREE.Points(geo, pMat);
szene.add(punkte);

/* ---------- Schriftzug „crestra|“ aus Partikeln ---------- */
const bauWort = async () => {
  try { await document.fonts.load('800 250px Hanken'); await document.fonts.ready; } catch (e) {}
  const W = 1400, H = 340, cnv = document.createElement('canvas'); cnv.width = W; cnv.height = H;
  const ctx = cnv.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.font = '800 250px Hanken, Helvetica, Arial, sans-serif';
  ctx.letterSpacing = '10px';
  const breite = ctx.measureText('crestra').width, x0 = (W - breite) / 2;
  ctx.fillText('crestra', x0, H / 2 + 8);
  const daten = ctx.getImageData(0, 0, W, H).data, voll = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (daten[(y * W + x) * 4 + 3] > 200) voll.push(x, y);
  if (!voll.length) return;
  const zielBreite = klein ? 7.0 : 12.5, mass = zielBreite / W;
  const pc = geo.getAttribute('pC');
  for (let i = 0; i < N; i++) {
    const k = Math.floor(Math.random() * (voll.length / 2)) * 2;
    pc.array[i * 3] = (voll[k] - W / 2 + Math.random() * 1.5) * mass;
    pc.array[i * 3 + 1] = -(voll[k + 1] - H / 2 + Math.random() * 2) * mass + (klein ? .4 : .3);
    pc.array[i * 3 + 2] = (Math.random() - .5) * .12 - 1;
  }
  pc.needsUpdate = true;
};
bauWort();

/* ---------- Größe ---------- */
let altB = 0, altH = 0;
const groesse = () => {
  const b = innerWidth, h = innerHeight;
  if (klein && b === altB && Math.abs(h - altH) < 180) return; // Safari-Adressleiste: nicht springen
  altB = b; altH = h;
  renderer.setSize(b, h, false); kamera.aspect = b / h;
  kamera.position.z = b < 760 ? 15 : 11;
  kamera.updateProjectionMatrix();
};
groesse(); addEventListener('resize', groesse);

/* ---------- Szenen je Abschnitt ---------- */
const ZIELE = {
  held:     { stufe: 0, x: 2.7,  y: .25, z: 0,   s: 1.25, dreh: .25 },
  manifest: { stufe: 1, x: 5.7,  y: -2.3,z: -1,  s: .75,  dreh: .5 },
  spiel:    { stufe: 1, x: 7.5,  y: -3.5,z: -2,  s: .0001,dreh: .8 },
  weg:      { stufe: 3, x: 0,    y: -6,  z: -1.5,s: .0001,dreh: 2.2 },
  marke:    { stufe: 2, x: 0,    y: -3.1,z: 0,   s: .0001,dreh: 1.4 },
  wand:     { stufe: 1, x: 5.7,  y: -2.4,z: -1,  s: .65,  dreh: .6 },
  rechner:  { stufe: 0, x: 7.5,  y: 0,   z: -1.5,s: .0001,dreh: .4 },
  preis:    { stufe: 0, x: 5.6,  y: 3.1, z: -1,  s: .5,   dreh: .3 },
  anfrage:  { stufe: 1, x: -5.0, y: -3.0,z: -2,  s: .55,  dreh: .5 },
};
const WEG = { s: .0001 };
const KLEIN = { held: { x: 0, y: 3.55, s: .52 }, manifest: WEG, spiel: WEG, weg: WEG, marke: WEG, wand: WEG, rechner: WEG, preis: WEG, anfrage: WEG };
const ist = { stufe: 0, x: ZIELE.held.x, y: ZIELE.held.y, z: 0, s: ZIELE.held.s, dreh: .25 };
if (klein) Object.assign(ist, KLEIN.held);
const gehe = (name) => {
  const z = Object.assign({}, ZIELE[name], klein ? (KLEIN[name] || {}) : {});
  if (window.gsap) gsap.to(ist, { ...z, duration: 1.8, ease: 'power3.inOut', overwrite: true });
  else Object.assign(ist, z);
};
const starte = () => {
  if (!window.ScrollTrigger) return setTimeout(starte, 100);
  document.querySelectorAll('[data-szene]').forEach(el => {
    ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onEnter: () => gehe(el.dataset.szene), onEnterBack: () => gehe(el.dataset.szene) });
  });
};
starte();

/* ---------- Maus & Scrolltempo ---------- */
let mx = 0, my = 0, zmx = 0, zmy = 0, tempo = 0, letzteY = scrollY;
let bewegt = false;
if (maus) addEventListener('pointermove', e => { bewegt = true; zmx = e.clientX / innerWidth * 2 - 1; zmy = -(e.clientY / innerHeight * 2 - 1); });
const ray = new THREE.Raycaster(), ebene = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), treffer = new THREE.Vector3();

/* ---------- Schleife ---------- */
let sichtbar = !document.hidden, t0 = performance.now(), rot = 0;
document.addEventListener('visibilitychange', () => { sichtbar = !document.hidden; if (sichtbar) requestAnimationFrame(bild); });
const bild = (now) => {
  if (!sichtbar) return;
  const t = (now - t0) / 1000;
  const dy = scrollY - letzteY; letzteY = scrollY; tempo += (Math.min(60, Math.abs(dy)) - tempo) * .08;
  mx += (zmx - mx) * .06; my += (zmy - my) * .06;
  uni.uT.value = t; uni.uStufe.value = ist.stufe;
  if (maus && bewegt) { ray.setFromCamera({ x: mx, y: my }, kamera); ray.ray.intersectPlane(ebene, treffer); uni.uMaus.value.copy(treffer); }
  rot += (ist.dreh + tempo * .06) * .016;
  let mitlauf = 0;
  if (klein) { const sicht = 2 * (kamera.position.z - ist.z) * Math.tan(THREE.MathUtils.degToRad(kamera.fov / 2)); mitlauf = Math.min(scrollY, innerHeight * 1.3) * sicht / innerHeight; }
  logo.position.set(ist.x + mx * .35, ist.y + my * .25 + Math.sin(t * .9) * .12 + mitlauf, ist.z);
  logo.scale.setScalar(ist.s);
  logo.rotation.set(-.25 + my * .35 + Math.sin(t * .5) * .08, rot * .6 + mx * .6, Math.sin(t * .4) * .1);
  strichMat.emissiveIntensity = (Math.floor(t / .55) % 2 === 0) ? 3.2 : 1.1;
  const ruheWort = Math.max(0, 1 - Math.abs(ist.stufe - 2));
  punkte.rotation.y = (mx * .08 + Math.sin(t * .12) * .12) * (1 - ruheWort); punkte.rotation.x = my * .05 * (1 - ruheWort);
  kamera.position.x += (mx * .4 * (1 - ruheWort) - kamera.position.x) * .04; kamera.position.y += (my * .25 * (1 - ruheWort) - kamera.position.y) * .04;
  kamera.lookAt(0, 0, -2);
  renderer.render(szene, kamera);
  if (!ruhig) requestAnimationFrame(bild);
};
requestAnimationFrame(bild);
document.documentElement.classList.add('raum-an');
