// Yeshua — sons de méditation générés dans l'application (aucun fichier audio, fonctionne sans Internet).
// Instrumentaux originaux : nappe d'orgue/cordes, piano doux, orgue de prière, pluie. Ma musique : fichiers ajoutés par l'utilisateur.
(function () {
  "use strict";
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const CH = { maj9: [0, 4, 7, 11, 14], min9: [0, 3, 7, 10, 14], six: [0, 4, 7, 9, 14], dom: [0, 4, 7, 10, 14], sus: [0, 5, 7, 10, 14] };
  // key = tonique (0 = do), chords = [degré en demi-tons, type], cd = durée d'un accord en secondes
  const STYLES = {
    gospel: { key: 5, cd: 8, chords: [[0, "maj9"], [9, "min9"], [5, "maj9"], [7, "sus"]], pad: 1, piano: 1, bass: 1 },
    organ: { key: 10, cd: 9, chords: [[0, "six"], [5, "six"], [0, "six"], [7, "dom"]], organ: 1, bass: 1 },
    piano: { key: 2, cd: 8, chords: [[0, "maj9"], [7, "six"], [9, "min9"], [5, "maj9"]], pad: 0.55, piano: 1.25 },
    rain: { key: 9, cd: 12, chords: [[0, "sus"], [5, "maj9"]], pad: 0.4, rain: 1 }
  };
  const IDS = Object.keys(STYLES);

  function impulse(ctx, sec, R) {
    const n = Math.floor(ctx.sampleRate * sec), buf = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (R() * 2 - 1) * Math.pow(1 - i / n, 2.6); }
    return buf;
  }
  function noiseBuf(ctx, sec, R) {
    const n = Math.floor(ctx.sampleRate * sec), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0); let last = 0;
    for (let i = 0; i < n; i++) { const w = R() * 2 - 1; last = (last + 0.04 * w) / 1.04; d[i] = last * 3.2; }
    return buf;
  }
  const voice = (root, type, lo, hi) => CH[type].map((i) => { let m = root + i; while (m < lo) m += 12; while (m > hi) m -= 12; return m; }).sort((a, b) => a - b);

  // Construit la partition d'un style sur ctx ; schedule(until) programme les notes jusqu'à "until" (secondes du contexte)
  function build(ctx, id, out, seed, startAt) {
    const st = STYLES[id] || STYLES.gospel, R = rng(seed || 7), live = [];
    const bus = ctx.createGain(), dry = ctx.createGain(), wet = ctx.createGain(), conv = ctx.createConvolver();
    conv.buffer = impulse(ctx, 3, R); dry.gain.value = 0.8; wet.gain.value = 0.4;
    bus.connect(dry); bus.connect(conv); conv.connect(wet); dry.connect(out); wet.connect(out);
    const track = (o, end) => { o.stop(end); live.push(o); };
    function env(g, t, a, hold, r, peak) {
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a);
      g.gain.setValueAtTime(peak, t + a + hold); g.gain.linearRampToValueAtTime(0.0001, t + a + hold + r);
    }
    function pad(t, dur, m, vol) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 1000; f.Q.value = 0.4;
      const g = ctx.createGain(); env(g, t, 2.6, Math.max(0, dur - 2.6), 3.6, vol); f.connect(g); g.connect(bus);
      [-7, 7].forEach((dt) => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = mtof(m); o.detune.value = dt; o.connect(f); o.start(t); track(o, t + dur + 3.8); });
    }
    function organ(t, dur, notes, vol) {
      const trem = ctx.createGain(); trem.gain.value = 0.86; trem.connect(bus);
      const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 5.4; lg.gain.value = 0.11; lfo.connect(lg); lg.connect(trem.gain); lfo.start(t); track(lfo, t + dur + 3);
      notes.forEach((m) => {
        const g = ctx.createGain(); env(g, t, 1.3, Math.max(0, dur - 1.3), 2.4, vol); g.connect(trem);
        [[1, 1], [2, 0.5], [3, 0.3], [4, 0.18]].forEach(([r, a]) => { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = "sine"; o.frequency.value = mtof(m) * r; og.gain.value = a; o.connect(og); og.connect(g); o.start(t); track(o, t + dur + 2.6); });
      });
    }
    function bass(t, dur, m, vol) {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = mtof(m); env(g, t, 0.5, Math.max(0, dur - 0.5), 2, vol); o.connect(g); g.connect(bus); o.start(t); track(o, t + dur + 2.2);
    }
    function piano(t, m, vol) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 2600;
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);
      f.connect(g); g.connect(bus);
      [[1, "triangle", 1], [2, "sine", 0.28], [3, "sine", 0.1]].forEach(([r, ty, a]) => { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = ty; o.frequency.value = mtof(m) * r; og.gain.value = a; o.connect(og); og.connect(f); o.start(t); track(o, t + 3.5); });
    }
    function rain(t) {
      const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 4, R); src.loop = true;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2200; const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 280;
      const g = ctx.createGain(); g.gain.value = 0.2; src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(bus); src.start(t); live.push(src);
    }
    function drops(t, dur) {
      for (let i = 0; i < 14; i++) {
        const tt = t + R() * dur, o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = 1800 + R() * 2600;
        g.gain.setValueAtTime(0.0001, tt); g.gain.linearRampToValueAtTime(0.012 + R() * 0.012, tt + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.09);
        o.connect(g); g.connect(bus); o.start(tt); track(o, tt + 0.12);
      }
    }
    let next = startAt || 0, idx = 0, rainOn = false;
    function chord(t) {
      const [deg, type] = st.chords[idx % st.chords.length]; idx++;
      const rootPc = (st.key + deg) % 12, rootM = 36 + rootPc, dur = st.cd;
      if (st.pad) voice(rootPc, type, 52, 70).forEach((m) => pad(t, dur, m, 0.045 * st.pad));
      if (st.organ) organ(t, dur, voice(rootPc, type, 55, 76).slice(0, 4), 0.05);
      if (st.bass) bass(t, dur, rootM, 0.16);
      if (st.piano) {
        const notes = voice(rootPc, type, 60, 86), pat = [0, 2, 1, 3, 2, 4, 3, 1], step = dur / pat.length;
        pat.forEach((k, i) => { if (R() > 0.12) piano(t + i * step + (R() - 0.5) * 0.04, notes[k % notes.length], 0.07 * st.piano * (i % 4 === 0 ? 1.15 : 0.85)); });
      }
      if (st.rain) { if (!rainOn) { rain(t); rainOn = true; } drops(t, dur); }
    }
    return {
      schedule(until) { while (next < until) { chord(next); next += st.cd; } },
      stop(t) { live.forEach((o) => { try { o.stop(t); } catch (e) {} }); }
    };
  }

  // ---- lecture en direct ----
  let ctx = null;
  function getCtx() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } }
    if (ctx && ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }
  function play(id, vol) {
    const c = getCtx(); if (!c) return null;
    const master = c.createGain(), comp = c.createDynamicsCompressor();
    master.gain.value = 0.0001; master.connect(comp); comp.connect(c.destination);
    const b = build(c, id, master, 1 + Math.floor(Math.random() * 9999), c.currentTime + 0.15);
    b.schedule(c.currentTime + 14);
    const timer = setInterval(() => b.schedule(c.currentTime + 14), 1500);
    let level = vol == null ? 0.7 : vol, ducked = false, dead = false;
    const apply = (sec) => { const v = Math.max(0.0001, level * (ducked ? 0.3 : 1)); master.gain.cancelScheduledValues(c.currentTime); master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), c.currentTime); master.gain.linearRampToValueAtTime(v, c.currentTime + (sec == null ? 1 : sec)); };
    apply(4);
    return {
      setVolume(v, sec) { level = v; apply(sec); },
      duck(on) { ducked = !!on; apply(on ? 0.8 : 2.5); },
      stop(fade) {
        if (dead) return; dead = true; clearInterval(timer); const f = fade == null ? 2.5 : fade;
        master.gain.cancelScheduledValues(c.currentTime); master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), c.currentTime); master.gain.linearRampToValueAtTime(0.0001, c.currentTime + f);
        setTimeout(() => { b.stop(c.currentTime); try { master.disconnect(); comp.disconnect(); } catch (e) {} }, f * 1000 + 200);
      }
    };
  }
  // Musique de l'utilisateur (fichier audio importé), en boucle
  function playBlob(blob, vol) {
    const url = URL.createObjectURL(blob), au = new Audio(url); au.loop = true;
    let level = vol == null ? 0.7 : vol, ducked = false, dead = false, fadeT = null;
    au.volume = 0; const target = () => Math.min(1, Math.max(0, level * (ducked ? 0.3 : 1)));
    const ramp = (to, sec) => { clearInterval(fadeT); const from = au.volume, t0 = Date.now(), ms = Math.max(50, sec * 1000);
      fadeT = setInterval(() => { const k = Math.min(1, (Date.now() - t0) / ms); au.volume = Math.min(1, Math.max(0, from + (to - from) * k)); if (k >= 1) clearInterval(fadeT); }, 60); };
    au.play().then(() => ramp(target(), 3)).catch(() => {});
    return {
      setVolume(v, sec) { level = v; ramp(target(), sec == null ? 0.5 : sec); },
      duck(on) { ducked = !!on; ramp(target(), on ? 0.8 : 2.5); },
      stop(fade) { if (dead) return; dead = true; ramp(0, fade == null ? 2 : fade); setTimeout(() => { clearInterval(fadeT); try { au.pause(); } catch (e) {} URL.revokeObjectURL(url); }, (fade == null ? 2 : fade) * 1000 + 150); }
    };
  }

  // ---- ma musique (IndexedDB, reste sur l'appareil) ----
  function db() {
    return new Promise((ok, ko) => {
      if (!window.indexedDB) return ko(new Error("indexedDB"));
      const r = indexedDB.open("yeshua-music", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("tracks", { keyPath: "id", autoIncrement: true });
      r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error);
    });
  }
  const tx = (mode, fn) => db().then((d) => new Promise((ok, ko) => { const t = d.transaction("tracks", mode), q = fn(t.objectStore("tracks")); t.oncomplete = () => ok(q && q.result); t.onerror = () => ko(t.error); }));
  const lib = {
    list: () => tx("readonly", (s) => s.getAll()).then((a) => (a || []).map((x) => ({ id: x.id, name: x.name, size: x.blob.size }))),
    get: (id) => tx("readonly", (s) => s.get(id)).then((x) => x && x.blob),
    add: (file) => tx("readwrite", (s) => s.add({ name: file.name.replace(/\.[^.]+$/, ""), blob: file })),
    del: (id) => tx("readwrite", (s) => s.delete(id))
  };

  // Vérification sans haut-parleur : rend des secondes de musique hors ligne et mesure le signal
  async function measure(id, seconds) {
    const O = window.OfflineAudioContext || window.webkitOfflineAudioContext, sr = 22050;
    const c = new O(2, sr * seconds, sr), master = c.createGain(); master.gain.value = 0.7; master.connect(c.destination);
    const b = build(c, id, master, 5, 0.1); b.schedule(seconds);
    const buf = await c.startRendering(); let peak = 0, sum = 0, n = 0, d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; sum += d[i] * d[i]; n++; }
    return { peak, rms: Math.sqrt(sum / n), nan: d.some((x) => x !== x) };
  }
  window.YMUSIC = { ids: IDS, play, playBlob, lib, measure };
})();
