// ===== Voix intégrée Yeshua : synthèse à formants (aucune dépendance, fonctionne hors ligne) =====
(function (G) {
"use strict";
const FS = 22050, STEP = 55;               // 55 échantillons = 2,5 ms par image de paramètres
const MS = FS / 1000;

// ---- table des sons : formants F1,F2,F3 (Hz, voix grave de référence) ----
const VOW = {
  i:[280,2250,2900], y:[270,1950,2350], e:[400,2150,2650], "2":[400,1550,2300], "9":[560,1500,2400],
  "@":[480,1450,2450], E:[570,1900,2550], a:[780,1300,2500], A:[700,1100,2500], O:[560,950,2500],
  o:[420,800,2400], u:[310,800,2250], I:[430,1950,2500], U:[460,1050,2300], "&":[700,1700,2450],
  V:[650,1150,2450], "3":[500,1400,1700], "6":[650,1300,2500],
  "1":[560,1850,2550], "4":[700,1050,2500], "5":[480,850,2450], "7":[540,1450,2400]
};
const NASALV = { "1":1, "4":1, "5":1, "7":1 };
// consonnes : t = type
//  s=stop sourd, d=stop sonore, f=fricative sourde, v=fricative sonore, n=nasale, l=liquide, g=glissante, h=souffle
const CON = {
  p:{t:"s", loc:[300,1000,2200], fc:900,  bw:1400, bur:0.50},
  t:{t:"s", loc:[300,1700,2700], fc:4300, bw:2800, bur:0.55},
  k:{t:"s", loc:[300,1600,2300], fc:1900, bw:1600, bur:0.55},
  b:{t:"d", loc:[220,1000,2200], fc:900,  bw:1400, bur:0.30},
  d:{t:"d", loc:[220,1700,2700], fc:4000, bw:2800, bur:0.30},
  g:{t:"d", loc:[220,1600,2300], fc:1900, bw:1600, bur:0.30},
  f:{t:"f", loc:[300,1100,2300], fc:5200, bw:6000, af:0.20},
  s:{t:"f", loc:[300,1700,2700], fc:6900, bw:2600, af:0.55},
  S:{t:"f", loc:[300,1800,2500], fc:3000, bw:1900, af:0.60},
  C:{t:"f", loc:[300,2100,2800], fc:3900, bw:2300, af:0.40},
  x:{t:"f", loc:[300,1300,2300], fc:1700, bw:1600, af:0.35},
  T:{t:"f", loc:[300,1500,2500], fc:6000, bw:6000, af:0.12},
  v:{t:"v", loc:[250,1100,2300], fc:5200, bw:6000, af:0.16, av:0.55},
  z:{t:"v", loc:[250,1700,2700], fc:6900, bw:2600, af:0.35, av:0.50},
  Z:{t:"v", loc:[250,1800,2500], fc:3000, bw:1900, af:0.38, av:0.50},
  D:{t:"v", loc:[250,1500,2500], fc:6000, bw:6000, af:0.10, av:0.55},
  m:{t:"n", loc:[260,1100,2200]},
  n:{t:"n", loc:[260,1700,2600]},
  N:{t:"n", loc:[260,1500,2300]},
  J:{t:"n", loc:[260,2000,2700]},
  l:{t:"l", f:[370,1250,2750]},
  r:{t:"l", f:[420,1250,1650]},                    // r anglais (approximante)
  R:{t:"v", loc:[420,1350,2500], fc:1500, bw:1800, af:0.22, av:0.55},   // r uvulaire (fr, de)
  j:{t:"g", f:[260,2200,2900], d:55},
  w:{t:"g", f:[300,700,2300],  d:55},
  H:{t:"g", f:[270,1900,2350], d:50},
  h:{t:"h"}
};

// réglage fin des niveaux (mesuré pour que chaque consonne soit audible sans dominer les voyelles)
const GAIN = { p:0.5, t:1.65, k:1.75, b:1.06, d:1.16, g:1.15, f:2.4, s:0.6, S:7.0, z:0.83, Z:3.0, v:1.7, T:1.9, C:4.9, x:10.8 };
Object.keys(GAIN).forEach((k) => { const c = CON[k]; if (c.bur) c.bur *= GAIN[k]; if (c.af) c.af *= GAIN[k]; });
const AFFR = { c:["t","S"], G:["d","Z"], q:["t","s"], P:["p","f"] };

// ---- générateur pseudo-aléatoire ----
function rng(seed) { let x = seed >>> 0 || 1; return () => { x ^= x << 13; x >>> 0; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) / 4294967296) * 2 - 1; }; }

// ---- résonateur (Klatt) ----
function Res() { this.a = 1; this.b = 0; this.c = 0; this.z1 = 0; this.z2 = 0; }
Res.prototype.set = function (f, bw) {
  if (f > FS * 0.45) f = FS * 0.45;
  const c = -Math.exp(-2 * Math.PI * bw / FS), b = 2 * Math.exp(-Math.PI * bw / FS) * Math.cos(2 * Math.PI * f / FS);
  this.c = c; this.b = b; this.a = 1 - b - c;
};
Res.prototype.run = function (x) { const y = this.a * x + this.b * this.z1 + this.c * this.z2; this.z2 = this.z1; this.z1 = y; return y; };

// paramètres d'une image : [F1,F2,F3,B1,B2,B3,AV,AF,FC,FBW,AH,NAS]
const NP = 12;
function P(f, av, o) {
  o = o || {};
  return [f[0], f[1], f[2], o.b1 || 70, o.b2 || 100, o.b3 || 160, av, o.af || 0, o.fc || 3000, o.fbw || 2000, o.ah || 0, o.nas || 0];
}

