/* crestra – Wellenlandschaft (WebGL2). Fließende Höhenlinien in Türkis, reagiert auf die Maus. */
(() => {
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FS = `#version 300 es
precision highp float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform float leise;
out vec4 o;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a*n(p); p = p*2.03 + 1.7; a *= .5; } return v; }
void main(){
  vec2 uv = (gl_FragCoord.xy - .5*r) / r.y;
  vec2 q = uv * vec2(1.25, 1.9);
  q += vec2(t*.018, -t*.01);
  vec2 w = vec2(sin(q.y*1.7 + t*.21 + sin(q.x*1.3 - t*.13)), cos(q.x*1.5 - t*.17 + sin(q.y*1.1 + t*.11))) * .35;
  float d = length(uv - m);
  float e = fbm(q + 1.4*w) - .22*exp(-d*d*5.5);
  float k = e * 13.;
  float lw = fwidth(k);
  float dl = abs(fract(k - .5) - .5);
  float linie = 1. - smoothstep(.35*lw, 1.25*lw, dl);
  float k4 = k * .25; float lw4 = fwidth(k4);
  float dd = abs(fract(k4 - .5) - .5);
  float dick = 1. - smoothstep(.6*lw4, 2.0*lw4, dd);
  vec3 bg = vec3(.027, .043, .078);
  vec3 tuerkis = vec3(.13, .70, .79);
  vec3 hell = vec3(.55, .92, .96);
  float naeh = exp(-d*d*3.);
  float y = gl_FragCoord.y / r.y;
  float x = gl_FragCoord.x / r.x;
  float kamm = smoothstep(.35, 1.05, e);
  float sicht = mix(.12, 1., smoothstep(.25, .95, x)) * mix(.45, 1., y);
  vec3 c = bg + vec3(.0, .03, .05) * kamm * sicht;
  c += tuerkis * linie * (.18 + .55*kamm) * sicht;
  c += hell * dick * (.12 + .45*kamm) * sicht;
  c += hell * linie * naeh * .35;
  c += tuerkis * .05 * naeh;
  c *= mix(1., .72, leise);
  float vig = smoothstep(1.25, .2, length(uv*vec2(.8, 1.)));
  c *= mix(.55, 1., vig);
  o = vec4(c, 1.);
}`;
  const VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

  const leinwaende = [...document.querySelectorAll('canvas[data-welle]')];
  leinwaende.forEach(cv => {
    const gl = cv.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) { cv.classList.add('ohne-gl'); return; }
    const sh = (typ, src) => { const s = gl.createShader(typ); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    let prg;
    try {
      prg = gl.createProgram(); gl.attachShader(prg, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prg, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prg);
      if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prg));
    } catch (e) { console.warn('Welle aus:', e.message); cv.classList.add('ohne-gl'); return; }
    gl.useProgram(prg);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prg, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prg, 'r'), uT = gl.getUniformLocation(prg, 't'), uM = gl.getUniformLocation(prg, 'm'), uL = gl.getUniformLocation(prg, 'leise');
    gl.uniform1f(uL, cv.classList.contains('welle-leise') ? 1 : 0);
    const klein = matchMedia('(max-width: 760px)').matches;
    const dpr = klein ? .6 : .75;
    const groesse = () => {
      const b = cv.clientWidth, hh = cv.clientHeight;
      cv.width = Math.max(1, Math.round(b * dpr)); cv.height = Math.max(1, Math.round(hh * dpr));
      gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(uR, cv.width, cv.height);
    };
    groesse(); new ResizeObserver(groesse).observe(cv);
    // Maus (sanft nachgeführt), auf Touch: langsame Eigenbewegung
    let mx = .35, my = .05, zx = mx, zy = my;
    const host = cv.parentElement;
    host.addEventListener('pointermove', e => {
      const b = cv.getBoundingClientRect();
      zx = ((e.clientX - b.left) - b.width / 2) / b.height;
      zy = -((e.clientY - b.top) - b.height / 2) / b.height;
    });
    let sichtbar = true, start = performance.now(), letzte = 0;
    new IntersectionObserver(es => { sichtbar = es[0].isIntersecting; if (sichtbar) requestAnimationFrame(tick); }).observe(cv);
    const tick = (now) => {
      if (!sichtbar || document.hidden) return;
      if (now - letzte < 21) { requestAnimationFrame(tick); return; }
      const t = (now - start) / 1000;
      if (!matchMedia('(hover:hover)').matches) { zx = .35 * Math.sin(t * .2); zy = .12 * Math.cos(t * .17); }
      mx += (zx - mx) * .05; my += (zy - my) * .05;
      gl.uniform1f(uT, ruhig ? 8 : t + 8); gl.uniform2f(uM, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      letzte = now;
      if (!ruhig) requestAnimationFrame(tick);
    };
    document.addEventListener('visibilitychange', () => { if (!document.hidden && sichtbar) requestAnimationFrame(tick); });
    requestAnimationFrame(tick);
    cv.classList.add('laeuft');
  });
})();
