/**
 * WebGL fluid ("ink in water") simulation used as the site background.
 * Based on Pavel Dobryakov's WebGL-Fluid-Simulation (MIT), trimmed down and
 * tuned for a burgundy + camel palette. Renders with a transparent
 * background so it works on top of both the dark and light themes.
 */

type RGB = { r: number; g: number; b: number };

export interface Fluid {
  pause: (v: boolean) => void;
  stir: (v: number) => void;
  burst: (x: number, y: number) => void;
  destroy: () => void;
}

interface FBO {
  b: WebGLFramebuffer;
  at: (i: number) => number;
}

interface DoubleFBO {
  rd: FBO;
  wr: FBO;
  swap: () => void;
}

interface Program {
  u: Record<string, WebGLUniformLocation | null>;
  use: () => void;
}

export function createFluid(canvas: HTMLCanvasElement): Fluid | null {
  const MOB = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 700;
  const C = {
    SIM: MOB ? 112 : 200,
    DYE: MOB ? 256 : 512,
    DD: 0.958, // dye dissipation
    VD: 0.96, // velocity dissipation
    PD: 0.8, // pressure dissipation
    PI: MOB ? 8 : 14, // pressure iterations
    CURL: 42,
    SR: 0.22, // splat radius
    SHADE: !MOB,
  };

  const attrs: WebGLContextAttributes = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };

  let ctx = canvas.getContext('webgl2', attrs) as WebGL2RenderingContext | null;
  const isGL2 = !!ctx;
  if (!ctx) {
    ctx = (canvas.getContext('webgl', attrs) ||
      canvas.getContext('experimental-webgl', attrs)) as WebGL2RenderingContext | null;
  }
  if (!ctx) return null;
  const g = ctx;

  let halfFloat: OES_texture_half_float | null = null;
  let linear = true;
  if (isGL2) {
    g.getExtension('EXT_color_buffer_float');
    g.getExtension('EXT_color_buffer_half_float');
  } else {
    halfFloat = g.getExtension('OES_texture_half_float');
    linear = !!g.getExtension('OES_texture_half_float_linear');
    g.getExtension('EXT_color_buffer_half_float');
    if (!halfFloat) return null;
  }
  const HT = isGL2 ? g.HALF_FLOAT : (halfFloat as OES_texture_half_float).HALF_FLOAT_OES;
  const IF = isGL2 ? g.RGBA16F : g.RGBA;
  const FM = g.RGBA;
  const FL = linear ? g.LINEAR : g.NEAREST;

  let destroyed = false;
  let paused = false;
  let raf = 0;
  const cleanups: Array<() => void> = [];

  try {
    const compile = (type: number, src: string) => {
      const sh = g.createShader(type)!;
      g.shaderSource(sh, src);
      g.compileShader(sh);
      if (!g.getShaderParameter(sh, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(sh) || 'shader');
      return sh;
    };

    const VS = compile(
      g.VERTEX_SHADER,
      `precision highp float;
attribute vec2 aPosition;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,
    );

    const mk = (frag: string): Program => {
      const p = g.createProgram()!;
      g.attachShader(p, VS);
      g.attachShader(p, compile(g.FRAGMENT_SHADER, frag));
      g.bindAttribLocation(p, 0, 'aPosition');
      g.linkProgram(p);
      if (!g.getProgramParameter(p, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(p) || 'link');
      const u: Record<string, WebGLUniformLocation | null> = {};
      const n = g.getProgramParameter(p, g.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < n; i++) {
        const name = g.getActiveUniform(p, i)!.name;
        u[name] = g.getUniformLocation(p, name);
      }
      return { u, use: () => g.useProgram(p) };
    };

    const H = `precision highp float;
precision highp sampler2D;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
`;

    const clearP = mk(H + `uniform sampler2D uTexture; uniform float value;
void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`);

    const dispP = mk(H + `uniform sampler2D uTexture; uniform vec2 texelSize; uniform float shade;
void main () {
  vec3 L = texture2D(uTexture, vL).rgb;
  vec3 R = texture2D(uTexture, vR).rgb;
  vec3 T = texture2D(uTexture, vT).rgb;
  vec3 B = texture2D(uTexture, vB).rgb;
  vec3 C = texture2D(uTexture, vUv).rgb;
  float dx = length(R) - length(L);
  float dy = length(T) - length(B);
  vec3 n = normalize(vec3(dx, dy, length(texelSize)));
  float d = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
  C *= mix(1.0, d, shade);
  float a = max(C.r, max(C.g, C.b));
  gl_FragColor = vec4(C, a);
}`);

    const splatP = mk(H + `uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 s = exp(-dot(p, p) / radius) * color;
  gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + s, 1.0);
}`);

    const advP = mk(H + `uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main () {
  vec2 c = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = dissipation * texture2D(uSource, c);
  gl_FragColor.a = 1.0;
}`);

    const divP = mk(H + `uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`);

    const curlP = mk(H + `uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`);

    const vortP = mk(H + `uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main () {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  f /= length(f) + 0.0001;
  f *= curl * C;
  f.y *= -1.0;
  vec2 v = texture2D(uVelocity, vUv).xy;
  gl_FragColor = vec4(v + f * dt, 0.0, 1.0);
}`);

    const presP = mk(H + `uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float d = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((L + R + B + T - d) * 0.25, 0.0, 0.0, 1.0);
}`);

    const gradP = mk(H + `uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 v = texture2D(uVelocity, vUv).xy;
  v -= vec2(R - L, T - B);
  gl_FragColor = vec4(v, 0.0, 1.0);
}`);

    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), g.STATIC_DRAW);
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), g.STATIC_DRAW);
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
    g.enableVertexAttribArray(0);
    g.clearColor(0, 0, 0, 0);

    const blit = (target: WebGLFramebuffer | null) => {
      g.bindFramebuffer(g.FRAMEBUFFER, target);
      g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0);
    };

    const mkF = (w: number, h: number, filter: number): FBO => {
      g.activeTexture(g.TEXTURE0);
      const t = g.createTexture()!;
      g.bindTexture(g.TEXTURE_2D, t);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, filter);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, filter);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texImage2D(g.TEXTURE_2D, 0, IF, w, h, 0, FM, HT, null);
      const b = g.createFramebuffer()!;
      g.bindFramebuffer(g.FRAMEBUFFER, b);
      g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, t, 0);
      if (g.checkFramebufferStatus(g.FRAMEBUFFER) !== g.FRAMEBUFFER_COMPLETE) throw new Error('fbo');
      g.viewport(0, 0, w, h);
      g.clear(g.COLOR_BUFFER_BIT);
      return {
        b,
        at: (i: number) => {
          g.activeTexture(g.TEXTURE0 + i);
          g.bindTexture(g.TEXTURE_2D, t);
          return i;
        },
      };
    };

    const mkD = (w: number, h: number, filter: number): DoubleFBO => {
      let a = mkF(w, h, filter);
      let b = mkF(w, h, filter);
      return {
        get rd() { return a; },
        get wr() { return b; },
        swap() { const x = a; a = b; b = x; },
      };
    };

    const resolution = (r: number) => {
      let ar = g.drawingBufferWidth / g.drawingBufferHeight;
      if (ar < 1) ar = 1 / ar;
      const mx = Math.round(r * ar);
      const mn = Math.round(r);
      return g.drawingBufferWidth > g.drawingBufferHeight ? { w: mx, h: mn } : { w: mn, h: mx };
    };

    let SW = 0, SH = 0, DW = 0, DH = 0;
    let dye: DoubleFBO, vel: DoubleFBO, prs: DoubleFBO, div: FBO, crl: FBO;
    const init = () => {
      const s = resolution(C.SIM);
      const d = resolution(C.DYE);
      SW = s.w; SH = s.h; DW = d.w; DH = d.h;
      dye = mkD(DW, DH, FL);
      vel = mkD(SW, SH, FL);
      div = mkF(SW, SH, g.NEAREST);
      crl = mkF(SW, SH, g.NEAREST);
      prs = mkD(SW, SH, g.NEAREST);
    };

    /* ---- burgundy + camel ink ---- */
    const gen = (): RGB => {
      const j = Math.random();
      if (Math.random() < 0.28) {
        // camel / amber
        return { r: 0.74, g: 0.44 + j * 0.1, b: 0.14 + j * 0.06 };
      }
      // burgundy -> crimson -> rose
      return { r: 0.6 + j * 0.32, g: 0.01 + j * 0.05, b: 0.05 + j * 0.12 };
    };
    const scale = (c: RGB, k: number): RGB => ({ r: c.r * k, g: c.g * k, b: c.b * k });

    const splat = (x: number, y: number, dx: number, dy: number, c: RGB) => {
      g.viewport(0, 0, SW, SH);
      splatP.use();
      g.uniform1i(splatP.u.uTarget, vel.rd.at(0));
      g.uniform1f(splatP.u.aspectRatio, canvas.width / canvas.height);
      g.uniform2f(splatP.u.point, x / canvas.width, 1 - y / canvas.height);
      g.uniform3f(splatP.u.color, dx, -dy, 1);
      g.uniform1f(splatP.u.radius, C.SR / 100);
      blit(vel.wr.b);
      vel.swap();
      g.viewport(0, 0, DW, DH);
      g.uniform1i(splatP.u.uTarget, dye.rd.at(0));
      g.uniform3f(splatP.u.color, c.r, c.g, c.b);
      blit(dye.wr.b);
      dye.swap();
    };

    const multi = (n: number) => {
      for (let i = 0; i < n; i++) {
        splat(
          canvas.width * Math.random(),
          canvas.height * Math.random(),
          1000 * (Math.random() - 0.5),
          1000 * (Math.random() - 0.5),
          scale(gen(), 4),
        );
      }
    };

    const step = (dt: number) => {
      g.disable(g.BLEND);
      g.viewport(0, 0, SW, SH);
      const tx = 1 / SW, ty = 1 / SH;

      curlP.use();
      g.uniform2f(curlP.u.texelSize, tx, ty);
      g.uniform1i(curlP.u.uVelocity, vel.rd.at(0));
      blit(crl.b);

      vortP.use();
      g.uniform2f(vortP.u.texelSize, tx, ty);
      g.uniform1i(vortP.u.uVelocity, vel.rd.at(0));
      g.uniform1i(vortP.u.uCurl, crl.at(1));
      g.uniform1f(vortP.u.curl, C.CURL);
      g.uniform1f(vortP.u.dt, dt);
      blit(vel.wr.b);
      vel.swap();

      divP.use();
      g.uniform2f(divP.u.texelSize, tx, ty);
      g.uniform1i(divP.u.uVelocity, vel.rd.at(0));
      blit(div.b);

      clearP.use();
      g.uniform1i(clearP.u.uTexture, prs.rd.at(0));
      g.uniform1f(clearP.u.value, Math.pow(C.PD, dt * 60));
      blit(prs.wr.b);
      prs.swap();

      presP.use();
      g.uniform2f(presP.u.texelSize, tx, ty);
      g.uniform1i(presP.u.uDivergence, div.at(0));
      for (let i = 0; i < C.PI; i++) {
        g.uniform1i(presP.u.uPressure, prs.rd.at(1));
        blit(prs.wr.b);
        prs.swap();
      }

      gradP.use();
      g.uniform2f(gradP.u.texelSize, tx, ty);
      g.uniform1i(gradP.u.uPressure, prs.rd.at(0));
      g.uniform1i(gradP.u.uVelocity, vel.rd.at(1));
      blit(vel.wr.b);
      vel.swap();

      advP.use();
      g.uniform2f(advP.u.texelSize, tx, ty);
      const vid = vel.rd.at(0);
      g.uniform1i(advP.u.uVelocity, vid);
      g.uniform1i(advP.u.uSource, vid);
      g.uniform1f(advP.u.dt, dt);
      g.uniform1f(advP.u.dissipation, Math.pow(C.VD, dt * 60));
      blit(vel.wr.b);
      vel.swap();

      g.viewport(0, 0, DW, DH);
      g.uniform1i(advP.u.uVelocity, vel.rd.at(0));
      g.uniform1i(advP.u.uSource, dye.rd.at(1));
      g.uniform1f(advP.u.dissipation, Math.pow(C.DD, dt * 60));
      blit(dye.wr.b);
      dye.swap();
    };

    const render = () => {
      const w = g.drawingBufferWidth, h = g.drawingBufferHeight;
      g.bindFramebuffer(g.FRAMEBUFFER, null);
      g.viewport(0, 0, w, h);
      g.disable(g.BLEND);
      g.clear(g.COLOR_BUFFER_BIT);
      g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);
      g.enable(g.BLEND);
      dispP.use();
      g.uniform2f(dispP.u.texelSize, 1 / w, 1 / h);
      g.uniform1i(dispP.u.uTexture, dye.rd.at(0));
      g.uniform1f(dispP.u.shade, C.SHADE ? 1 : 0);
      blit(null);
    };

    /* ---- input: real pointer + an invisible cursor that orbits forever ---- */
    const ptr = { x: 0, y: 0, dx: 0, dy: 0, moved: false, ever: false, color: gen() };
    const pos = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      return [cx - r.left, cy - r.top];
    };
    const onMouse = (e: MouseEvent) => {
      const [x, y] = pos(e.clientX, e.clientY);
      if (!ptr.ever) { ptr.ever = true; ptr.x = x; ptr.y = y; return; }
      ptr.moved = true;
      ptr.dx = Math.max(-900, Math.min(900, (x - ptr.x) * 3.2));
      ptr.dy = Math.max(-900, Math.min(900, (y - ptr.y) * 3.2));
      ptr.x = x; ptr.y = y;
      ptr.color = gen();
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.targetTouches[0];
      if (!t) return;
      const [x, y] = pos(t.clientX, t.clientY);
      ptr.moved = ptr.ever;
      ptr.ever = true;
      ptr.dx = (x - ptr.x) * 8;
      ptr.dy = (y - ptr.y) * 8;
      ptr.x = x; ptr.y = y;
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.targetTouches[0];
      if (!t) return;
      const [x, y] = pos(t.clientX, t.clientY);
      ptr.x = x; ptr.y = y;
      ptr.color = gen();
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    cleanups.push(() => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
    });

    const stack: number[] = [];
    /* invisible "wanderer": glides between random targets, never a fixed loop */
    let vx = 0, vy = 0, seeded = false, vc: RGB | null = null, vct = 0;
    let wx = 0, wy = 0, wvx = 0, wvy = 0, tx = 0, ty = 0, tnext = 0;
    const t0 = Date.now();
    const orbit = (f: number) => {
      const now = Date.now();
      if (now - t0 < 700) return;
      const W = canvas.width, H = canvas.height;
      if (!seeded) {
        wx = tx = W * (0.2 + Math.random() * 0.6);
        wy = ty = H * (0.2 + Math.random() * 0.6);
      }
      // pick a fresh random destination every 0.8 - 2.6 s
      if (now > tnext) {
        tx = W * (0.08 + Math.random() * 0.84);
        ty = H * (0.1 + Math.random() * 0.8);
        tnext = now + 800 + Math.random() * 1800;
      }
      // spring toward target + random jitter = organic, unpredictable path
      wvx += ((tx - wx) * 0.0035 + (Math.random() - 0.5) * 1.25) * f;
      wvy += ((ty - wy) * 0.0035 + (Math.random() - 0.5) * 1.25) * f;
      const damp = Math.pow(0.965, f);
      wvx *= damp; wvy *= damp;
      wx += wvx * f; wy += wvy * f;
      wx = Math.max(0, Math.min(W, wx));
      wy = Math.max(0, Math.min(H, wy));
      if (!seeded) { seeded = true; vx = wx; vy = wy; return; }
      if (!vc || now - vct > 120) { vc = scale(gen(), 1.7); vct = now; }
      const dx = ((wx - vx) * 9) / f, dy = ((wy - vy) * 9) / f;
      vx = wx; vy = wy;
      splat(wx, wy, dx, dy, vc);
    };
    const input = () => {
      const n = stack.pop();
      if (n) multi(n);
      if (ptr.moved) { splat(ptr.x, ptr.y, ptr.dx, ptr.dy, ptr.color); ptr.moved = false; }
    };

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    init();
    multi(34);
    for (let i = 0; i < 8; i++) stack.push(10 + Math.floor(Math.random() * 10));

    let lastT = performance.now();
    const tick = (now: number) => {
      if (destroyed) return;
      raf = requestAnimationFrame(tick);
      if (paused) { lastT = now; return; }
      // real delta time (clamped) so speed is identical on 60 / 120 / 144 Hz screens
      const dt = Math.min(1 / 30, Math.max(1 / 144, (now - lastT) / 1000));
      lastT = now;
      const f = dt * 60;
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        if (!canvas.clientWidth || !canvas.clientHeight) return;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        init();
      }
      orbit(f);
      input();
      step(dt);
      render();
    };
    raf = requestAnimationFrame(tick);

    return {
      pause: (v: boolean) => { paused = v; },
      /** radial ink burst at a viewport position (used for clicks) */
      burst: (px: number, py: number) => {
        const x = (px / window.innerWidth) * canvas.width;
        const y = (py / window.innerHeight) * canvas.height;
        const n = 9;
        const rot = Math.random() * Math.PI;
        for (let i = 0; i < n; i++) {
          const a = rot + (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
          const sp = 380 + Math.random() * 420;
          splat(x, y, Math.cos(a) * sp, Math.sin(a) * sp, scale(gen(), 1.9));
        }
      },
      stir: (v: number) => {
        splat(
          canvas.width * (0.12 + Math.random() * 0.76),
          canvas.height * (0.3 + Math.random() * 0.4),
          (Math.random() - 0.5) * 300,
          -v * 14,
          scale(gen(), 1.6),
        );
      },
      destroy: () => {
        destroyed = true;
        cancelAnimationFrame(raf);
        cleanups.forEach(f => f());
      },
    };
  } catch {
    cleanups.forEach(f => f());
    return null;
  }
}