// ---- construction des morceaux (pieces) d'un son ----
// seg = { s:symbole, d:durée(ms), st:accentué, f0:multiplicateur de hauteur }
function pieces(seg, lang, rate) {
  const s = seg.s, k = 1 / rate, out = [];
  const asp = lang === "fr" ? 10 : 26;
  if (VOW[s]) {
    const nas = NASALV[s] ? 0.75 : 0;
    out.push({ d: seg.d * k, p: P(VOW[s], 1, { nas }), tr: Math.min(45, seg.d * 0.45) * k, v: 1 });
    return out;
  }
  if (AFFR[s]) {
    const a = AFFR[s]; const A = Object.assign({}, seg);
    return pieces({ s: a[0], d: 0, st: seg.st }, lang, rate).concat(pieces({ s: a[1], d: seg.d * 0.7, st: seg.st }, lang, rate));
  }
  const c = CON[s]; if (!c) return out;
  if (c.t === "s") {
    out.push({ d: 52 * k, p: P(c.loc, 0), tr: 25 * k });
    out.push({ d: 10 * k, p: P(c.loc, 0, { af: c.bur, fc: c.fc, fbw: c.bw }), tr: 1 });
    out.push({ d: asp * k, p: P(c.loc, 0, { ah: 0.30, af: c.bur * 0.25, fc: c.fc, fbw: c.bw }), tr: 3 });
  } else if (c.t === "d") {
    out.push({ d: 46 * k, p: P([200, c.loc[1], c.loc[2]], 0.22), tr: 20 * k, v: 1 });
    out.push({ d: 9 * k, p: P(c.loc, 0.45, { af: c.bur, fc: c.fc, fbw: c.bw }), tr: 1, v: 1 });
  } else if (c.t === "f") {
    out.push({ d: (seg.d || 95) * k, p: P(c.loc, 0, { af: c.af, fc: c.fc, fbw: c.bw }), tr: 18 * k });
  } else if (c.t === "v") {
    out.push({ d: (seg.d || 85) * k, p: P(c.loc, c.av, { af: c.af, fc: c.fc, fbw: c.bw }), tr: 18 * k, v: 1 });
  } else if (c.t === "n") {
    out.push({ d: 72 * k, p: P(c.loc, 0.60, { nas: 1, b1: 90 }), tr: 24 * k, v: 1 });
  } else if (c.t === "l") {
    out.push({ d: 62 * k, p: P(c.f, 0.85), tr: 28 * k, v: 1 });
  } else if (c.t === "g") {
    out.push({ d: c.d * k, p: P(c.f, 0.9), tr: 28 * k, v: 1 });
  } else if (c.t === "h") {
    out.push({ d: 70 * k, p: P([520, 1500, 2500], 0, { ah: 0.70 }), tr: 15 * k });
  }
  return out;
}

// ---- rendu : liste de segments -> PCM ----
// voice = { f0, fs (échelle formantique), br (souffle) }
function render(segs, lang, voice, rate) {
  rate = rate || 1;
  // 1. liste de morceaux avec hauteur par morceau
  const pcs = [];
  segs.forEach((sg, si) => {
    if (sg.pause) { pcs.push({ d: sg.pause / rate, p: P([500, 1500, 2500], 0), tr: 10, sil: true, f0: sg.f0 || 1, si }); return; }
    pieces(sg, lang, rate).forEach((pc) => { pc.f0 = sg.f0 || 1; pc.si = si; pcs.push(pc); });
  });
  let total = 0; pcs.forEach((pc) => { pc.start = total; total += Math.max(1, Math.round(pc.d * MS / STEP)) * STEP; pc.end = total; });
  const out = new Float32Array(total + STEP * 8);
  const rn = rng(12345), rf = rng(777);
  const rs = [new Res(), new Res(), new Res(), new Res(), new Res()], rN = new Res(), rA = new Res(), rA2 = new Res(), rH = new Res();
  let cur = pcs.length ? pcs[0].p.slice() : new Array(NP).fill(0);
  cur[6] = 0; cur[7] = 0; cur[10] = 0;
  let prevTarget = cur.slice(), phase = 0, gprev = 0, f0cur = voice.f0, jit = 1, lp = 0;
  const fsx = voice.fs, marks = [];
  let pos = 0;
  for (let i = 0; i < pcs.length; i++) {
    const pc = pcs[i], nfr = Math.max(1, Math.round(pc.d * MS / STEP)), trFr = Math.max(1, Math.round(pc.tr * MS / STEP));
    const from = prevTarget, to = pc.p;
    marks.push({ si: pc.si, a: pos, b: pos + nfr * STEP, sil: !!pc.sil });
    for (let fr = 0; fr < nfr; fr++) {
      const w = fr >= trFr ? 1 : (fr + 1) / trFr;
      const q = new Array(NP);
      for (let k = 0; k < NP; k++) q[k] = from[k] + (to[k] - from[k]) * w;
      // formants (échelle selon la voix), F4/F5 fixes
      rs[0].set(q[0] * fsx, q[3]); rs[1].set(q[1] * fsx, q[4]); rs[2].set(q[2] * fsx, q[5]);
      rs[3].set(3350 * fsx, 220); rs[4].set(4500 * fsx, 300);
      rN.set(270, 110); rA.set(q[8], Math.max(300, q[9])); rA2.set(q[8], Math.max(300, q[9]));
      const av = q[6], af = q[7], ah = q[10], nas = q[11];
      // hauteur : cible du morceau
      const f0t = voice.f0 * pc.f0;
      for (let n = 0; n < STEP; n++) {
        f0cur += (f0t - f0cur) * 0.004;
        phase += f0cur * jit / FS;
        if (phase >= 1) { phase -= 1; jit = 1 + rf() * 0.006; }
        // impulsion glottique (Rosenberg) puis dérivée
        let g = 0; const Tp = 0.42, Tn = 0.14;
        if (phase < Tp) g = 0.5 * (1 - Math.cos(Math.PI * phase / Tp));
        else if (phase < Tp + Tn) g = Math.cos(Math.PI * (phase - Tp) / (2 * Tn));
        const dg = (g - gprev) * 22; gprev = g;
        const nz = rn();
        let x = dg * av + nz * ah * 0.9 + nz * av * voice.br * 0.4;
        let y = x;
        for (let r = 0; r < 5; r++) y = rs[r].run(y);
        if (nas > 0) y = y * (1 - 0.5 * nas) + rN.run(y) * 0.9 * nas;
        let fr2 = 0;
        if (af > 0) { fr2 = rA.run(nz) * af * 0.066; if (q[8] > 4000) fr2 = rA2.run(fr2) * 1.6; }
        let o = y * 0.09 + fr2 * 0.5;
        lp += (o - lp) * 0.9; o = lp;
        out[pos + fr * STEP + n] = o;
      }
    }
    prevTarget = to.slice();
    pos += nfr * STEP;
  }
  // normalisation + fondu
  let pk = 0; for (let i = 0; i < pos; i++) { const a = Math.abs(out[i]); if (a > pk) pk = a; }
  const g = pk > 0 ? 0.82 / pk : 1, nF = Math.round(0.008 * FS);
  for (let i = 0; i < pos; i++) out[i] *= g;
  for (let i = 0; i < nF; i++) { out[i] *= i / nF; out[pos - 1 - i] *= i / nF; }
  return { pcm: out.subarray(0, pos), marks };
}

G.YV = G.YV || {};
G.YV.FS = FS; G.YV.render = render; G.YV.VOW = VOW; G.YV.CON = CON; G.YV.AFFR = AFFR;
})(typeof window !== "undefined" ? window : globalThis);

