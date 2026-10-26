// Yeshua — onglet « Méditer » : plans de méditation, Bible entière, séance guidée avec musique.
(function () {
  "use strict";
  const Y = window.YAPI, M = window.YESHUA_MEDITATION, MU = window.YMUSIC;
  if (!Y || !M) return;
  const { el, S, save, toast } = Y;
  const LI = { fr: 0, en: 1, de: 2 };
  const L = {
    fr: { title: "Méditer", intro: "Méditez la Parole : respiration, lecture à voix haute avec musique douce, silence, puis prière.",
      music: "Musique de méditation", style: "Ambiance", volume: "Volume de la musique", voiceRead: "Lecture à voix haute", silence: "Temps de silence",
      sec: "s", min: "min", listenAmb: "Écouter l'ambiance", stop: "Arrêter", skip: "Passer ›", myMusic: "Ma musique", addMusic: "＋ Ajouter une musique",
      musicNote: "Les ambiances ci-dessus sont composées par l'application (libres de droits). Pour vos instrumentaux gospel préférés, ajoutez vos propres fichiers audio : ils restent sur votre appareil et marchent sans Internet.",
      remove: "Retirer", plans: "Plans de méditation", day: "Jour", of: "sur", start: "Commencer", again: "Reprendre", reset: "Recommencer le plan", planDone: "Plan terminé. Que Dieu vous bénisse !",
      bible: "Méditer la Bible en entier", bibleD: "Un chapitre à la fois, de la Genèse à l'Apocalypse. Chaque séance : respiration, lecture, silence, prière.", next: "Prochain chapitre",
      go: "Méditer ce chapitre", sounds: "Sons de méditation seuls", soundsD: "Musique douce et respiration guidée, sans lecture.", inhale: "Inspirez", exhale: "Expirez",
      listen: "Écoutez", silenceL: "Silence", prayerL: "Prière", done: "Séance terminée ✔", closeB: "Fermer", nextDay: "Jour suivant", nextCh: "Chapitre suivant",
      noVoice: "Aucune voix disponible : le texte s'affiche à rythme lent.", loadFail: "Texte indisponible. Vérifiez la version ou la connexion.", pick: "Chapitre", added: "Musique ajoutée.", dbFail: "Impossible d'enregistrer la musique sur cet appareil." },
    en: { title: "Meditate", intro: "Meditate on the Word: breathing, reading aloud with soft music, silence, then prayer.",
      music: "Meditation music", style: "Atmosphere", volume: "Music volume", voiceRead: "Read aloud", silence: "Silence time",
      sec: "s", min: "min", listenAmb: "Listen to the atmosphere", stop: "Stop", skip: "Skip ›", myMusic: "My music", addMusic: "＋ Add music",
      musicNote: "The atmospheres above are composed by the app itself (royalty-free). For your favourite gospel instrumentals, add your own audio files: they stay on your device and work offline.",
      remove: "Remove", plans: "Meditation plans", day: "Day", of: "of", start: "Start", again: "Resume", reset: "Restart plan", planDone: "Plan complete. God bless you!",
      bible: "Meditate through the whole Bible", bibleD: "One chapter at a time, from Genesis to Revelation. Each session: breathing, reading, silence, prayer.", next: "Next chapter",
      go: "Meditate this chapter", sounds: "Meditation sounds only", soundsD: "Soft music and guided breathing, no reading.", inhale: "Breathe in", exhale: "Breathe out",
      listen: "Listen", silenceL: "Silence", prayerL: "Prayer", done: "Session complete ✔", closeB: "Close", nextDay: "Next day", nextCh: "Next chapter",
      noVoice: "No voice available: the text is shown at a slow pace.", loadFail: "Text unavailable. Check the version or the connection.", pick: "Chapter", added: "Music added.", dbFail: "Could not store the music on this device." },
    de: { title: "Meditieren", intro: "Meditieren Sie das Wort: Atmen, lautes Lesen mit sanfter Musik, Stille, dann Gebet.",
      music: "Meditationsmusik", style: "Stimmung", volume: "Lautstärke der Musik", voiceRead: "Laut vorlesen", silence: "Zeit der Stille",
      sec: "s", min: "Min.", listenAmb: "Stimmung anhören", stop: "Stopp", skip: "Weiter ›", myMusic: "Meine Musik", addMusic: "＋ Musik hinzufügen",
      musicNote: "Die obigen Stimmungen werden von der App selbst komponiert (lizenzfrei). Für Ihre Lieblings-Gospel-Instrumentals fügen Sie eigene Audiodateien hinzu: Sie bleiben auf Ihrem Gerät und funktionieren offline.",
      remove: "Entfernen", plans: "Meditationspläne", day: "Tag", of: "von", start: "Beginnen", again: "Fortsetzen", reset: "Plan neu starten", planDone: "Plan abgeschlossen. Gott segne Sie!",
      bible: "Die ganze Bibel meditieren", bibleD: "Kapitel für Kapitel, von 1. Mose bis Offenbarung. Jede Einheit: Atmen, Lesen, Stille, Gebet.", next: "Nächstes Kapitel",
      go: "Dieses Kapitel meditieren", sounds: "Nur Meditationsklänge", soundsD: "Sanfte Musik und geführtes Atmen, ohne Lesung.", inhale: "Einatmen", exhale: "Ausatmen",
      listen: "Hören", silenceL: "Stille", prayerL: "Gebet", done: "Einheit beendet ✔", closeB: "Schließen", nextDay: "Nächster Tag", nextCh: "Nächstes Kapitel",
      noVoice: "Keine Stimme verfügbar: Der Text erscheint langsam.", loadFail: "Text nicht verfügbar. Prüfen Sie Version oder Verbindung.", pick: "Kapitel", added: "Musik hinzugefügt.", dbFail: "Die Musik konnte nicht gespeichert werden." }
  };
  const T = (k) => (L[S.ui] && L[S.ui][k]) || L.fr[k] || k;
  const STYLE_NAMES = { gospel: ["Louange douce (gospel)", "Gentle worship (gospel)", "Sanfter Lobpreis (Gospel)"], organ: ["Orgue de prière", "Prayer organ", "Gebetsorgel"],
    piano: ["Piano doux", "Soft piano", "Sanftes Klavier"], rain: ["Pluie apaisante", "Soothing rain", "Beruhigender Regen"] };
  const mm = () => { const m = S.med = S.med || {}, d = { plans: {}, pos: { b: 1, c: 1 }, style: "gospel", vol: 0.6, voice: true, silence: 60, minutes: 10 };
    for (const k in d) if (m[k] === undefined) m[k] = d[k]; return m; };
  const tl = (a) => a[LI[S.ui]];
  let preview = null, tracks = [], run = null;

  // ---------- écran ----------
  async function render() {
    const box = document.getElementById("medBox"); if (!box) return;
    const m = mm(); try { tracks = MU ? await MU.lib.list() : []; } catch (e) { tracks = []; }
    box.replaceChildren(el("h2", { class: "sec", text: T("title") }), el("p", { class: "hint", text: T("intro") }));
    // musique
    const styleSel = el("select", {}, (MU ? MU.ids : []).map((id) => el("option", { value: id, text: tl(STYLE_NAMES[id]) })), tracks.map((x) => el("option", { value: "u:" + x.id, text: "♪ " + x.name })));
    styleSel.value = m.style; if (styleSel.value !== m.style) { m.style = "gospel"; styleSel.value = "gospel"; }
    styleSel.onchange = () => { m.style = styleSel.value; save(); stopPreview(); };
    const vol = el("input", { type: "range", min: 10, max: 100, value: Math.round(m.vol * 100) });
    vol.oninput = () => { m.vol = vol.value / 100; save(); if (preview) preview.setVolume(m.vol, 0.2); };
    const vc = el("input", { type: "checkbox" }); vc.checked = m.voice; vc.onchange = () => { m.voice = vc.checked; save(); };
    const sil = el("select", {}, [30, 60, 120, 180].map((s) => el("option", { value: s, text: s < 60 ? s + " " + T("sec") : s / 60 + " " + T("min") })));
    sil.value = String(m.silence); sil.onchange = () => { m.silence = +sil.value; save(); };
    const pbtn = el("button", { class: "btn", text: "▶ " + T("listenAmb"), onclick: () => togglePreview(pbtn) });
    const file = el("input", { type: "file", accept: "audio/*", multiple: "", style: "display:none" });
    file.onchange = async () => {
      try { for (const f of file.files) await MU.lib.add(f); toast(T("added"), 2000); } catch (e) { toast(T("dbFail"), 4000); }
      render();
    };
    box.append(el("div", { class: "card" }, el("h3", { text: "🎵 " + T("music") }),
      el("label", { class: "f" }, T("style"), styleSel), el("label", { class: "f" }, T("volume"), vol),
      el("label", { class: "f" }, T("voiceRead"), vc), el("label", { class: "f" }, T("silence"), sil),
      el("div", { class: "row" }, pbtn, el("button", { class: "btn", text: T("addMusic"), onclick: () => file.click() }), file),
      tracks.length ? el("div", {}, el("p", { class: "meta", text: T("myMusic") }), tracks.map((x) => el("p", { class: "meta" }, "♪ " + x.name + " ",
        el("a", { href: "#", text: T("remove"), onclick: async (e) => { e.preventDefault(); try { await MU.lib.del(x.id); } catch (er) {} if (m.style === "u:" + x.id) m.style = "gospel"; save(); render(); } })))) : null,
      el("p", { class: "meta", text: T("musicNote") })));
    // plans
    box.append(el("h2", { class: "sec", text: T("plans") }));
    M.plans.forEach((p) => {
      const st = m.plans[p.id] = m.plans[p.id] || { done: {} }, n = p.days.length, cnt = Object.keys(st.done).length;
      let d = 1; while (d <= n && st.done[d]) d++;
      const bar = el("div", { class: "bar" }, el("i")); bar.firstChild.style.width = (cnt * 100 / n) + "%";
      const card = el("div", { class: "card" }, el("h3", { text: tl(p.name) }), el("p", { class: "meta", text: tl(p.desc) + " · " + cnt + "/" + n }), bar);
      if (d > n) card.append(el("p", { text: T("planDone") }));
      else {
        const day = p.days[d - 1], r = day.ref;
        card.append(el("p", {}, el("b", { text: T("day") + " " + d + " " + T("of") + " " + n + " — " }), tl(day.th)),
          el("p", { class: "meta", text: Y.bookName(r[0], S.ui) + " " + r[1] + ":" + r[2] + (r[3] > r[2] ? "–" + r[3] : "") }),
          el("div", { class: "row" }, el("button", { class: "btn primary", text: "▶ " + (cnt ? T("again") : T("start")), onclick: () => startPlanDay(p, d) })));
      }
      if (cnt) card.append(el("div", { class: "row" }, el("button", { class: "btn", text: T("reset"), onclick: () => { st.done = {}; save(); render(); } })));
      box.append(card);
    });
    // Bible entière
    const bSel = el("select", {}, Y.B.map((b, i) => el("option", { value: i + 1, text: b[Y.LI[S.ui]] }))), cSel = el("select", {});
    const fillC = () => { const n = Y.B[+bSel.value - 1][0]; cSel.replaceChildren(...Array.from({ length: n }, (_, i) => el("option", { value: i + 1, text: i + 1 }))); };
    bSel.value = m.pos.b; fillC(); cSel.value = m.pos.c;
    bSel.onchange = () => { fillC(); m.pos = { b: +bSel.value, c: 1 }; save(); };
    cSel.onchange = () => { m.pos = { b: +bSel.value, c: +cSel.value }; save(); };
    box.append(el("h2", { class: "sec", text: T("bible") }), el("div", { class: "card" }, el("p", { class: "meta", text: T("bibleD") }),
      el("div", { class: "row" }, bSel, cSel), el("div", { class: "row" }, el("button", { class: "btn primary", text: "▶ " + T("go"), onclick: () => startChapter(m.pos.b, m.pos.c) }))));
    // sons seuls
    const minSel = el("select", {}, [5, 10, 20, 30].map((x) => el("option", { value: x, text: x + " " + T("min") }))); minSel.value = String(m.minutes); minSel.onchange = () => { m.minutes = +minSel.value; save(); };
    box.append(el("h2", { class: "sec", text: T("sounds") }), el("div", { class: "card" }, el("p", { class: "meta", text: T("soundsD") }),
      el("div", { class: "row" }, minSel, el("button", { class: "btn primary", text: "▶ " + T("start"), onclick: () => startSounds(+minSel.value) }))));
  }
  async function startMusic() {
    const m = mm(); if (!MU) return null;
    if (m.style.startsWith("u:")) { try { const b = await MU.lib.get(+m.style.slice(2)); if (b) return MU.playBlob(b, m.vol); } catch (e) {} }
    return MU.play(MU.ids.indexOf(m.style) >= 0 ? m.style : "gospel", m.vol);
  }
  async function togglePreview(btn) {
    if (preview) return stopPreview();
    Y.prime(); btn.textContent = "■ " + T("stop"); const p = await startMusic(); preview = p; if (!p) btn.textContent = "▶ " + T("listenAmb");
  }
  function stopPreview() { if (preview) { preview.stop(1.5); preview = null; } document.querySelectorAll("#medBox .row .btn").forEach((b) => { if (b.textContent.indexOf("■") === 0) b.textContent = "▶ " + T("listenAmb"); }); }

  // ---------- séance ----------
  function wakeLock(on) {
    try { if (on && navigator.wakeLock) navigator.wakeLock.request("screen").then((w) => { if (run) run.wl = w; }).catch(() => {}); else if (run && run.wl) run.wl.release().catch(() => {}); } catch (e) {}
  }
  function overlay() {
    const o = el("div", { class: "medrun" }), title = el("h2"), sub = el("p", { class: "msub" }), circle = el("div", { class: "mcircle" }, el("span")),
      phase = el("p", { class: "mphase" }), body = el("div", { class: "mbody" }), ctl = el("div", { class: "mctl" });
    o.append(title, sub, circle, phase, body, ctl); document.body.append(o);
    return { o, title, sub, circle, phase, body, ctl };
  }
  // attente interrompue par « Passer » ou « Arrêter »
  const wait = (ms) => new Promise((ok) => { const r = run; const id = setTimeout(() => { r.skipFn = null; ok(); }, ms); r.skipFn = () => { clearTimeout(id); r.skipFn = null; ok(); }; r.waiters.push(() => { clearTimeout(id); ok(); }); });
  const speakP = (text, lang) => new Promise((ok) => {
    const r = run; if (!r || r.stopped) return ok();
    r.waiters.push(ok); r.skipFn = () => { Y.stopAudio(); r.skipFn = null; ok(); };
    Y.speak(text, lang, () => { r.skipFn = null; ok(); }, () => { r.skipFn = null; r.noVoice = true; ok(); });
  });
  const alive = (r) => run === r && !r.stopped;
  async function session(cfg) {
    if (run) return;
    const m = mm(); Y.prime(); Y.stopAudio(); stopPreview();
    const ui = overlay(), r = run = { stopped: false, waiters: [], skipFn: null, ui, wl: null, music: null, noVoice: false };
    ui.title.textContent = cfg.title; ui.sub.textContent = cfg.sub || "";
    const stopBtn = el("button", { class: "mb", text: "■ " + T("stop"), onclick: finish }), skipBtn = el("button", { class: "mb", text: T("skip"), onclick: () => r.skipFn && r.skipFn() });
    ui.ctl.append(skipBtn, stopBtn);
    wakeLock(true);
    r.music = await startMusic();
    const useVoice = m.voice && cfg.verses && Y.canSpeak();
    const sayUI = async (txt) => { if (m.voice && Y.canSpeak() && !r.noVoice) await speakP(txt, S.ui); else await wait(Math.max(4000, txt.split(/\s+/).length * 420)); };
    let breathT = null;
    const breath = (on) => { clearInterval(breathT); ui.circle.classList.toggle("go", on); if (!on) { ui.phase.textContent = ""; return; }
      let inh = true; const tick = () => { ui.phase.textContent = inh ? T("inhale") : T("exhale"); inh = !inh; }; tick(); breathT = setInterval(tick, 4000); };
    try {
      // 1. respiration
      breath(true); if (cfg.verses) { ui.body.textContent = tl(M.breathe); await sayUI(tl(M.breathe)); if (!alive(r)) return; }
      await wait(cfg.verses ? 14000 : cfg.minutes * 60000);
      if (!alive(r)) return; breath(false);
      if (cfg.verses) {
        // 2. lecture (deux fois si le passage est court)
        if (!cfg.verses.length) { ui.body.textContent = T("loadFail"); await wait(4000); return finish(); }
        ui.circle.classList.add("calm"); ui.phase.textContent = T("listen"); if (r.music) r.music.duck(true);
        const box = el("div", { class: "mverses" }); ui.body.replaceChildren(box);
        cfg.verses.forEach(([n, tx]) => box.append(el("p", { "data-n": n }, el("sup", { text: n + " " }), tx)));
        if (m.voice && !Y.canSpeak()) toast(T("noVoice"), 4000);
        const reps = cfg.verses.length <= 10 ? 2 : 1;
        for (let k = 0; k < reps && alive(r); k++) {
          for (const [n, tx] of cfg.verses) {
            if (!alive(r)) return;
            box.querySelectorAll(".on").forEach((x) => x.classList.remove("on"));
            const p = box.querySelector('[data-n="' + n + '"]'); if (p) { p.classList.add("on"); p.scrollIntoView({ block: "center", behavior: "smooth" }); }
            if (useVoice && !r.noVoice) await speakP(tx, cfg.lang); else await wait(Math.max(3500, tx.split(/\s+/).length * 450));
            if (!alive(r)) return; await wait(700);
          }
          box.querySelectorAll(".on").forEach((x) => x.classList.remove("on"));
          if (k + 1 < reps) { ui.phase.textContent = T("silenceL"); if (r.music) r.music.duck(false); await wait(12000); if (!alive(r)) return; ui.phase.textContent = T("listen"); if (r.music) r.music.duck(true); }
        }
        // 3. silence et réflexion
        if (r.music) r.music.duck(false); ui.phase.textContent = T("silenceL");
        ui.body.replaceChildren(el("p", { class: "mq", text: cfg.question }));
        const clock = el("p", { class: "mclock" }); ui.body.append(clock);
        let left = m.silence; const ct = setInterval(() => { left--; clock.textContent = Math.floor(Math.max(0, left) / 60) + ":" + String(Math.max(0, left) % 60).padStart(2, "0"); }, 1000);
        clock.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0");
        r.waiters.push(() => clearInterval(ct));
        if (m.voice && Y.canSpeak() && !r.noVoice) { if (r.music) r.music.duck(true); await speakP(cfg.question, S.ui); if (r.music) r.music.duck(false); }
        await wait(Math.max(5000, left * 1000)); clearInterval(ct); if (!alive(r)) return;
        // 4. prière
        ui.phase.textContent = T("prayerL"); ui.body.replaceChildren(el("p", { class: "mq", text: tl(M.prayer) }));
        if (r.music) r.music.duck(true); await sayUI(tl(M.prayer)); if (!alive(r)) return;
      }
      if (r.music) r.music.duck(false);
      await wait(2500);
      if (!alive(r)) return;
      // fin
      ui.circle.classList.remove("go", "calm"); ui.phase.textContent = ""; ui.body.replaceChildren(el("p", { class: "mq", text: T("done") }));
      ui.ctl.replaceChildren(...(cfg.onDone ? [el("button", { class: "mb primary", text: cfg.nextLabel, onclick: () => { finish(); cfg.onDone(true); } })] : []), el("button", { class: "mb", text: T("closeB"), onclick: finish }));
      if (cfg.onDone) cfg.onDone(false);
      if (r.music) { r.music.stop(6); r.music = null; }
    } finally { clearInterval(breathT); }
  }
  function finish() {
    const r = run; if (!r) return; r.stopped = true; run = null;
    r.waiters.forEach((f) => { try { f(); } catch (e) {} }); Y.stopAudio();
    if (r.music) r.music.stop(2.5); wakeLock(false); if (r.wl) { try { r.wl.release(); } catch (e) {} }
    r.ui.o.remove(); render();
  }
  async function versesFor(b, c, v1, v2) {
    const bible = await Y.loadBible(S.ver, b), vs = Y.verses(bible, b, c);
    if (!vs) return [];
    const out = []; for (let i = (v1 || 1) - 1; i < (v2 || vs.length); i++) if (vs[i]) out.push([i + 1, vs[i]]);
    return out;
  }
  const lang = () => Y.verInfo(S.ver).lang;
  async function startPlanDay(p, d) {
    const day = p.days[d - 1], r = day.ref, vs = await versesFor(r[0], r[1], r[2], r[3]), m = mm(), qs = M.questions;
    session({ title: tl(day.th), sub: tl(p.name) + " · " + T("day") + " " + d + " — " + Y.bookName(r[0], S.ui) + " " + r[1] + ":" + r[2] + (r[3] > r[2] ? "–" + r[3] : ""),
      verses: vs, lang: lang(), question: tl(qs[(d - 1) % qs.length]), nextLabel: T("nextDay"),
      onDone: (go) => { if (!go) { m.plans[p.id].done[d] = 1; save(); } else { setTimeout(() => { let n = 1; while (n <= p.days.length && m.plans[p.id].done[n]) n++; if (n <= p.days.length) startPlanDay(p, n); }, 300); } } });
  }
  async function startChapter(b, c) {
    const vs = await versesFor(b, c), m = mm(), qs = M.questions;
    session({ title: Y.bookName(b, S.ui) + " " + c, sub: T("bible"), verses: vs, lang: lang(), question: tl(qs[(b + c) % qs.length]), nextLabel: T("nextCh"),
      onDone: (go) => {
        if (!go) { let nb = b, nc = c + 1; if (nc > Y.B[b - 1][0]) { nb = b === 66 ? 1 : b + 1; nc = 1; } m.pos = { b: nb, c: nc }; save(); }
        else setTimeout(() => startChapter(m.pos.b, m.pos.c), 300);
      } });
  }
  function startSounds(minutes) { session({ title: T("sounds"), sub: minutes + " " + T("min"), minutes, nextLabel: "", onDone: null }); }

  window.YMED = { render, leave() { stopPreview(); }, _state: () => run };
})();