// ===== Voix intégrée Yeshua : du texte aux sons (français, anglais, allemand) + prosodie =====
(function (G) {
"use strict";
const YV = G.YV;

// ---------------- FRANÇAIS ----------------
const FRV = "aeiouyàâäéèêëîïôöùûüœæ";
const fv = (c) => !!c && FRV.indexOf(c) >= 0;
const FRD = {
  "et":"e","est":"E","les":"le","des":"de","mes":"me","tes":"te","ses":"se","ces":"se","le":"l@","la":"la","de":"d@","je":"Z@","me":"m@","te":"t@","se":"s@",
  "ne":"n@","que":"k@","ce":"s@","un":"7","une":"yn","dieu":"dj2","tous":"tus","fils":"fis","plus":"plys","il":"il","ils":"il","elle":"El","elles":"El",
  "nous":"nu","vous":"vu","pas":"pa","avec":"avEk","sur":"syr","mais":"mE","dans":"d4","sans":"s4","son":"s5","en":"4","on":"5","ton":"t5","mon":"m5",
  "homme":"Om","hommes":"Om","femme":"fam","femmes":"fam","ciel":"sjEl","cieux":"sj2","aux":"o","au":"o","eux":"2","deux":"d2","vieux":"vj2","lieu":"lj2",
  "ainsi":"1si","moi":"mwa","toi":"twa","roi":"rwa","loi":"lwa","foi":"fwa","soi":"swa","trois":"trwa","voix":"vwa","fois":"fwa","oui":"wi","jésus":"Zezy","jesus":"Zezy",
  "christ":"krist","seigneur":"sEJ9r","sont":"s5","ont":"5","font":"f5","vont":"v5","ait":"E","eut":"y","eu":"y","a":"a","à":"a","où":"u","ou":"u","y":"i",
  "tu":"ty","ta":"ta","sa":"sa","si":"si","ni":"ni","par":"par","pour":"pur","car":"kar","qui":"ki","quoi":"kwa","comme":"kOm","comment":"kOm4","quand":"k4",
  "tout":"tu","tant":"t4","vers":"vEr","ver":"vEr","mer":"mEr","fer":"fEr","cher":"SEr","hier":"jEr","ciel":"sjEl","ville":"vil","mille":"mil","tranquille":"tr4kil",
  "isaac":"izak","israël":"israEl","israel":"israEl","david":"david","moïse":"mwaz","abraham":"abraam","jacob":"Zakob","marie":"mari","jean":"Z4","paul":"pOl","pierre":"pjEr",
  "saint":"s1","saints":"s1","sainte":"s1t","esprit":"Espri","amen":"amEn","père":"pEr","mère":"mEr","frère":"frEr","frères":"frEr","terre":"tEr","guerre":"gEr",
  "mort":"mOr","corps":"kOr","sept":"sEt","huit":"Hit","neuf":"n9f","dix":"dis","six":"sis","cent":"s4","vingt":"v1","œuvre":"9vr","oeuvre":"9vr","œuvres":"9vr","cœur":"k9r","coeur":"k9r",
  "sœur":"s9r","soeur":"s9r","peuple":"p9pl","bœuf":"b9f","œil":"9j","yeux":"jw2"
};
const FRENT = { "vent":1,"dent":1,"lent":1,"cent":1,"gent":1,"rient":0 };
function frWord(w0) {
  let w = w0;
  if (FRD[w] !== undefined) return FRD[w];
  if (w.length > 4 && /ent$/.test(w) && !/ment$/.test(w) && !FRENT[w]) w = w.slice(0, -3) + "e";   // 3e pers. du pluriel
  if (w.length > 2 && /es$/.test(w)) w = w.slice(0, -1);
  if (w.length > 2 && /[sxz]$/.test(w) && !/[aeiouyéèêàù][sxz]$/.test(w.slice(0, -1) + "x") ) w = w.slice(0, -1);
  else if (w.length > 2 && /[sxz]$/.test(w)) w = w.slice(0, -1);
  const n = w.length; let o = "", i = 0;
  const A = (k) => w[k] || "";
  const cons = (c) => !!c && !fv(c) && /[a-zç]/.test(c);
  while (i < n) {
    const c = w[i], x1 = A(i + 1), x2 = A(i + 2), x3 = A(i + 3), last = i === n - 1;
    const nasalOK = (k) => !fv(A(k)) && A(k) !== "n" && A(k) !== "m";   // voyelle nasale si pas de voyelle ni n/m ensuite
    // trigrammes / digrammes
    if (c === "e" && x1 === "a" && x2 === "u") { o += "o"; i += 3; continue; }
    if (c === "a" && x1 === "u") { o += "o"; i += 2; continue; }
    if (c === "o" && x1 === "u") { o += "u"; i += 2; continue; }
    if (c === "o" && x1 === "i" && x2 === "n" && nasalOK(i + 3)) { o += "w1"; i += 3; continue; }
    if (c === "o" && (x1 === "i" || x1 === "î")) { o += "wa"; i += 2; continue; }
    if ((c === "a" || c === "e") && x1 === "i" && (x2 === "n" || x2 === "m") && nasalOK(i + 3)) { o += "1"; i += 3; continue; }
    if ((c === "a" || c === "e") && (x1 === "i" || x1 === "î")) { o += "E"; i += 2; continue; }
    if ((c === "e" || c === "œ") && x1 === "u") {
      const fin = i + 2 >= n || (x2 === "s" && i + 3 >= n);
      const vz = (x2 === "s" && A(i + 3) === "e") || (x2 === "x");
      o += (fin || vz) ? "2" : "9"; i += 2; continue; }
    if (c === "œ") { o += "9"; i += 1; continue; }
    if (c === "æ") { o += "e"; i += 1; continue; }
    if (c === "i" && x1 === "e" && x2 === "n" && nasalOK(i + 3)) { o += "j1"; i += 3; continue; }
    if (c === "i" && x1 === "l" && x2 === "l") {
      if (i > 0 && fv(w[i - 1])) { o += "j"; i += 3; continue; }
      o += "ij"; i += 3; continue; }
    if (c === "a" && x1 === "i" && x2 === "l" && i + 3 >= n) { o += "aj"; i += 3; continue; }
    if (c === "e" && x1 === "i" && x2 === "l" && i + 3 >= n) { o += "Ej"; i += 3; continue; }
    if (c === "t" && x1 === "i" && x2 === "o" && x3 === "n") { o += "sj5"; i += 4; continue; }
    if (c === "c" && x1 === "h") { o += "S"; i += 2; continue; }
    if (c === "p" && x1 === "h") { o += "f"; i += 2; continue; }
    if (c === "g" && x1 === "n") { o += "J"; i += 2; continue; }
    if (c === "t" && x1 === "h") { o += "t"; i += 2; continue; }
    if (c === "q" && x1 === "u") { o += "k"; i += 2; continue; }
    if (c === "g" && x1 === "u" && /[eiéèêy]/.test(x2)) { o += "g"; i += 2; continue; }
    if (c === "g") { o += /[eiéèêy]/.test(x1) ? "Z" : "g"; i += 1; continue; }
    if (c === "c") { if (x1 === "c" && /[eiéèê]/.test(x2)) { o += "ks"; i += 2; continue; }
      o += /[eiéèêy]/.test(x1) ? "s" : "k"; i += (x1 === "c" || x1 === "k") ? 2 : 1; continue; }
    if (c === "ç") { o += "s"; i += 1; continue; }
    // voyelles nasales
    if ((c === "a" || c === "e") && (x1 === "n" || x1 === "m") && nasalOK(i + 2)) { o += "4"; i += 2; continue; }
    if ((c === "i" || c === "y") && (x1 === "n" || x1 === "m") && nasalOK(i + 2)) { o += "1"; i += 2; continue; }
    if (c === "o" && (x1 === "n" || x1 === "m") && nasalOK(i + 2)) { o += "5"; i += 2; continue; }
    if (c === "u" && (x1 === "n" || x1 === "m") && nasalOK(i + 2)) { o += "7"; i += 2; continue; }
    // voyelles simples
    if (c === "é") { o += "e"; i++; continue; }
    if (c === "è" || c === "ê" || c === "ë") { o += "E"; i++; continue; }
    if (c === "à" || c === "ä") { o += "a"; i++; continue; }
    if (c === "â") { o += "A"; i++; continue; }
    if (c === "î" || c === "ï") { o += "i"; i++; continue; }
    if (c === "ô" || c === "ö") { o += "o"; i++; continue; }
    if (c === "ù" || c === "û" || c === "ü") { o += "y"; i++; continue; }
    if (c === "a") { o += "a"; i++; continue; }
    if (c === "e") {
      if (last) { i++; continue; }                                  // e final muet
      if (i + 2 === n && x1 === "r" && n > 3) { o += "e"; i += 2; continue; }  // -er (parler, berger)
      if (i === n - 2 && cons(x1) && x1 !== "s") { o += "E"; i++; continue; }  // mer, sel, bec
      if (cons(x1) && cons(x2) && x1 !== x2 || (x1 === x2 && cons(x1))) { o += "E"; i++; continue; }
      if (x1 === "x") { o += "E"; i++; continue; }
      if (i + 2 === n && x1 === "r") { o += "e"; i += 2; continue; }  // -er infinitif
      o += "@"; i++; continue; }
    if (c === "i") { if (fv(x1) && x1 !== "i" && i > 0 && !(x1 === "e" && i + 2 >= n)) { o += "j"; i++; continue; } o += "i"; i++; continue; }
    if (c === "o") { if (cons(x1) && x1 !== "s" && x1 !== "z" || (i === n - 2 && x1 === "s")) { o += (i === n - 1) ? "o" : "O"; i++; continue; } o += "o"; i++; continue; }
    if (c === "u") { if (fv(x1) && x1 !== "u" && i > 0 && w[i - 1] !== "q" && w[i - 1] !== "g") { o += "H"; i++; continue; } o += "y"; i++; continue; }
    if (c === "y") { o += (fv(A(i - 1)) && fv(x1)) ? "ij" : (i === 0 && fv(x1) ? "j" : "i"); i++; continue; }
    // consonnes
    if (c === "s") {
      if (x1 === "s") { o += "s"; i += 2; continue; }
      if (last) { i++; continue; }
      o += (fv(A(i - 1)) && fv(x1)) ? "z" : "s"; i++; continue; }
    if (c === "x") { if (last) { i++; continue; } o += "ks"; i++; continue; }
    if (c === "h") { i++; continue; }
    if (c === "t") { if (last && n > 2) { i++; continue; } o += "t"; i += (x1 === "t") ? 2 : 1; continue; }
    if (c === "d" || c === "p" || c === "g") { if (last && n > 2) { i++; continue; } o += c; i += (x1 === c) ? 2 : 1; continue; }
    if (c === "z") { if (last && n > 2) { i++; continue; } o += "z"; i++; continue; }
    if (c === "r") { o += "R"; i += (x1 === "r") ? 2 : 1; continue; }
    if (c === "j") { o += "Z"; i++; continue; }
    if (c === "w") { o += "v"; i++; continue; }
    if (c === "k") { o += "k"; i++; continue; }
    if ("bfvlmn".indexOf(c) >= 0) { o += c; i += (x1 === c) ? 2 : 1; continue; }
    i++;
  }
  return o;
}

// ---------------- ALLEMAND ----------------
const DEV = "aeiouyäöü";
const dv = (c) => !!c && DEV.indexOf(c) >= 0;
const DED = {
  "und":"Unt","der":"de6","die":"di","das":"das","den":"den","dem":"dem","des":"dEs","ein":"aIn","eine":"aIn@","einen":"aIn@n","einem":"aIn@m","einer":"aIn6",
  "ist":"Ist","sie":"zi","er":"e6","wir":"vi6","ihr":"i6","es":"Es","zu":"qu","von":"fOn","mit":"mIt","nicht":"nICt","auch":"aUx","auf":"aUf","aber":"ab6",
  "wie":"vi","wenn":"vEn","was":"vas","wer":"ve6","gott":"gOt","herr":"hE6","herrn":"hErn","jesus":"jezUs","christus":"krIstUs","ich":"IC","du":"du","dich":"dIC","mich":"mIC",
  "sich":"zIC","uns":"Uns","euch":"OIC","dir":"di6","mir":"mi6","ihm":"im","ihn":"in","ihnen":"in@n","im":"Im","in":"In","an":"an","am":"am","um":"Um","so":"zo","da":"da",
  "dass":"das","daß":"das","oder":"od6","aus":"aUs","bei":"baI","nach":"nax","vor":"fo6","für":"fy6","über":"yb6","unter":"Unt6","durch":"dUrC","gegen":"ge:g@n","ohne":"on@",
  "israel":"Israel","david":"david","abraham":"abraham","mose":"moz@","maria":"maria","johannes":"johanEs","paulus":"paUlUs","petrus":"petrUs","amen":"amen","geist":"gaIst",
  "wort":"vOrt","welt":"vElt","leben":"leb@n","himmel":"hIm@l","erde":"e6d@","menschen":"mEn$@n","mensch":"mEn$","kind":"kInt","kinder":"kInd6","vater":"fat6","sohn":"zon","mutter":"mUt6",
  "eingeborenen":"aInG@bor@n@n","eingeborenen":"aIng@bor@n@n","sein":"zaIn","seine":"zaIn@","seinen":"zaIn@n","hat":"hat","haben":"hab@n","werden":"ve6d@n","wird":"vIrt","war":"va6","sind":"zInt","sei":"zaI","bin":"bIn"
};
function deWord(w0) {
  let w = w0.replace(/ß/g, "ß");
  if (DED[w] !== undefined) return DED[w].replace(/\$/g, "S").replace(/:/g, "");
  const n = w.length; let o = "", i = 0;
  const A = (k) => w[k] || "";
  const isC = (c) => !!c && !dv(c) && /[a-zß]/.test(c);
  let pre = "";
  const m = /^(be|ge|ver|zer|ent|emp)(?=[^aeiouyäöü])/.exec(w);
  if (m && n > m[0].length + 2) { o += (m[0] === "ver" ? "f6" : m[0] === "zer" ? "q6" : m[0] === "ent" ? "6nt" : m[0] === "emp" ? "6mp" : m[0][0] + "@"); i = m[0].length; }
  // voyelle longue si suivie d'une seule consonne puis voyelle, ou en fin de syllabe ouverte
  while (i < n) {
    const c = w[i], x1 = A(i + 1), x2 = A(i + 2), x3 = A(i + 3), last = i === n - 1;
    if (c === "s" && x1 === "c" && x2 === "h") { o += "S"; i += 3; continue; }
    if (c === "t" && x1 === "s" && x2 === "c" && x3 === "h") { o += "c"; i += 4; continue; }
    if (c === "c" && x1 === "h") {
      const pv = A(i - 1);
      if (i === 0 && /[eiäö]/.test(x2)) { o += "C"; i += 2; continue; }
      if (x2 === "s") { o += "ks"; i += 3; continue; }
      o += /[aouU]/.test(pv) ? "x" : "C"; i += 2; continue; }
    if (c === "c" && x1 === "k") { o += "k"; i += 2; continue; }
    if (c === "p" && x1 === "h") { o += "f"; i += 2; continue; }
    if (c === "p" && x1 === "f") { o += "P"; i += 2; continue; }
    if (c === "t" && x1 === "h") { o += "t"; i += 2; continue; }
    if (c === "t" && x1 === "z") { o += "q"; i += 2; continue; }
    if (c === "q" && x1 === "u") { o += "kv"; i += 2; continue; }
    if (c === "n" && x1 === "g") { o += "N"; i += 2; continue; }
    if (c === "n" && x1 === "k") { o += "Nk"; i += 2; continue; }
    if (c === "s" && (x1 === "p" || x1 === "t") && (i === 0 || (m && i === m[0].length))) { o += "S" + x1; i += 2; continue; }
    if (c === "ß") { o += "s"; i++; continue; }
    if (c === "s") { if (x1 === "s") { o += "s"; i += 2; continue; } o += dv(x1) ? "z" : "s"; i++; continue; }
    if (c === "z") { o += "q"; i++; continue; }
    if (c === "w") { o += "v"; i++; continue; }
    if (c === "v") { o += "f"; i++; continue; }
    if (c === "j") { o += "j"; i++; continue; }
    if (c === "x") { o += "ks"; i++; continue; }
    if (c === "h") { if (i > 0 && dv(w[i - 1])) { i++; continue; } o += "h"; i++; continue; }
    if (c === "r") {
      if (i > 0 && dv(w[i - 1]) && (last || isC(x1)) && !(isC(x1) && x1 === "r")) { o += "6"; i++; continue; }
      o += "R"; i += (x1 === "r") ? 2 : 1; continue; }
    if (c === "b" || c === "d" || c === "g") {
      if ((last || (isC(x1) && dv(A(i - 1)))) && !(c === "g" && x1 === "n")) {
        if (c === "g" && w.slice(i - 1, i + 1) === "ig" && last) { o += "C"; i++; continue; }
        o += c === "b" ? "p" : c === "d" ? "t" : "k"; i++; continue; }
      o += c; i += (x1 === c) ? 2 : 1; continue; }
    // voyelles
    if (c === "i" && x1 === "e") { o += "i"; i += 2; continue; }
    if ((c === "e" && x1 === "i") || (c === "a" && x1 === "i") || (c === "e" && x1 === "y")) { o += "aI"; i += 2; continue; }
    if ((c === "e" && x1 === "u") || (c === "ä" && x1 === "u")) { o += "OI"; i += 2; continue; }
    if (c === "a" && x1 === "u") { o += "aU"; i += 2; continue; }
    if ((c === "a" || c === "e" || c === "o" || c === "u") && x1 === c) { o += (c === "e" ? "e" : c); i += 2; continue; }
    const long = (isC(x1) && dv(x2)) || last || (x1 === "h") || (isC(x1) && x1 !== "r" && !isC(x2) && x2 === "");
    const shortV = isC(x1) && isC(x2) && x1 !== x2 || (x1 === x2 && isC(x1));
    if (c === "e") {
      if (last) { o += "@"; i++; continue; }
      if (x1 === "r" && i + 2 === n) { o += "6"; i += 2; continue; }
      if (x1 === "r" && (A(i + 2) === "n" || A(i + 2) === "s" || A(i + 2) === "t") && i + 3 === n) { o += "6" + A(i + 2); i += 3; continue; }
      if ((x1 === "n" || x1 === "l" || x1 === "m") && i + 2 === n) { o += "@" + x1; i += 2; continue; }
      if (x1 === "s" && i + 2 === n) { o += "@s"; i += 2; continue; }
      if (x1 === "t" && i + 2 === n) { o += "@t"; i += 2; continue; }
      o += shortV ? "E" : (long ? "e" : "E"); i++; continue; }
    if (c === "a") { o += "a"; i++; continue; }
    if (c === "i") { o += shortV ? "I" : (long ? "i" : "I"); i++; continue; }
    if (c === "o") { o += shortV ? "O" : (long ? "o" : "O"); i++; continue; }
    if (c === "u") { o += shortV ? "U" : (long ? "u" : "U"); i++; continue; }
    if (c === "ä") { o += shortV ? "E" : "E"; i++; continue; }
    if (c === "ö") { o += shortV ? "9" : "2"; i++; continue; }
    if (c === "ü") { o += "y"; i++; continue; }
    if (c === "y") { o += "y"; i++; continue; }
    if ("pbtdkgfmnlh".indexOf(c) >= 0) { o += c; i += (x1 === c) ? 2 : 1; continue; }
    i++;
  }
  return o;
}

// ---------------- ANGLAIS ----------------
const END = {
  "the":"D@","a":"@","an":"@n","of":"@v","to":"tu","and":"@nd","in":"In","is":"Iz","was":"wVz","he":"hi","for":"fOr","it":"It","with":"wID","as":"&z","his":"hIz",
  "they":"DeI","that":"D&t","be":"bi","at":"&t","one":"wVn","have":"h&v","this":"DIs","from":"frVm","by":"baI","not":"nAt","but":"bVt","what":"wVt","all":"Ol","were":"w3r","we":"wi",
  "when":"wEn","your":"yOr","can":"k&n","said":"sEd","there":"DEr","use":"yuz","each":"ic","which":"wIc","she":"Si","do":"du","how":"haU","their":"DEr","if":"If","will":"wIl",
  "up":"Vp","other":"VD3","about":"@baUt","out":"aUt","many":"mEni","then":"DEn","them":"DEm","these":"Diz","so":"soU","some":"sVm","her":"h3","would":"wUd","make":"meIk",
  "like":"laIk","him":"hIm","into":"Intu","time":"taIm","has":"h&z","look":"lUk","two":"tu","more":"mOr","write":"raIt","go":"goU","see":"si","no":"noU","way":"weI",
  "could":"kUd","people":"pipl","my":"maI","than":"D&n","first":"f3rst","water":"wOt3","been":"bIn","call":"kOl","who":"hu","now":"naU","find":"faInd","long":"lON","down":"daUn",
  "day":"deI","did":"dId","get":"gEt","come":"kVm","made":"meId","may":"meI","part":"pArt","over":"oUv3","new":"nyu","sound":"saUnd","take":"teIk","only":"oUnli",
  "little":"lIt@l","work":"w3rk","know":"noU","place":"pleIs","year":"yIr","live":"lIv","me":"mi","back":"b&k","give":"gIv","most":"moUst","very":"vEri","after":"&ft3",
  "thing":"TIN","our":"aU3","just":"GVst","name":"neIm","good":"gUd","sentence":"sEnt@ns","man":"m&n","think":"TINk","say":"seI","great":"greIt","where":"wEr","help":"hElp",
  "through":"Tru","much":"mVc","before":"bifOr","line":"laIn","right":"raIt","too":"tu","mean":"min","old":"oUld","any":"Eni","same":"seIm","tell":"tEl","boy":"bOI",
  "follow":"fAloU","came":"keIm","want":"wAnt","show":"SoU","also":"OlsoU","around":"@raUnd","form":"fOrm","three":"Tri","small":"smOl","set":"sEt","put":"pUt",
  "end":"End","does":"dVz","another":"@nVD3","well":"wEl","large":"lArG","must":"mVst","big":"bIg","even":"ivEn","such":"sVc","because":"bik@z","turn":"t3rn","here":"hIr",
  "why":"waI","ask":"&sk","went":"wEnt","men":"mEn","read":"rid","need":"nid","land":"l&nd","different":"dIfr@nt","home":"hoUm","us":"Vs","move":"muv","try":"traI","kind":"kaInd",
  "hand":"h&nd","picture":"pIkc3","again":"@gEn","change":"ceInG","off":"Of","play":"pleI","spell":"spEl","air":"Er","away":"@weI","animal":"&nIm@l","house":"haUs","point":"pOInt",
  "page":"peIG","letter":"lEt3","mother":"mVD3","answer":"&ns3","found":"faUnd","study":"stVdi","still":"stIl","learn":"l3rn","should":"SUd","world":"w3rld","high":"haI",
  "god":"gAd","lord":"lOrd","jesus":"Giz@s","christ":"kraIst","thou":"DaU","thee":"Di","thy":"DaI","thine":"DaIn","hath":"h&T","doth":"dVT","saith":"sET","shalt":"S&lt","wilt":"wIlt",
  "art":"Art","unto":"Vntu","ye":"yi","behold":"bihoUld","wherefore":"wEr3fOr","heaven":"hEv@n","earth":"3rT","spirit":"spIrIt","holy":"hoUli","love":"lVv","loved":"lVvd","son":"sVn","father":"fAD3",
  "word":"w3rd","life":"laIf","light":"laIt","darkness":"dArknIs","beginning":"bigInIN","created":"krieItId","gave":"geIv","whosoever":"husoUEv3","believeth":"bilivIT","believe":"biliv",
  "everlasting":"Ev3l&stIN","perish":"pErIS","only begotten":"oUnli","begotten":"bigAt@n","israel":"IzriEl","david":"deIvId","moses":"moUzIz","abraham":"eIbr@h&m","amen":"AmEn",
  "was":"wVz","are":"Ar","you":"yu","i":"aI","me":"mi","of":"@v","those":"DoUz","than":"D&n","though":"DoU","thought":"TOt","brought":"brOt","bought":"bOt","sought":"sOt","wrought":"rOt",
  "ought":"Ot","caught":"kOt","taught":"tOt","daughter":"dOt3","laugh":"l&f","enough":"inVf","rough":"rVf","cough":"kOf","eye":"aI","eyes":"aIz","earth":"3rT","heart":"hArt","hear":"hIr","heard":"h3rd",
  "ear":"Ir","ears":"Irz","does":"dVz","done":"dVn","gone":"gOn","none":"nVn","once":"wVns","both":"boUT","world":"w3rld","word":"w3rd","woman":"wUm@n","women":"wImIn","blood":"blVd","flood":"flVd",
  "door":"dOr","floor":"flOr","poor":"pUr","young":"yVN","country":"kVntri","double":"dVb@l","trouble":"trVb@l","courage":"k3IG","cousin":"kVz@n","touch":"tVc","south":"saUT","mouth":"maUT",
  "master":"m&st3","servant":"s3rv@nt","kingdom":"kINd@m","king":"kIN","glory":"glOri","power":"paU3","righteous":"raIc@s","righteousness":"raIc@snIs","sin":"sIn","sins":"sInz","pray":"preI","prayer":"prEr",
  "children":"cIldr@n","child":"caIld","woman":"wUm@n","night":"naIt","knew":"nyu","known":"noUn","know":"noU","knowledge":"nAlIG","wisdom":"wIzd@m","understanding":"Vnd3st&ndIN",
  "again":"@gEn","against":"@gEnst","give":"gIv","given":"gIv@n","given":"gIv@n","every":"Evri","everything":"EvriTIN","something":"sVmTIN","nothing":"nVTIN","love":"lVv","above":"@bVv","come":"kVm","comes":"kVmz"
};
const EV = "aeiouy";
const ev = (c) => !!c && EV.indexOf(c) >= 0;
function enBase(b, doubled) {
  if (END[b] !== undefined) return END[b];
  if (END[b + "e"] !== undefined) return END[b + "e"];
  if (!doubled && /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(b)) return enRules(b + "e", false);   // mak -> make
  return enRules(b, true);
}
function enWord(w0) {
  const w = w0.replace(/['’]/g, "");
  if (END[w] !== undefined) return END[w];
  let m, b, dbl;
  const strip = (x) => { dbl = /([^aeiouy])\1$/.test(x); return dbl ? x.slice(0, -1) : x; };
  if ((m = /^(.{2,})ing$/.exec(w))) return enBase(strip(m[1]), dbl) + "IN";
  if ((m = /^(.{2,})eth$/.exec(w))) return enBase(m[1], false) + "IT";
  if ((m = /^(.{2,})ed$/.exec(w))) { b = strip(m[1]); const base = enBase(b, dbl); return base + (/[td]$/.test(b) ? "Id" : /[pkfsc]$|ch$|sh$|x$/.test(b) ? "t" : "d"); }
  if ((m = /^(.{2,})ly$/.exec(w))) return enBase(m[1], false) + "li";
  if ((m = /^(.{2,})ness$/.exec(w))) return enBase(m[1], false) + "nIs";
  if ((m = /^(.{2,})ment$/.exec(w))) return enBase(m[1], false) + "m@nt";
  if ((m = /^(.{2,}(?:s|x|z|ch|sh))es$/.exec(w))) return enBase(m[1], false) + "Iz";
  if (!/(ss|us|is)$/.test(w) && (m = /^(.{3,})s$/.exec(w))) { const base = enBase(m[1], false); return base + (/[pktf]$/.test(base) ? "s" : "z"); }
  return enRules(w, false);
}
function enRules(w, hasSuffix) {
  const n = w.length; let o = "", i = 0;
  const A = (k) => w[k] || "";
  const isC = (c) => !!c && !ev(c) && /[a-z]/.test(c);
  const finalE = !hasSuffix && /[^aeiou]e$/.test(w) && n > 2;
  while (i < n) {
    const c = w[i], x1 = A(i + 1), x2 = A(i + 2), x3 = A(i + 3), last = i === n - 1;
    const r = w.slice(i);
    // consonnes spéciales
    if (r.startsWith("tion")) { o += "S@n"; i += 4; continue; }
    if (r.startsWith("sion")) { o += (ev(A(i - 1)) ? "Z@n" : "S@n"); i += 4; continue; }
    if (r.startsWith("cious") || r.startsWith("tious")) { o += "S@s"; i += 5; continue; }
    if (r.startsWith("ture") && i > 0) { o += "c3"; i += 4; continue; }
    if (r.startsWith("igh")) { o += "aI"; i += 3; continue; }
    if (r.startsWith("eigh")) { o += "eI"; i += 4; continue; }
    if (r.startsWith("tch")) { o += "c"; i += 3; continue; }
    if (r.startsWith("dge")) { o += "G"; i += 3; continue; }
    if (r.startsWith("ough")) { o += "O"; i += 4; continue; }
    if (c === "k" && x1 === "n" && i === 0) { o += "n"; i += 2; continue; }
    if (c === "w" && x1 === "r" && i === 0) { o += "r"; i += 2; continue; }
    if (c === "w" && x1 === "h") { o += "w"; i += 2; continue; }
    if (c === "g" && x1 === "h") { o += (i === 0 ? "g" : ""); i += 2; continue; }
    if (c === "c" && x1 === "k") { o += "k"; i += 2; continue; }
    if (c === "p" && x1 === "h") { o += "f"; i += 2; continue; }
    if (c === "t" && x1 === "h") { o += (i === 0 || /e$/.test(w.slice(0, i + 3)) && last === false ? "T" : "T"); i += 2; continue; }
    if (c === "s" && x1 === "h") { o += "S"; i += 2; continue; }
    if (c === "c" && x1 === "h") { o += "c"; i += 2; continue; }
    if (c === "n" && x1 === "g") { o += "N"; i += 2; continue; }
    if (c === "q" && x1 === "u") { o += "kw"; i += 2; continue; }
    // voyelles : digrammes
    if (c === "e" && (x1 === "e" || x1 === "a")) { o += "i"; i += 2; continue; }
    if (c === "o" && x1 === "o") { o += "u"; i += 2; continue; }
    if (c === "a" && (x1 === "i" || x1 === "y")) { o += "eI"; i += 2; continue; }
    if (c === "o" && (x1 === "a")) { o += "oU"; i += 2; continue; }
    if (c === "o" && x1 === "w") { o += (last || i + 2 === n && A(i + 2) === "s") ? "oU" : "aU"; i += 2; continue; }
    if (c === "o" && x1 === "u") { o += "aU"; i += 2; continue; }
    if (c === "o" && (x1 === "i" || x1 === "y")) { o += "OI"; i += 2; continue; }
    if (c === "a" && (x1 === "u" || x1 === "w")) { o += "O"; i += 2; continue; }
    if (c === "i" && x1 === "e") { o += (last || i + 2 === n) ? "i" : "i"; i += 2; continue; }
    if (c === "e" && x1 === "i") { o += "eI"; i += 2; continue; }
    if (c === "e" && (x1 === "w" || x1 === "u")) { o += "yu"; i += 2; continue; }
    if (c === "u" && x1 === "e" && last) { o += "u"; i += 2; continue; }
    if ((c === "e" || c === "i" || c === "u") && x1 === "r" && !ev(x2)) { o += "3r"; i += 2; continue; }
    if (c === "o" && x1 === "r" && !ev(x2)) { o += "Or"; i += 2; continue; }
    if (c === "a" && x1 === "r" && !ev(x2)) { o += "Ar"; i += 2; continue; }
    // e muet final et voyelle longue (VCe)
    if (ev(c) && c !== "y") {
      if (c === "e" && last && finalE) { i++; continue; }
      const magic = isC(x1) && x2 === "e" && i + 3 === n && !hasSuffix;
      const magicS = isC(x1) && x2 === "" && hasSuffix && false;
      if (magic) { o += c === "a" ? "eI" : c === "i" ? "aI" : c === "o" ? "oU" : c === "u" ? "yu" : "i"; i++; continue; }
      if (last && !hasSuffix && c === "o") { o += "oU"; i++; continue; }
      if (last && !hasSuffix && c === "a" && n > 1) { o += "@"; i++; continue; }
      if (last && !hasSuffix && c === "i" && n > 1) { o += "aI"; i++; continue; }
      if (last && !hasSuffix && c === "e") { o += "i"; i++; continue; }
      const open = isC(x1) && ev(x2) && !(x1 === x2);
      if (c === "a") { o += open ? "eI" : "&"; i++; continue; }
      if (c === "e") { o += open && i === 0 ? "i" : "E"; i++; continue; }
      if (c === "i") { o += open ? "aI" : "I"; i++; continue; }
      if (c === "o") { o += open ? "oU" : "A"; i++; continue; }
      if (c === "u") { o += open ? "yu" : "V"; i++; continue; }
    }
    if (c === "y") { o += i === 0 ? "j" : (last ? (n <= 3 ? "aI" : "i") : "I"); i++; continue; }
    // consonnes
    if (c === "c") { o += /[eiy]/.test(x1) ? "s" : "k"; i += (x1 === "c" && !/[eiy]/.test(x2)) ? 2 : 1; continue; }
    if (c === "g") { o += /[eiy]/.test(x1) && !/^(get|gi[fv]|gir|gee|gil)/.test(r) ? "G" : "g"; i += (x1 === "g") ? 2 : 1; continue; }
    if (c === "s") { o += (ev(A(i - 1)) && ev(x1)) ? "z" : "s"; i += (x1 === "s") ? 2 : 1; continue; }
    if (c === "x") { o += "ks"; i++; continue; }
    if (c === "j") { o += "G"; i++; continue; }
    if (c === "q") { o += "k"; i++; continue; }
    if (c === "r") { o += "r"; i += (x1 === "r") ? 2 : 1; continue; }
    if ("bdfhklmnptvwz".indexOf(c) >= 0) { o += c; i += (x1 === c) ? 2 : 1; continue; }
    i++;
  }
  return o;
}

// ---------------- Découpage en segments + prosodie ----------------
const FUNC = {
  fr: "le la les un une des de du à au aux et ou ni que qui en dans sur sous par pour avec sans ce se ne me te il ils elle elles je tu nous vous on y l d j m t s n c qu mon ton son ma ta sa mes tes ses leur leurs".split(" "),
  en: "the a an of to in and or but for with by on at as is was are were be been he she it they we you i his her its their my thy thine me him them us that this".split(" "),
  de: "der die das den dem des ein eine einem einen einer und oder aber in an auf zu von mit bei aus für ist er sie es wir ihr ich du".split(" ")
};
const FSET = {}; Object.keys(FUNC).forEach((l) => { FSET[l] = {}; FUNC[l].forEach((w) => (FSET[l][w] = 1)); });
const VS = "aeiouy@EAOI2U9&V36ö1457";   // sons vocaliques (symboles)
const isVs = (c) => !!YV.VOW[c];
const ELIS = { l:"l", d:"d", j:"Z", m:"m", t:"t", s:"s", n:"n", c:"s", qu:"k" };

function tokenize(text, lang) {
  const t = text.replace(/[«»“”"]/g, " ").replace(/\s+/g, " ").replace(/[—–]/g, " — ").trim();
  const re = /[\p{L}]+(?:['’][\p{L}]+)*|[,;:.!?…—]/gu, out = []; let m;
  while ((m = re.exec(t))) out.push(m[0]);
  return out;
}
function wordPhones(tok, lang) {
  const w = tok.toLowerCase().normalize("NFC");
  if (lang === "fr") {
    const parts = w.split(/['’]/);
    if (parts.length > 1) return parts.map((p, i) => (i < parts.length - 1 && ELIS[p] ? ELIS[p] : frWord(p))).join("");
    return frWord(w);
  }
  if (lang === "de") return deWord(w.replace(/['’]/g, ""));
  return enWord(w);
}

// durée de base (ms) d'une voyelle selon langue / contexte
function vdur(sym, st, lang, long) {
  let d = 88;
  if (NASAL(sym)) d = 105;
  if (long) d *= 1.15;
  if (st) d *= 1.28; else d *= 0.82;
  return d;
}
const NASAL = (s) => s === "1" || s === "4" || s === "5" || s === "7";

function build(text, lang, rate) {
  const toks = tokenize(text, lang), segs = [];
  let phrase = [];
  const flush = (punct) => {
    if (!phrase.length) { if (punct) segs.push({ pause: pauseOf(punct) }); return; }
    // hauteur : déclinaison sur la phrase, accent sur les syllabes accentuées, fin montante ou descendante
    const vIdx = []; phrase.forEach((sg, k) => { if (isVs(sg.s)) vIdx.push(k); });
    const nv = Math.max(1, vIdx.length);
    phrase.forEach((sg, k) => {
      const t = Math.max(0, vIdx.findIndex((x) => x >= k)); const frac = (t < 0 ? nv - 1 : t) / Math.max(1, nv - 1);
      sg.f0 = (1.10 - 0.22 * frac) * (sg.st ? 1.07 : 1);
    });
    const lastV = vIdx[vIdx.length - 1];
    if (lastV !== undefined) {
      const sg = phrase[lastV]; sg.d *= (punct === "." || punct === "?" || punct === "!") ? 1.45 : 1.25;
      if (punct === "?") { sg.f0 = 1.38; if (vIdx.length > 1) phrase[vIdx[vIdx.length - 2]].f0 *= 1.10; }
      else if (punct === ".") { sg.f0 = 0.78; }
      else if (punct === "!") { sg.f0 = 0.85; }
      else if (punct) { sg.f0 = 1.12; }
    }
    phrase.forEach((x) => segs.push(x));
    if (punct) segs.push({ pause: pauseOf(punct) });
    phrase = [];
  };
  const pauseOf = (p) => (p === "," ? 230 : p === ";" || p === ":" || p === "—" ? 320 : 480);
  toks.forEach((tok, ti) => {
    if (/^[,;:.!?…—]$/.test(tok)) { flush(tok === "…" ? "." : tok); return; }
    const w = tok.toLowerCase();
    const ph = wordPhones(tok, lang);
    if (!ph) return;
    const func = FSET[lang][w.replace(/['’].*/, "")] === 1 && ph.length <= 4;
    const vpos = []; for (let k = 0; k < ph.length; k++) if (isVs(ph[k])) vpos.push(k);
    // diphtongues anglaises / allemandes : traiter la seconde partie comme voyelle courte
    let stressAt = -1;
    if (!func && vpos.length) {
      if (lang === "fr") stressAt = vpos[vpos.length - 1];
      else {
        stressAt = vpos[0];
        if (vpos.length > 2 && /^(be|ge|ver|zer|ent|de|re|a|un|for|con|pro)/.test(w) && lang !== "fr") stressAt = vpos[1] === undefined ? vpos[0] : vpos[1];
      }
    }
    for (let k = 0; k < ph.length; k++) {
      const s = ph[k];
      if (isVs(s)) {
        const second = k > 0 && isVs(ph[k - 1]) && (s === "I" || s === "U") && lang !== "fr";
        const st = k === stressAt;
        let d = vdur(s, st, lang, lang === "de" && (s === "e" || s === "o" || s === "u" || s === "i" || s === "a") && !isVs(ph[k + 1] || "") && ph[k + 1] && !"bcdfghjklmnpqrstvwxzSCxNZ".includes(ph[k + 2] || "~"));
        if (second) d = 70;
        if (func) d *= 0.85;
        phrase.push({ s, d, st, f0: 1 });
      } else if (YV.CON[s] || YV.AFFR[s]) {
        phrase.push({ s, d: 0, st: false, f0: 1 });
      }
    }
    if (ti < toks.length - 1 && !/^[,;:.!?…—]$/.test(toks[ti + 1]) && !/['’]$/.test(tok)) phrase.push({ pause: 22 });
  });
  flush("");
  return segs;
}

const VOICES = { f: { f0: 208, fs: 1.17, br: 0.16 }, m: { f0: 118, fs: 1.0, br: 0.12 } };
// API : renvoie { pcm: Float32Array, fs }
YV.synth = function (text, lang, gender, rate) {
  const segs = build(text, lang || "fr", rate || 1);
  if (!segs.length) return { pcm: new Float32Array(0), fs: YV.FS };
  const r = YV.render(segs, lang || "fr", VOICES[gender] || VOICES.f, rate || 1);
  return { pcm: r.pcm, fs: YV.FS };
};
YV.phones = (text, lang) => tokenize(text, lang).filter((t) => !/^[,;:.!?…—]$/.test(t)).map((t) => t + " → " + wordPhones(t, lang)).join("  |  ");
})(typeof window !== "undefined" ? window : globalThis);
