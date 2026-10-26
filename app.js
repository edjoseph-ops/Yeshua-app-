(function () {
"use strict";
const B = window.YESHUA_BOOKS, V = window.YESHUA_VERSIONS, T = window.YESHUA_TEACHINGS, C = window.YESHUA_CONFIG;
const $ = (s) => document.querySelector(s);
const LI = { fr: 1, en: 2, de: 3 };
const LANGS = { fr: "Français", en: "English", de: "Deutsch" };
const TTS = { fr: "fr-FR", en: "en-US", de: "de-DE" };
const DEFAULT_VER = { fr: "LSG", en: "KJV", de: "LUT" };

const I18N = {
  fr: { read:"Lire", search:"Chercher", teach:"Enseignements", saved:"Mes versets", settings:"Réglages",
    searchPh:"Mot ou expression…", noResults:"Aucun résultat.", results:"résultat(s)", cmpNone:"Comparer : aucune",
    cmpWith:"Comparer :", ot:"Ancien Testament", nt:"Nouveau Testament", chapter:"Chapitre", book:"Livre",
    fav:"Favori", unfav:"Retirer des favoris", note:"Note", copy:"Copier", share:"Partager", color:"Surligner",
    save:"Enregistrer", close:"Fermer", listenFrom:"Écouter à partir d'ici", uiLang:"Langue de l'application",
    theme:"Thème", auto:"Auto", light:"Clair", dark:"Sombre", sepia:"Sépia", fontSize:"Taille du texte",
    autoNext:"Enchaîner les chapitres à l'écoute", about:"À propos", createdBy:"Créée par", versions:"Versions installées",
    notInstalled:"Le texte complet de cette version n'est pas encore installé dans l'application.",
    license:"Cette traduction est sous droits d'auteur : une licence de l'éditeur est nécessaire pour l'utiliser.",
    demoOnly:"Extrait de démonstration : seul le Psaume 23 est inclus pour cette version. Importez le texte complet (voir LISEZ-MOI.md).",
    noChapter:"Ce chapitre n'est pas disponible dans cette version.", emptySaved:"Aucun verset enregistré. Touchez un verset pour le mettre en favori, le surligner ou y ajouter une note.",
    copied:"Copié", noAudio:"Audio indisponible pour ce chapitre.", noVoice:"Aucune voix de synthèse sur cet appareil.",
    readPassage:"Lire le passage", listen:"Écouter", stop:"Arrêter", tNotInst:"non installée", ok:"installée", missing:"absente", pd:"domaine public", rights:"licence requise",
    mergedChapter:"Dans cette version, ce texte est inclus dans le chapitre précédent (la numérotation diffère).",
    planTitle:"Plan de lecture", planDesc:"Lisez la Bible à votre rythme, jour après jour. Choisissez un plan :",
    planYear:"La Bible en 1 an", planNT:"Nouveau Testament en 90 jours", planWis:"Psaumes et Proverbes en 30 jours",
    planDay:"Jour", planOf:"sur", planDone:"Jour terminé ✓", planUndo:"Annuler le dernier jour", planRestart:"Changer de plan",
    planFinished:"Plan terminé. Félicitations !", offline:"Utilisation hors ligne", offlineInfo:"Enregistrez les textes sur cet appareil pour lire sans connexion.",
    offNoCache:"Ce navigateur ne permet pas d'enregistrer les textes. Utilisez Chrome ou Safari.", offSaving:"Enregistrement…", offPartial:"Certains textes n'ont pas pu être enregistrés. Réessayez avec Internet.", mb:"Mo", offSave:"Enregistrer", offlineAskT:"Lire sans Internet", offlineAskB:"Enregistrer toutes les versions sur cet appareil (≈ {n} Mo) pour lire la Bible sans connexion ? Mieux vaut le faire en Wi-Fi.", offlineAskYes:"Tout enregistrer", offlineAskNo:"Plus tard", med:"Méditer", offlineBtn:"Télécharger toutes les versions", offlineDone:"Toutes les versions sont enregistrées.",
    voiceFail:"Le son n'a pas démarré. Vérifiez le volume, puis installez une voix dans les réglages de l'appareil (Synthèse vocale).",
    voiceTest:"Tester la voix", voiceInfo:"Voix détectées", voiceSample:"Bonjour, ceci est un test de la voix.", verifyNote:"droits à vérifier",
    audio:"Audio", voiceAuto:"Auto (voix féminine)", engLabel:"Moteur vocal", engAuto:"Auto (appareil, sinon intégré)", engBuiltin:"Voix intégrée de l'application", bvLabel:"Voix intégrée", bvF:"Femme ♀", bvM:"Homme ♂", builtinNote:"Votre appareil n'a pas de voix de synthèse. La voix intégrée de l'application est utilisée : elle est simple et un peu robotique. Pour une voix plus naturelle, ouvrez ce lien dans Chrome ou Safari.", voiceFor:"Voix :", loading:"Chargement du texte biblique…", retry:"Réessayer",
    cloudBlocked:"La voix en ligne ne peut pas fonctionner ici (fenêtre intégrée ou pas d'Internet). Ouvrez l'application directement dans Chrome ou Safari.",
    engInfoEmbedded:"Voix de secours (robotique). Vous êtes dans une fenêtre intégrée : l'appareil n'y fournit pas sa voix naturelle. Ouvrez Yeshua directement dans Chrome ou Safari pour entendre la voix de votre téléphone.",
    cloudTitle:"Voix en ligne (la plus humaine)",
    cloudInfo:"Une voix très naturelle, fournie par un service en ligne payant à l'usage (OpenAI). Collez votre clé : elle reste sur cet appareil. Il faut Internet, et cela ne marche pas dans un aperçu intégré : ouvrez l'application dans Chrome ou Safari.",
    cloudKey:"Clé du service", cloudVoice:"Voix", cloudSave:"Enregistrer et tester", cloudRemove:"Supprimer la clé", cloudSaved:"Clé enregistrée.", cloudRemoved:"Clé supprimée.",
    guideBtn:"Améliorer la voix", guideTitle:"Obtenir une voix naturelle", guideNow:"Votre appareil",
    guideAndroid:"Android : ouvrez Réglages > Langue et saisie (ou Gestion globale) > Synthèse vocale. Choisissez le moteur « Reconnaissance et synthèse vocales de Google », touchez l'engrenage, puis « Installer les données vocales ». Téléchargez le français, l'anglais et l'allemand, en choisissant la meilleure qualité. Le nom des menus varie selon la marque. Ouvrez ensuite Yeshua dans Chrome.",
    guideIOS:"iPhone / iPad : ouvrez Réglages > Accessibilité > Contenu énoncé > Voix. Pour chaque langue, téléchargez une voix « Premium » ou « Améliorée » (par exemple Amélie, Thomas ou Anna). Ouvrez ensuite Yeshua dans Safari.",
    guideWin:"Windows : ouvrez Yeshua dans Microsoft Edge, qui propose en ligne des voix « Natural » très réalistes.",
    guideMac:"Mac : ouvrez Réglages Système > Accessibilité > Contenu énoncé > Voix du système > Gérer les voix, puis téléchargez des voix « Premium » ou « Améliorée ». Ouvrez ensuite Yeshua dans Safari.",
    guideWeb:"Important : dans la fenêtre intégrée d'une autre application (un aperçu dans une application de discussion, par exemple), le téléphone ne donne souvent aucune voix à Yeshua, qui utilise alors sa voix intégrée, plus robotique. Ouvrez l'adresse directement dans Chrome ou Safari.",
    guideThen:"Ensuite, revenez dans Réglages > Audio : choisissez la meilleure voix détectée, puis touchez « Tester la voix ».",
    engInfoDevice:"Voix : {n}", engInfoBuiltin:"Voix intégrée (synthétique). Pour une voix plus naturelle, installez une voix de qualité dans les réglages de l'appareil (Synthèse vocale).", engInfoCloud:"Voix en ligne : {n}", cloudFail:"La voix en ligne ne répond pas ({e}). Retour à la voix de l'appareil.",
    passage:"Passage", listenPassage:"Écouter le passage", structTitle:"Repères : la Bible en un coup d'œil", wBooks:"livres", wChapters:"chapitres", wOT:"Ancien Testament", wNT:"Nouveau Testament", wTotal:"Total",
    booksTitle:"Les livres de la Bible", booksDesc:"Touchez un livre pour découvrir son auteur, son époque, son thème et son verset clé.", author:"Auteur", date:"Époque", theme:"Thème", keyVerse:"Verset clé", readBook:"Lire ce livre", chaptersN:"chapitres", teachTitle:"Méditations",
    scopeAll:"Toute la Bible", scopeOT:"Ancien Testament", scopeNT:"Nouveau Testament",
    jumpHint:"Astuce : tapez une référence (ex. Jean 3:16) pour y aller directement, ou un mot pour chercher.",
    loadFail:"Impossible de charger le texte pour le moment (connexion lente ou coupée). Vos données ne sont pas perdues." },
  en: { read:"Read", search:"Search", teach:"Teachings", saved:"My verses", settings:"Settings",
    searchPh:"Word or phrase…", noResults:"No results.", results:"result(s)", cmpNone:"Compare: none",
    cmpWith:"Compare:", ot:"Old Testament", nt:"New Testament", chapter:"Chapter", book:"Book",
    fav:"Favorite", unfav:"Remove favorite", note:"Note", copy:"Copy", share:"Share", color:"Highlight",
    save:"Save", close:"Close", listenFrom:"Listen from here", uiLang:"App language",
    theme:"Theme", auto:"Auto", light:"Light", dark:"Dark", sepia:"Sepia", fontSize:"Text size",
    autoNext:"Continue to next chapter when listening", about:"About", createdBy:"Created by", versions:"Installed versions",
    notInstalled:"The full text of this version is not installed in the app yet.",
    license:"This translation is under copyright: a publisher licence is required to use it.",
    demoOnly:"Demo excerpt: only Psalm 23 is included for this version. Import the full text (see README).",
    noChapter:"This chapter is not available in this version.", emptySaved:"No saved verses yet. Tap a verse to favorite it, highlight it or add a note.",
    copied:"Copied", noAudio:"Audio unavailable for this chapter.", noVoice:"No speech voice on this device.",
    readPassage:"Read the passage", listen:"Listen", stop:"Stop", tNotInst:"not installed", ok:"installed", missing:"missing", pd:"public domain", rights:"licence required",
    mergedChapter:"In this version, this text is included in the previous chapter (numbering differs).",
    planTitle:"Reading plan", planDesc:"Read the Bible at your own pace, day by day. Choose a plan:",
    planYear:"The Bible in 1 year", planNT:"New Testament in 90 days", planWis:"Psalms and Proverbs in 30 days",
    planDay:"Day", planOf:"of", planDone:"Day complete ✓", planUndo:"Undo last day", planRestart:"Change plan",
    planFinished:"Plan complete. Well done!", offline:"Offline use", offlineInfo:"Save the texts on this device to read without a connection.",
    offNoCache:"This browser cannot store the texts. Use Chrome or Safari.", offSaving:"Saving…", offPartial:"Some texts could not be saved. Try again online.", mb:"MB", offSave:"Save", offlineAskT:"Read without Internet", offlineAskB:"Save all versions on this device (≈ {n} MB) to read the Bible offline? Best done on Wi-Fi.", offlineAskYes:"Save all", offlineAskNo:"Later", med:"Meditate", offlineBtn:"Download all versions", offlineDone:"All versions saved.",
    voiceFail:"Sound did not start. Check the volume, then install a voice in your device settings (Text-to-speech).",
    voiceTest:"Test the voice", voiceInfo:"Voices found", voiceSample:"Hello, this is a voice test.", verifyNote:"rights to verify",
    audio:"Audio", voiceAuto:"Auto (female voice)", engLabel:"Speech engine", engAuto:"Auto (device, else built-in)", engBuiltin:"App built-in voice", bvLabel:"Built-in voice", bvF:"Female ♀", bvM:"Male ♂", builtinNote:"Your device has no speech voice. The app's built-in voice is used: it is simple and a little robotic. For a more natural voice, open this link in Chrome or Safari.", voiceFor:"Voice:", loading:"Loading Bible text…", retry:"Retry",
    cloudBlocked:"The online voice cannot work here (embedded window or no Internet). Open the app directly in Chrome or Safari.",
    engInfoEmbedded:"Fallback voice (robotic). You are in an embedded window: the device does not provide its natural voice here. Open Yeshua directly in Chrome or Safari to hear your phone's voice.",
    cloudTitle:"Online voice (the most human)",
    cloudInfo:"A very natural voice from a pay-as-you-go online service (OpenAI). Paste your key: it stays on this device. It needs Internet, and does not work inside an embedded preview: open the app in Chrome or Safari.",
    cloudKey:"Service key", cloudVoice:"Voice", cloudSave:"Save and test", cloudRemove:"Delete the key", cloudSaved:"Key saved.", cloudRemoved:"Key deleted.",
    guideBtn:"Improve the voice", guideTitle:"Getting a natural voice", guideNow:"Your device",
    guideAndroid:"Android: open Settings > Language & input (or General management) > Text-to-speech. Choose the engine \"Speech Services by Google\", tap the gear, then \"Install voice data\". Download French, English and German, picking the best quality. Menu names vary by brand. Then open Yeshua in Chrome.",
    guideIOS:"iPhone / iPad: open Settings > Accessibility > Spoken Content > Voices. For each language, download a \"Premium\" or \"Enhanced\" voice (for example Amélie, Thomas or Anna). Then open Yeshua in Safari.",
    guideWin:"Windows: open Yeshua in Microsoft Edge, which offers very realistic online \"Natural\" voices.",
    guideMac:"Mac: open System Settings > Accessibility > Spoken Content > System Voice > Manage Voices, then download \"Premium\" or \"Enhanced\" voices. Then open Yeshua in Safari.",
    guideWeb:"Important: inside another app's embedded window (a preview in a chat app, for example), the phone often gives Yeshua no voice at all, so it falls back on its built-in, more robotic voice. Open the address directly in Chrome or Safari.",
    guideThen:"Then go back to Settings > Audio: pick the best detected voice and tap \"Test the voice\".",
    engInfoDevice:"Voice: {n}", engInfoBuiltin:"Built-in voice (synthetic). For a more natural voice, install a high-quality voice in your device settings (Text-to-speech).", engInfoCloud:"Online voice: {n}", cloudFail:"The online voice is not responding ({e}). Falling back to the device voice.",
    passage:"Passage", listenPassage:"Listen to the passage", structTitle:"Landmarks: the Bible at a glance", wBooks:"books", wChapters:"chapters", wOT:"Old Testament", wNT:"New Testament", wTotal:"Total",
    booksTitle:"Books of the Bible", booksDesc:"Tap a book to see its author, period, theme and key verse.", author:"Author", date:"Period", theme:"Theme", keyVerse:"Key verse", readBook:"Read this book", chaptersN:"chapters", teachTitle:"Reflections",
    scopeAll:"Whole Bible", scopeOT:"Old Testament", scopeNT:"New Testament",
    jumpHint:"Tip: type a reference (e.g. John 3:16) to jump straight to it, or a word to search.",
    loadFail:"Could not load the text right now (slow or lost connection). Your data is safe." },
  de: { read:"Lesen", search:"Suchen", teach:"Lehre", saved:"Meine Verse", settings:"Einstellungen",
    searchPh:"Wort oder Ausdruck…", noResults:"Keine Treffer.", results:"Treffer", cmpNone:"Vergleich: keiner",
    cmpWith:"Vergleich:", ot:"Altes Testament", nt:"Neues Testament", chapter:"Kapitel", book:"Buch",
    fav:"Favorit", unfav:"Favorit entfernen", note:"Notiz", copy:"Kopieren", share:"Teilen", color:"Markieren",
    save:"Speichern", close:"Schließen", listenFrom:"Ab hier anhören", uiLang:"App-Sprache",
    theme:"Design", auto:"Auto", light:"Hell", dark:"Dunkel", sepia:"Sepia", fontSize:"Textgröße",
    autoNext:"Beim Hören zum nächsten Kapitel weiter", about:"Über", createdBy:"Erstellt von", versions:"Installierte Versionen",
    notInstalled:"Der vollständige Text dieser Version ist in der App noch nicht installiert.",
    license:"Diese Übersetzung ist urheberrechtlich geschützt: Eine Lizenz des Verlags ist erforderlich.",
    demoOnly:"Demo-Auszug: Für diese Version ist nur Psalm 23 enthalten. Vollständigen Text importieren (siehe README).",
    noChapter:"Dieses Kapitel ist in dieser Version nicht verfügbar.", emptySaved:"Noch keine gespeicherten Verse. Tippen Sie auf einen Vers, um ihn zu favorisieren, zu markieren oder zu kommentieren.",
    copied:"Kopiert", noAudio:"Kein Audio für dieses Kapitel.", noVoice:"Keine Sprachausgabe auf diesem Gerät.",
    readPassage:"Abschnitt lesen", listen:"Anhören", stop:"Stopp", tNotInst:"nicht installiert", ok:"installiert", missing:"fehlt", pd:"gemeinfrei", rights:"Lizenz nötig",
    mergedChapter:"In dieser Version ist dieser Text im vorherigen Kapitel enthalten (andere Zählung).",
    planTitle:"Leseplan", planDesc:"Lesen Sie die Bibel in Ihrem Tempo, Tag für Tag. Wählen Sie einen Plan:",
    planYear:"Die Bibel in 1 Jahr", planNT:"Neues Testament in 90 Tagen", planWis:"Psalmen und Sprüche in 30 Tagen",
    planDay:"Tag", planOf:"von", planDone:"Tag erledigt ✓", planUndo:"Letzten Tag rückgängig", planRestart:"Plan wechseln",
    planFinished:"Plan abgeschlossen. Gut gemacht!", offline:"Offline-Nutzung", offlineInfo:"Speichern Sie die Texte auf diesem Gerät, um ohne Verbindung zu lesen.",
    offNoCache:"Dieser Browser kann die Texte nicht speichern. Nutzen Sie Chrome oder Safari.", offSaving:"Speichern…", offPartial:"Einige Texte konnten nicht gespeichert werden. Versuchen Sie es online erneut.", mb:"MB", offSave:"Speichern", offlineAskT:"Ohne Internet lesen", offlineAskB:"Alle Versionen auf diesem Gerät speichern (≈ {n} MB), um die Bibel offline zu lesen? Am besten im WLAN.", offlineAskYes:"Alles speichern", offlineAskNo:"Später", med:"Meditieren", offlineBtn:"Alle Versionen laden", offlineDone:"Alle Versionen gespeichert.",
    voiceFail:"Der Ton wurde nicht gestartet. Lautstärke prüfen und in den Geräteeinstellungen eine Stimme installieren (Sprachausgabe).",
    voiceTest:"Stimme testen", voiceInfo:"Gefundene Stimmen", voiceSample:"Hallo, das ist ein Stimmtest.", verifyNote:"Rechte prüfen",
    audio:"Audio", voiceAuto:"Auto (weibliche Stimme)", engLabel:"Sprachmodul", engAuto:"Auto (Gerät, sonst integriert)", engBuiltin:"Integrierte App-Stimme", bvLabel:"Integrierte Stimme", bvF:"Frau ♀", bvM:"Mann ♂", builtinNote:"Ihr Gerät hat keine Sprachausgabe. Die integrierte Stimme der App wird verwendet: einfach und etwas roboterhaft. Für eine natürlichere Stimme öffnen Sie diesen Link in Chrome oder Safari.", voiceFor:"Stimme:", loading:"Bibeltext wird geladen…", retry:"Erneut versuchen",
    cloudBlocked:"Die Online-Stimme kann hier nicht funktionieren (eingebettetes Fenster oder kein Internet). Öffnen Sie die App direkt in Chrome oder Safari.",
    engInfoEmbedded:"Ersatzstimme (roboterhaft). Sie befinden sich in einem eingebetteten Fenster: Das Gerät stellt hier seine natürliche Stimme nicht bereit. Öffnen Sie Yeshua direkt in Chrome oder Safari, um die Stimme Ihres Telefons zu hören.",
    cloudTitle:"Online-Stimme (die menschlichste)",
    cloudInfo:"Eine sehr natürliche Stimme von einem Online-Dienst, der nach Nutzung bezahlt wird (OpenAI). Fügen Sie Ihren Schlüssel ein: Er bleibt auf diesem Gerät. Internet ist nötig, und es funktioniert nicht in einer eingebetteten Vorschau: Öffnen Sie die App in Chrome oder Safari.",
    cloudKey:"Dienst-Schlüssel", cloudVoice:"Stimme", cloudSave:"Speichern und testen", cloudRemove:"Schlüssel löschen", cloudSaved:"Schlüssel gespeichert.", cloudRemoved:"Schlüssel gelöscht.",
    guideBtn:"Stimme verbessern", guideTitle:"Eine natürliche Stimme erhalten", guideNow:"Ihr Gerät",
    guideAndroid:"Android: Öffnen Sie Einstellungen > Sprache & Eingabe (oder Allgemeine Verwaltung) > Sprachausgabe. Wählen Sie die Engine „Sprachdienste von Google“, tippen Sie auf das Zahnrad und dann auf „Sprachdaten installieren“. Laden Sie Französisch, Englisch und Deutsch in bester Qualität herunter. Die Menünamen variieren je nach Hersteller. Öffnen Sie Yeshua danach in Chrome.",
    guideIOS:"iPhone / iPad: Öffnen Sie Einstellungen > Bedienungshilfen > Gesprochene Inhalte > Stimmen. Laden Sie für jede Sprache eine „Premium“- oder „Erweitert“-Stimme herunter (zum Beispiel Anna, Markus oder Amélie). Öffnen Sie Yeshua danach in Safari.",
    guideWin:"Windows: Öffnen Sie Yeshua in Microsoft Edge, das sehr realistische Online-Stimmen („Natural“) anbietet.",
    guideMac:"Mac: Öffnen Sie Systemeinstellungen > Bedienungshilfen > Gesprochene Inhalte > Systemstimme > Stimmen verwalten und laden Sie „Premium“- oder „Erweitert“-Stimmen herunter. Öffnen Sie Yeshua danach in Safari.",
    guideWeb:"Wichtig: In einem eingebetteten Fenster einer anderen App (zum Beispiel einer Vorschau in einer Chat-App) stellt das Telefon Yeshua oft gar keine Stimme bereit, sodass die integrierte, roboterhaftere Stimme verwendet wird. Öffnen Sie die Adresse direkt in Chrome oder Safari.",
    guideThen:"Gehen Sie danach zurück zu Einstellungen > Audio: Wählen Sie die beste erkannte Stimme und tippen Sie auf „Stimme testen“.",
    engInfoDevice:"Stimme: {n}", engInfoBuiltin:"Integrierte Stimme (synthetisch). Für eine natürlichere Stimme installieren Sie in den Geräteeinstellungen eine hochwertige Stimme (Sprachausgabe).", engInfoCloud:"Online-Stimme: {n}", cloudFail:"Die Online-Stimme antwortet nicht ({e}). Zurück zur Gerätestimme.",
    passage:"Abschnitt", listenPassage:"Abschnitt anhören", structTitle:"Orientierung: die Bibel auf einen Blick", wBooks:"Bücher", wChapters:"Kapitel", wOT:"Altes Testament", wNT:"Neues Testament", wTotal:"Gesamt",
    booksTitle:"Die Bücher der Bibel", booksDesc:"Tippen Sie auf ein Buch, um Verfasser, Zeit, Thema und Leitvers zu sehen.", author:"Verfasser", date:"Zeit", theme:"Thema", keyVerse:"Leitvers", readBook:"Dieses Buch lesen", chaptersN:"Kapitel", teachTitle:"Andachten",
    scopeAll:"Ganze Bibel", scopeOT:"Altes Testament", scopeNT:"Neues Testament",
    jumpHint:"Tipp: Geben Sie eine Stelle ein (z. B. Johannes 3,16), um direkt dorthin zu springen, oder ein Wort zum Suchen.",
    loadFail:"Der Text konnte gerade nicht geladen werden (langsame oder unterbrochene Verbindung). Ihre Daten sind sicher." }
};

// ---------- état ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
function guessLang() { const l = (navigator.language || "fr").slice(0, 2); return LANGS[l] ? l : "fr"; }
const first = guessLang();
const S = Object.assign({ ui: first, theme: "auto", fs: 19, book: 1, ch: 1, ver: DEFAULT_VER[first], cmp: "",
  rate: 1, voice: {}, bv: "f", eng: "auto", autoNext: true, plan: null, fav: {}, hl: {}, notes: {} }, store.get("yeshua.s", {}));
if (S.bvV !== 2) { S.bv = "m"; S.bvV = 2; }   // voix d'homme par défaut
const EMBEDDED = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
const save = () => store.set("yeshua.s", S);
const t = (k) => (I18N[S.ui] && I18N[S.ui][k]) || I18N.fr[k] || k;
const verInfo = (id) => V.find((v) => v.id === id) || V[0];
const bookName = (b, lang) => B[b - 1][LI[lang]];
const key = (b, c, v) => b + "." + c + "." + v;
const avail = {};

// ---------- utilitaires ----------
function el(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const k in props || {}) {
    if (k === "class") e.className = props[k];
    else if (k === "text") e.textContent = props[k];
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), props[k]);
    else e.setAttribute(k, props[k]);
  }
  kids.flat().forEach((c) => { if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c)); });
  return e;
}
function toast(msg, ms) {
  const d = el("div", { text: msg });
  d.style.cssText = "position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#222;color:#fff;padding:10px 16px;border-radius:20px;z-index:50;font-size:.9rem";
  document.body.append(d); setTimeout(() => d.remove(), ms || 2200);
}
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

let lastErr = "";
const BIBLE_CACHE = "yeshua-bibles";          // même nom que dans sw.js : textes conservés pour le hors-ligne
const BK = new Map(), BK_MAX = 6;             // livres en mémoire (les plus récents seulement)
const split = {}, pendingBk = {}; let mono = null;   // mono : ancien format « un fichier par version » (secours)
const bkKey = (id, b) => id + "/" + b;
const hasBook = (id, b) => BK.has(bkKey(id, b));
async function openStore() { try { return ("caches" in window) ? await caches.open(BIBLE_CACHE) : null; } catch (e) { return null; } }
async function fetchJSON(url) {
  const store = await openStore();
  if (store) { try { const hit = await store.match(url); if (hit) return await hit.json(); } catch (e) {} }
  let lastError;
  for (let a = 0; a < 3; a++) {
    const ctl = ("AbortController" in window) ? new AbortController() : null;
    const to = setTimeout(() => { if (ctl) ctl.abort(); }, 60000);
    try {
      const r = await fetch(url, ctl ? { signal: ctl.signal } : undefined);
      if (!r.ok) { const er = new Error("HTTP " + r.status); er.status = r.status; clearTimeout(to); throw er; }
      const copy = r.clone(), data = await r.json();
      clearTimeout(to);
      if (store) { try { await store.put(url, copy); } catch (e) {} }
      return data;
    } catch (e) { clearTimeout(to); lastError = e; if (e.status === 404) break; await new Promise((ok) => setTimeout(ok, 700 * (a + 1))); }
  }
  throw lastError;
}
function remember(k, d) { BK.delete(k); BK.set(k, d); while (BK.size > BK_MAX) BK.delete(BK.keys().next().value); }
async function loadBook(id, b) {
  const k = bkKey(id, b);
  if (BK.has(k)) { const d = BK.get(k); BK.delete(k); BK.set(k, d); return d; }
  if (pendingBk[k]) return pendingBk[k];
  pendingBk[k] = (async () => {
    if (split[id] !== false) {
      try { const d = await fetchJSON("data/bibles/" + id + "/" + b + ".json"); split[id] = true; remember(k, d); return d; }
      catch (e) { if (!(e && e.status === 404 && split[id] === undefined)) throw e; split[id] = false; }
    }
    if (!mono || mono.id !== id) { mono = null; const m = await fetchJSON("data/bibles/" + id + ".json"); mono = { id, books: m.books }; }
    const d = mono.books[b] || {}; remember(k, d); return d;
  })().finally(() => { delete pendingBk[k]; });
  return pendingBk[k];
}
// Renvoie { books: { n: { chapitre: [versets] } } } pour le(s) livre(s) demandé(s), ou null si illisible.
async function loadBible(id, bs) {
  const list = Array.isArray(bs) ? bs : [bs == null ? S.book : bs], out = { id, books: {} };
  try { for (const b of list) out.books[b] = await loadBook(id, b); return out; }
  catch (e) { lastErr = (e && e.message) || String(e); return null; }
}
// Hors ligne : enregistre les textes dans le cache de l'appareil
async function bibleUrls(id) {
  if (split[id] === undefined) { try { await loadBook(id, 1); } catch (e) {} }
  if (split[id] === false) return ["data/bibles/" + id + ".json"];
  return Array.from({ length: 66 }, (_, i) => "data/bibles/" + id + "/" + (i + 1) + ".json");
}
async function offlineStatus() {
  const store = await openStore(), st = {};
  if (!store) return null;
  const keys = (await store.keys()).map((r) => new URL(r.url).pathname);
  V.forEach((v) => {
    if (!avail[v.id]) return;
    const n = keys.filter((k) => k.indexOf("/data/bibles/" + v.id + "/") >= 0).length;
    st[v.id] = n >= 66 || keys.some((k) => k.endsWith("/data/bibles/" + v.id + ".json")) ? 1 : n / 66;
  });
  return st;
}
async function saveOffline(ids, onProgress) {
  const store = await openStore(); if (!store) throw new Error("cache");
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  let urls = []; for (const id of ids) urls = urls.concat(await bibleUrls(id));
  let done = 0, i = 0, fails = 0;
  const worker = async () => {
    while (i < urls.length) {
      const u = urls[i++];
      try {
        if (!(await store.match(u))) { const r = await fetch(u); if (!r.ok) throw new Error("HTTP " + r.status); await store.put(u, r); }
      } catch (e) { fails++; }
      done++; if (onProgress) onProgress(done, urls.length);
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  return fails;
}
// Message affiché quand le texte d'une version n'a pas pu être lu
function missingMsg(ver) {
  return (ver.pd && avail[ver.id] !== false) ? t("loadFail") + " (" + lastErr + ")" : t("notInstalled") + (ver.pd ? "" : " " + t("license"));
}
const verses = (bible, b, c) => (bible && bible.books && bible.books[b] && bible.books[b][c]) || null;

// ---------- navigation ----------
function show(view) {
  document.querySelectorAll(".view").forEach((s) => (s.hidden = s.id !== "v-" + view));
  document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.v === view));
  if (view === "search" && !$("#results").children.length) $("#results").append(el("p", { class: "hint", text: t("jumpHint") }));
  if (view !== "med" && window.YMED) YMED.leave();
  if (view === "med" && window.YMED) YMED.render();
  if (view === "teach") renderTeach();
  if (view === "saved") renderSaved();
  if (view === "set") renderSettings();
  window.scrollTo(0, 0);
}
function go(b, c, v) {
  stopAudio(); S.book = b; S.ch = c; save(); show("read"); renderRead().then(() => {
    if (v) { const n = document.querySelector('.v[data-n="' + v + '"]'); if (n) n.scrollIntoView({ block: "center" }); }
  });
}
function advance(dir) {
  let b = S.book, c = S.ch + dir;
  if (c < 1) { if (b === 1) return false; b--; c = B[b - 1][0]; }
  else if (c > B[b - 1][0]) { if (b === 66) return false; b++; c = 1; }
  S.book = b; S.ch = c; save(); return true;
}

// ---------- lecture ----------
let rtok = 0;
async function renderRead() {
  const tok = ++rtok, ver = verInfo(S.ver), lang = ver.lang;
  $("#refBtn").textContent = bookName(S.book, lang) + " " + S.ch;
  if (!hasBook(S.ver, S.book)) { const nt = $("#notice"); nt.hidden = false; nt.textContent = t("loading"); }
  const bible = await loadBible(S.ver, S.book);
  const cb = S.cmp ? await loadBible(S.cmp, S.book) : null;
  if (tok !== rtok) return;
  const vs = verses(bible, S.book, S.ch), cvs = cb ? verses(cb, S.book, S.ch) : null;
  const notice = $("#notice"), box = $("#text");
  box.replaceChildren(); box.style.setProperty("--fs", S.fs + "px");
  let msg = "";
  if (!bible) msg = missingMsg(ver);
  else if (!vs) msg = bible.demo ? t("demoOnly") : (bible.books && bible.books[S.book] ? t("mergedChapter") : t("noChapter"));
  else if (bible.demo) msg = t("demoOnly");
  notice.hidden = !msg; notice.textContent = msg;
  if (!bible && ver.pd && avail[ver.id] !== false)
    notice.append(el("div", { class: "row" }, el("button", { class: "btn primary", text: t("retry"), onclick: () => renderRead() })));
  if (!vs) return;
  vs.forEach((txt, i) => {
    if (!txt) return;
    const n = i + 1, k = key(S.book, S.ch, n);
    const d = el("div", { class: "v", "data-n": n }, el("sup", { text: n }), txt);
    if (S.hl[k]) d.classList.add("hl" + S.hl[k]);
    if (S.fav[k]) d.classList.add("fav");
    if (S.notes[k]) d.classList.add("has-note");
    if (cvs && cvs[i]) d.append(el("span", { class: "cmp" }, el("b", { text: verInfo(S.cmp).short }), cvs[i]));
    box.append(d);
  });
}

function openSheet(...kids) {
  const sh = $("#sheet"); sh.replaceChildren(...kids); sh.hidden = false; $("#scrim").hidden = false; sh.scrollTop = 0;
}
function closeSheet() { $("#sheet").hidden = true; $("#scrim").hidden = true; }

function openRef() {
  const lang = verInfo(S.ver).lang;
  const sec = (title, from, to) => [el("h3", { text: title }), el("div", { class: "grid books" },
    B.slice(from, to).map((bk, i) => el("button", { class: from + i + 1 === S.book ? "cur" : "", text: bk[LI[lang]],
      onclick: () => pickChapter(from + i + 1) })))];
  openSheet(...sec(t("ot"), 0, 39), ...sec(t("nt"), 39, 66));
}
function pickChapter(b) {
  const lang = verInfo(S.ver).lang, n = B[b - 1][0];
  const g = el("div", { class: "grid" });
  for (let c = 1; c <= n; c++) g.append(el("button", { class: b === S.book && c === S.ch ? "cur" : "", text: c,
    onclick: () => { closeSheet(); go(b, c); } }));
  openSheet(el("h3", { text: bookName(b, lang) + " — " + t("chapter") }), g);
}

function openVerse(n) {
  const k = key(S.book, S.ch, n), lang = verInfo(S.ver).lang;
  const vEl = document.querySelector('.v[data-n="' + n + '"]');
  const txt = vEl ? Array.from(vEl.childNodes).filter((x) => x.nodeType === 3).map((x) => x.textContent).join("").trim() : "";
  const ref = bookName(S.book, lang) + " " + S.ch + ":" + n;
  const full = "« " + txt + " » — " + ref + " (" + verInfo(S.ver).short + ")";
  const ta = el("textarea", { placeholder: t("note") }); ta.value = S.notes[k] || "";
  const colors = [1, 2, 3].map((c) => el("button", { class: "swatch", "aria-label": t("color") + " " + c,
    style: "background:var(--hl" + c + ")", onclick: () => { S.hl[k] = S.hl[k] === c ? 0 : c; if (!S.hl[k]) delete S.hl[k]; save(); closeSheet(); renderRead(); } }));
  openSheet(
    el("h3", { text: ref + " · " + verInfo(S.ver).short }), el("p", { class: "quote", text: txt }),
    el("div", { class: "row" },
      el("button", { class: "btn", text: S.fav[k] ? "♥ " + t("unfav") : "♡ " + t("fav"),
        onclick: () => { S.fav[k] ? delete S.fav[k] : (S.fav[k] = 1); save(); closeSheet(); renderRead(); } }),
      el("button", { class: "btn", text: "⧉ " + t("copy"), onclick: async () => {
        try { await navigator.clipboard.writeText(full); toast(t("copied")); } catch (e) { prompt("", full); } closeSheet(); } }),
      navigator.share ? el("button", { class: "btn", text: "↗ " + t("share"), onclick: () => navigator.share({ text: full }).catch(() => {}) }) : null,
      el("button", { class: "btn", text: "▶ " + t("listenFrom"), onclick: () => { prime(); closeSheet(); playChapter(n - 1); } })),
    el("div", { class: "row" }, el("span", { text: t("color") + " :" }), colors),
    ta,
    el("div", { class: "row" },
      el("button", { class: "btn primary", text: t("save"), onclick: () => {
        const v = ta.value.trim(); v ? (S.notes[k] = v) : delete S.notes[k]; save(); closeSheet(); renderRead(); } }),
      el("button", { class: "btn", text: t("close"), onclick: closeSheet })));
}

// ---------- audio ----------
const A = { on: false, idx: 0, tok: 0, chap: "", rec: null };
const TTSOK = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
let voices = [];
function refreshVoices() { if (TTSOK) { try { voices = speechSynthesis.getVoices() || []; } catch (e) {} } }
if (TTSOK) { refreshVoices(); try { speechSynthesis.addEventListener("voiceschanged", refreshVoices); } catch (e) {} }
const FEM = /(female|femme|woman|frau|am[eé]lie|audrey|aur[eé]lie|marie|julie|c[eé]line|h[eé]l[eè]ne|hortense|denise|eloise|[eé]lo[iï]se|vivienne|brigitte|samantha|karen|moira|tessa|serena|susan|zira|hazel|jenny|aria|emma|libby|sonia|katja|hedda|marlene|vicki|anna|petra|steffi|elke|amy|joanna|salli|kimberly|ivy|nicole|google fran[cç]ais|google deutsch|google us english)/i;
const MAL = /(^|[^a-z])(male|homme|mann)\b|thomas|daniel|paul|claude|jacques|henri|mathieu|maxim|nicolas|guillaume|martin|markus|stefan|conrad|yannick|hans|reed|rocko|eddy|fred|alex|david|mark|george|james|ryan|guy|brian|matthew|joey|justin|kevin|russell|arthur|oliver|rishi|lee\b|gordon|bruce|ralph|junior|albert|jester/i;
const isFem = (v) => FEM.test(v.name || "") && !MAL.test((v.name || "").replace(/female/i, ""));
function voiceScore(v, lang) {
  const n = v.name || "", l = (v.lang || "").toLowerCase().replace("_", "-");
  let s = 0;
  const fem = /female|femme|frau/i.test(n) ? 20 : FEM.test(n) ? 10 : 0, mal = MAL.test(n.replace(/female/i, "")) ? 15 : 0;
  if (S.bv === "m") s += (mal ? 15 : 0) - fem; else s += fem - mal;
  if (l === TTS[lang].toLowerCase()) s += 3;
  if (v.localService) s += 2;
  if (/natural|neural|premium|enhanced|wavenet|studio|online|siri/i.test(n)) s += 12;   // voix plus humaines
  if (/espeak|compact|robot|novelty|zarvox|trinoids|whisper|bells|boing|cellos|organ|bad news/i.test(n)) s -= 40;
  return s;
}
function voicesOf(lang) { return voices.filter((v) => (v.lang || "").toLowerCase().replace("_", "-").startsWith(lang)); }
function voiceFor(lang) {
  const m = voicesOf(lang); if (!m.length) return null;
  const chosen = S.voice && S.voice[lang];
  if (chosen) { const c = m.find((v) => v.name === chosen); if (c) return c; }
  return m.slice().sort((a, b) => voiceScore(b, lang) - voiceScore(a, lang))[0];
}
function voicesReady() {
  return new Promise((ok) => {
    refreshVoices(); if (voices.length || !TTSOK) return ok();
    let d = false; const f = () => { if (d) return; d = true; refreshVoices(); ok(); };
    try { speechSynthesis.addEventListener("voiceschanged", f, { once: true }); } catch (e) {}
    setTimeout(f, 1500);
  });
}
// Débloque le son (iOS/Safari) : à appeler directement dans le geste de l'utilisateur.
let AC = null, BS = null, deviceBroken = false;
const BUILTIN = !!(window.YV && window.YV.synth && (window.AudioContext || window.webkitAudioContext));
function ensureAC() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } }
  if (AC && AC.state === "suspended") { try { AC.resume(); } catch (e) {} }
  return AC;
}
const canSpeak = () => TTSOK || BUILTIN || cloudOK();
const useDevice = (lang) => TTSOK && !deviceBroken && S.eng !== "builtin" && voicesOf(lang).length > 0;
function prime() {
  ensureAC();
  if (!TTSOK) return;
  try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
}
// Voix intégrée : synthèse faite dans l'application, sans dépendre de l'appareil
function speakBuiltin(text, lang, done, fail) {
  const ac = ensureAC();
  if (!ac || !BUILTIN) { if (fail) fail("noaudio"); return; }
  let r;
  try { r = window.YV.synth(text, lang, S.bv || "f", S.rate || 1); } catch (e) { if (fail) fail("synth"); return; }
  if (!r.pcm.length) { if (done) setTimeout(done, 0); return; }
  try {
    const buf = ac.createBuffer(1, r.pcm.length, r.fs);
    if (buf.copyToChannel) buf.copyToChannel(r.pcm, 0); else buf.getChannelData(0).set(r.pcm);
    const node = ac.createBufferSource(); node.buffer = buf; node.connect(ac.destination);
    BS = node;
    node.onended = () => { if (BS === node) { BS = null; if (done) done(); } };
    node.start();
  } catch (e) { BS = null; if (fail) fail("play"); }
}
// Découpe en phrases courtes : plus clair à l'oreille, et évite l'arrêt des longs textes sous Chrome.
function chunks(text) {
  const parts = text.match(/[^.!?;:…]+[.!?;:…]*\s*/g) || [text], out = []; let cur = "";
  parts.forEach((x) => { if ((cur + x).length > 170 && cur) { out.push(cur.trim()); cur = x; } else cur += x; });
  if (cur.trim()) out.push(cur.trim());
  const fin = [];
  out.forEach((c) => {
    if (c.length <= 220) return fin.push(c);
    let buf = ""; c.split(/,\s+/).forEach((w) => { if ((buf + ", " + w).length > 170 && buf) { fin.push(buf.trim()); buf = w; } else buf += (buf ? ", " : "") + w; });
    if (buf.trim()) fin.push(buf.trim());
  });
  return fin.filter(Boolean);
}
// Voix en ligne (optionnelle) : API compatible OpenAI /v1/audio/speech, configurée dans config.js
let cloudBroken = false, CA = null;
function getCloud() {
  if (C.cloud && C.cloud.url && C.cloud.key) return C.cloud;
  if (S.cloudKey) return { url: "https://api.openai.com/v1/audio/speech", key: S.cloudKey, model: "gpt-4o-mini-tts", voice: S.cloudVoice || "nova", voices: {} };
  return null;
}
const cloudOK = () => !!getCloud() && !cloudBroken && navigator.onLine !== false;
const CCACHE = new Map();   // évite de redemander (et de repayer) un texte déjà lu pendant la session
function speakCloud(text, lang, done, fail) {
  const cfg = getCloud(), cs = chunks(text), t0 = A.tok; let i = 0;
  const model = cfg.model || "gpt-4o-mini-tts", voice = (cfg.voices && cfg.voices[lang]) || cfg.voice || "alloy";
  const get = (c) => {
    const ck = [cfg.url, model, voice, c].join("|");
    if (CCACHE.has(ck)) return CCACHE.get(ck);
    const body = { model, voice, input: c, response_format: "mp3" };
    if (/gpt-4o/.test(model)) body.instructions = cfg.instructions || "Read this Bible text aloud in a calm, warm, natural human voice, with clear diction and gentle pacing, in the language of the text.";
    const pr = fetch(cfg.url, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + cfg.key }, body: JSON.stringify(body) })
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.blob(); });
    CCACHE.set(ck, pr); pr.catch(() => CCACHE.delete(ck));
    if (CCACHE.size > 60) CCACHE.delete(CCACHE.keys().next().value);
    return pr;
  };
  let next = get(cs[0]);
  const play = () => {
    if (t0 !== A.tok) return;
    if (i >= cs.length) return done && done();
    const cur = next; i++; if (i < cs.length) next = get(cs[i]);
    cur.then((b) => {
      if (t0 !== A.tok) return;
      const au = new Audio(URL.createObjectURL(b)); CA = au; au.playbackRate = S.rate || 1; try { au.preservesPitch = true; } catch (e) {}
      au.onended = () => { URL.revokeObjectURL(au.src); if (CA === au) CA = null; play(); };
      au.onerror = () => { if (fail) fail("audio"); };
      au.play().catch(() => { if (fail) fail("play"); });
    }).catch((e) => { if (fail) fail(e.message || "réseau"); });
  };
  play();
}
function engineInfo(lang) {
  let msg;
  if (cloudOK()) { const cg = getCloud(); msg = t("engInfoCloud").replace("{n}", (cg.voices && cg.voices[lang]) || cg.voice || "alloy"); }
  else if (useDevice(lang)) msg = t("engInfoDevice").replace("{n}", voiceFor(lang).name);
  else msg = EMBEDDED ? t("engInfoEmbedded") : t("engInfoBuiltin");
  const b = $("#audioStatus"); b.replaceChildren(el("span", { text: "🔊 " + msg }));
  if (!cloudOK() && !useDevice(lang)) b.append(el("button", { text: t("guideBtn"), onclick: openVoiceGuide }));
  b.hidden = false;
}
function openVoiceGuide() {
  const ua = navigator.userAgent || "", touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  const me = /Android/.test(ua) ? "guideAndroid" : (/iPhone|iPad|iPod/.test(ua) || touchMac) ? "guideIOS" : /Windows/.test(ua) ? "guideWin" : /Mac/.test(ua) ? "guideMac" : "";
  const all = ["guideAndroid", "guideIOS", "guideWin", "guideMac"];
  openSheet(el("h3", { text: t("guideTitle") }),
    el("p", { class: "notice", text: t("guideWeb") }),
    me ? el("div", { class: "card" }, el("h3", { text: t("guideNow") }), el("p", { text: t(me) })) : null,
    all.filter((k) => k !== me).map((k) => el("p", { class: "meta", text: t(k) })),
    el("p", { text: t("guideThen") }),
    el("div", { class: "row" },
      el("button", { class: "btn primary", text: "▶ " + t("voiceTest"), onclick: () => { closeSheet(); prime(); stopAudio(); setTimeout(() => speak(t("voiceSample"), S.ui, null, audioFail), 150); } }),
      el("button", { class: "btn", text: t("close"), onclick: closeSheet })));
}
function speak(text, lang, done, fail) {
  if (cloudOK()) return speakCloud(text, lang, done, (e) => { cloudBroken = true; toast(/fetch|network|load failed|r[ée]seau/i.test(String(e)) ? t("cloudBlocked") : t("cloudFail").replace("{e}", e), 8000); speak(text, lang, done, fail); });
  const cs = chunks(text);
  if (cs.length <= 1) return speak1(text, lang, done, fail);
  const t0 = A.tok; let i = 0;
  const nx = () => { if (t0 !== A.tok) return; if (i >= cs.length) return done && done(); speak1(cs[i++], lang, nx, fail); };
  nx();
}
function speak1(text, lang, done, fail) {
  if (useDevice(lang)) return speakDevice(text, lang, done, () => { deviceBroken = true; speakBuiltin(text, lang, done, fail); });
  speakBuiltin(text, lang, done, fail);
}
function speakDevice(text, lang, done, fail, retried) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = TTS[lang]; u.rate = S.rate;
  const v = retried ? null : voiceFor(lang);
  if (v) { u.voice = v; u.lang = v.lang; } u.pitch = 1; u.volume = 1;
  let started = false, finished = false;
  const dog = setTimeout(() => {
    if (started || finished) return;
    finished = true; try { speechSynthesis.cancel(); } catch (e) {}
    if (!retried) return speakDevice(text, lang, done, fail, true);
    if (fail) fail("timeout");
  }, 4000);
  u.onstart = () => { started = true; clearTimeout(dog); };
  u.onend = () => { finished = true; clearTimeout(dog); if (done) done(); };
  u.onerror = (e) => {
    clearTimeout(dog);
    if (e && (e.error === "canceled" || e.error === "interrupted")) { finished = true; return; }
    finished = true;
    if (!retried) return speakDevice(text, lang, done, fail, true);
    if (fail) fail((e && e.error) || "error"); else if (done) done();
  };
  try { speechSynthesis.resume(); speechSynthesis.speak(u); } catch (e) { clearTimeout(dog); if (fail) fail("error"); }
}
function setPlayIcon() { $("#audioBtn").textContent = A.on ? "❚❚" : "▶"; }
function markSpeaking(i) {
  document.querySelectorAll(".v.speaking").forEach((x) => x.classList.remove("speaking"));
  if (i < 0) return;
  const d = document.querySelector('.v[data-n="' + (i + 1) + '"]');
  if (d) { d.classList.add("speaking"); d.scrollIntoView({ block: "center", behavior: "smooth" }); }
}
function stopAudio() {
  A.tok++; A.on = false;
  if (TTSOK) { try { speechSynthesis.cancel(); } catch (e) {} }
  if (BS) { const n = BS; BS = null; try { n.onended = null; n.stop(); } catch (e) {} }
  if (CA) { const a = CA; CA = null; try { a.onended = null; a.pause(); } catch (e) {} }
  { const sb = $("#audioStatus"); if (sb) sb.hidden = true; }
  if (A.rec) { A.rec.pause(); A.rec = null; }
  markSpeaking(-1); setPlayIcon();
}
function audioFail() { stopAudio(); toast(t("voiceFail"), 7000); }
async function playChapter(start) {
  const bible = await loadBible(S.ver, S.book), vs = verses(bible, S.book, S.ch), lang = verInfo(S.ver).lang;
  if (!vs) return toast(t("noAudio"));
  if (!canSpeak() && !C.audioTemplate) return toast(t("noVoice"), 5000);
  stopAudio();
  const tok = ++A.tok; A.on = true; A.chap = S.book + "." + S.ch + "." + S.ver; setPlayIcon();
  const finished = () => {
    if (tok !== A.tok) return;
    A.on = false; A.idx = 0; markSpeaking(-1); setPlayIcon();
    if (S.autoNext && advance(1)) renderRead().then(() => playChapter(0));
  };
  const tts = () => {
    if (!canSpeak() && !cloudOK()) { A.on = false; setPlayIcon(); return toast(t("noVoice"), 5000); }
    let i = start || 0;
    const next = () => {
      if (tok !== A.tok) return;
      while (i < vs.length && !vs[i]) i++;
      if (i >= vs.length) return finished();
      A.idx = i; markSpeaking(i); const txt = vs[i++];
      speak(txt, lang, () => setTimeout(next, cloudOK() ? 250 : useDevice(lang) ? 0 : 380), () => { if (tok === A.tok) audioFail(); });
    };
    voicesReady().then(() => { if (tok === A.tok) engineInfo(lang); setTimeout(next, 150); });
  };
  if (C.audioTemplate && !start) {
    const url = C.audioTemplate.replace("{ver}", S.ver).replace("{book}", S.book).replace("{chapter}", S.ch);
    const au = new Audio(url); A.rec = au; au.playbackRate = S.rate;
    au.onended = finished; au.onerror = () => { A.rec = null; tts(); };
    au.play().catch(() => { A.rec = null; tts(); });
  } else tts();
}
function toggleAudio() {
  if (A.on) { const keep = A.idx; stopAudio(); A.idx = keep; return; }
  prime();
  const same = A.chap === S.book + "." + S.ch + "." + S.ver;
  playChapter(same ? A.idx : 0);
}

// ---------- recherche ----------
const ALIAS = { jn:43, mt:40, mc:41, mk:41, lc:42, lk:42, ac:44, rm:45, ro:45, ps:19, pr:20, ap:66, rev:66, gn:1, gen:1, ex:2, lv:3,
  nb:4, dt:5, jos:6, jg:7, is:23, jr:24, ez:26, dn:27, ml:39, ga:48, ep:49, ph:50, col:51, he:58, tt:56 };
const normBook = (s) => norm(s).replace(/[\s.\-]/g, "");
function parseRef(q) {
  const m = q.trim().match(/^((?:[1-3][\s.]*)?[^\d\s:.,][^\d:.,]*?)\s*(\d+)(?:\s*[:.,vV]\s*(\d+))?$/);
  if (!m) return null;
  const nb = normBook(m[1]); if (nb.length < 2) return null;
  let b = ALIAS[nb] || 0;
  if (!b) {
    const cand = B.map((bk, i) => ({ i: i + 1, ns: [1, 2, 3].map((k) => normBook(bk[k])) }));
    const hit = cand.find((c) => c.ns.indexOf(nb) >= 0) || cand.find((c) => c.ns.some((n) => n.startsWith(nb)));
    b = hit ? hit.i : 0;
  }
  if (!b) return null;
  const c = +m[2]; if (c < 1 || c > B[b - 1][0]) return null;
  return { b, c, v: m[3] ? +m[3] : 0 };
}
let stok = 0;
async function doSearch(q) {
  const out = $("#results"); out.replaceChildren();
  q = q.trim(); if (q.length < 2) return;
  const lang = verInfo(S.ver).lang, ref = parseRef(q);
  if (ref) out.append(el("div", { class: "card link", onclick: () => go(ref.b, ref.c, ref.v) },
    el("h3", { text: "→ " + bookName(ref.b, lang) + " " + ref.c + (ref.v ? ":" + ref.v : "") })));
  const info = el("p", { class: "meta", text: t("loading") }); out.append(info);
  const my = ++stok, scope = $("#scopeSel").value, nq = norm(q), hits = []; let capped = false, bad = false;
  for (let bn = 1; bn <= 66 && !capped; bn++) {
    if ((scope === "ot" && bn > 39) || (scope === "nt" && bn < 40)) continue;
    let d; try { d = await loadBook(S.ver, bn); } catch (e) { lastErr = (e && e.message) || String(e); bad = true; break; }
    if (my !== stok) return;
    if (bn % 8 === 0) info.textContent = t("loading") + " " + bn + "/66";
    for (const c in d) {
      d[c].forEach((txt, i) => {
        if (capped || !txt) return;
        const p = norm(txt).indexOf(nq);
        if (p >= 0) { hits.push({ b: bn, c: +c, v: i + 1, txt, p }); if (hits.length >= 200) capped = true; }
      });
      if (capped) break;
    }
  }
  if (my !== stok) return;
  info.remove();
  if (bad && !hits.length) return out.append(el("div", { class: "notice", text: missingMsg(verInfo(S.ver)) }));
  const total = hits.length;
  out.append(el("p", { class: "meta", text: (capped ? "200+" : total) + " " + t("results") }));
  if (!total) return ref ? null : out.append(el("p", { text: t("noResults") }));
  hits.forEach((h) => out.append(el("div", { class: "card link", onclick: () => go(h.b, h.c, h.v) },
    el("h3", { text: bookName(h.b, lang) + " " + h.c + ":" + h.v }),
    el("p", {}, h.txt.slice(0, h.p), el("mark", { text: h.txt.slice(h.p, h.p + q.length) }), h.txt.slice(h.p + q.length)))));
}

// ---------- plan de lecture ----------
const PLANS = { year: { days: 365, key: "planYear" }, nt90: { days: 90, key: "planNT" }, wis: { days: 30, key: "planWis" } };
function chapterList(id) {
  const out = [], add = (b) => { for (let c = 1; c <= B[b - 1][0]; c++) out.push([b, c]); };
  if (id === "year") for (let b = 1; b <= 66; b++) add(b);
  else if (id === "nt90") for (let b = 40; b <= 66; b++) add(b);
  else { add(19); add(20); }
  return out;
}
function dayChapters(id, d) {
  const L = chapterList(id), n = L.length, N = PLANS[id].days;
  return L.slice(Math.floor((d - 1) * n / N), Math.floor(d * n / N));
}
function renderPlan(box) {
  const p = S.plan, card = el("div", { class: "card" }, el("h3", { text: t("planTitle") }));
  if (!p) {
    card.append(el("p", { class: "meta", text: t("planDesc") }));
    Object.keys(PLANS).forEach((id) => card.append(el("div", { class: "row" },
      el("button", { class: "btn", text: t(PLANS[id].key), onclick: () => { S.plan = { id, done: {} }; save(); renderTeach(); } }))));
  } else {
    const N = PLANS[p.id].days, doneDays = Object.keys(p.done).map(Number).sort((a, b) => a - b);
    let d = 1; while (d <= N && p.done[d]) d++;
    const bar = el("div", { class: "bar" }, el("i")); bar.firstChild.style.width = (doneDays.length * 100 / N) + "%";
    card.append(el("p", { class: "meta", text: t(PLANS[p.id].key) + " · " + doneDays.length + "/" + N }), bar);
    if (d > N) card.append(el("p", { text: t("planFinished") }));
    else {
      card.append(el("p", { text: t("planDay") + " " + d + " " + t("planOf") + " " + N }),
        el("div", { class: "row" }, dayChapters(p.id, d).map(([b, c]) => el("button", { class: "btn", text: bookName(b, S.ui) + " " + c, onclick: () => go(b, c) }))),
        el("div", { class: "row" }, el("button", { class: "btn primary", text: t("planDone"), onclick: () => { p.done[d] = 1; save(); renderTeach(); } })));
    }
    card.append(el("div", { class: "row" },
      doneDays.length ? el("button", { class: "btn", text: t("planUndo"), onclick: () => { delete p.done[doneDays[doneDays.length - 1]]; save(); renderTeach(); } }) : null,
      el("button", { class: "btn", text: t("planRestart"), onclick: () => { S.plan = null; save(); renderTeach(); } })));
  }
  box.append(card);
}

// ---------- les livres de la Bible ----------
const BI = window.YESHUA_BOOKINFO || [];
function renderBooks(box) {
  box.append(el("h2", { class: "sec", text: t("booksTitle") }), el("p", { class: "hint", text: t("booksDesc") }));
  [[t("ot"), 0, 39], [t("nt"), 39, 66]].forEach(([title, a, b]) => {
    box.append(el("p", { class: "pstitle", text: title }), el("div", { class: "grid books" },
      B.slice(a, b).map((bk, i) => el("button", { text: bk[LI[S.ui]], onclick: () => openBookInfo(a + i + 1) }))));
  });
}
function openBookInfo(n) {
  const info = BI[n - 1], L = LI[S.ui] - 1, lang = S.ui;
  if (!info) return;
  const au = info[0], da = info[1], key2 = info[2], th = info[3], su = info[4], name = bookName(n, lang);
  const kv = el("div", {});
  loadBible(S.ver, n).then((bible) => {
    const vs = verses(bible, n, key2[0]), txt = vs && vs[key2[1] - 1];
    if (txt) kv.append(el("p", { class: "quote", text: txt }));
  });
  openSheet(
    el("h3", { text: name }),
    el("p", { class: "meta", text: th[L] + " · " + B[n - 1][0] + " " + t("chaptersN") }),
    el("p", { text: su[L] }),
    el("p", { class: "meta" }, el("b", { text: t("author") + " : " }), au[L]),
    el("p", { class: "meta" }, el("b", { text: t("date") + " : " }), da[L]),
    el("p", { class: "meta" }, el("b", { text: t("keyVerse") + " : " }), name + " " + key2[0] + ":" + key2[1] + " (" + verInfo(S.ver).short + ")"),
    kv,
    el("div", { class: "row" },
      el("button", { class: "btn primary", text: "📖 " + t("readBook"), onclick: () => { closeSheet(); go(n, 1); } }),
      el("button", { class: "btn", text: "▶ " + t("listen"), onclick: () => {
        prime(); stopAudio();
        if (!canSpeak()) return toast(t("noVoice"), 5000);
        const tok = ++A.tok;
        const txt = name + ". " + th[L] + ". " + su[L] + " " + t("author") + " : " + au[L] + ".";
        setTimeout(() => { if (tok === A.tok) speak(txt, lang, null, () => { if (tok === A.tok) audioFail(); }); }, 150);
      } }),
      el("button", { class: "btn", text: t("close"), onclick: () => { stopAudio(); closeSheet(); } })));
}

// ---------- repères bibliques ----------
const GROUPS = [
  [1, 5, ["Le Pentateuque (la Loi)", "The Pentateuch (the Law)", "Der Pentateuch (das Gesetz)"]],
  [6, 17, ["Livres historiques", "Historical books", "Geschichtsbücher"]],
  [18, 22, ["Poésie et sagesse", "Poetry and wisdom", "Poesie und Weisheit"]],
  [23, 27, ["Les grands prophètes", "The major prophets", "Die großen Propheten"]],
  [28, 39, ["Les petits prophètes", "The minor prophets", "Die kleinen Propheten"]],
  [40, 43, ["Les Évangiles", "The Gospels", "Die Evangelien"]],
  [44, 44, ["Les Actes des apôtres", "The Acts of the Apostles", "Die Apostelgeschichte"]],
  [45, 57, ["Les lettres de Paul", "The letters of Paul", "Die Briefe des Paulus"]],
  [58, 65, ["Les lettres générales", "The general letters", "Die allgemeinen Briefe"]],
  [66, 66, ["L'Apocalypse", "Revelation", "Die Offenbarung"]]
];
function renderStruct(box) {
  const lang = S.ui, k = LI[lang] - 1;
  const sum = (a, z) => B.slice(a - 1, z).reduce((x, y) => x + y[0], 0);
  box.append(el("h2", { class: "sec", text: t("structTitle") }));
  const card = el("div", { class: "card" },
    el("p", {}, el("b", { text: t("wTotal") + " : " }), "66 " + t("wBooks") + " · " + sum(1, 66) + " " + t("wChapters")),
    el("p", { class: "meta", text: t("wOT") + " : 39 " + t("wBooks") + " · " + sum(1, 39) + " " + t("wChapters") + "  |  " + t("wNT") + " : 27 " + t("wBooks") + " · " + sum(40, 66) + " " + t("wChapters") }));
  GROUPS.forEach(([a, z, names]) => {
    card.append(el("p", {}, el("b", { text: names[k] + " " }),
      el("span", { class: "meta", text: "(" + (z - a + 1) + " " + t("wBooks") + " · " + sum(a, z) + " " + t("wChapters") + ")" }), el("br"),
      el("span", { class: "meta", text: a === z ? bookName(a, lang) : bookName(a, lang) + " → " + bookName(z, lang) })));
  });
  box.append(card);
}

// ---------- enseignements ----------
function refLabel(ref, lang) {
  return bookName(ref[0], lang) + " " + ref[1] + (ref[2] ? ":" + ref[2] + (ref[3] && ref[3] !== ref[2] ? "-" + ref[3] : "") : "");
}
function passageOf(bible, ref) {
  const vs = verses(bible, ref[0], ref[1]); if (!vs) return [];
  const a = ref[2] || 1, z = ref[3] || a, out = [];
  for (let n = a; n <= z && n <= vs.length; n++) if (vs[n - 1]) out.push([n, vs[n - 1]]);
  return out;
}
function readAloud(txt, lang) {
  prime(); stopAudio();
  if (!canSpeak()) return toast(t("noVoice"), 5000);
  const tok = ++A.tok;
  voicesReady().then(() => { if (tok === A.tok) engineInfo(lang); });
  setTimeout(() => { if (tok === A.tok) speak(txt, lang, null, () => { if (tok === A.tok) audioFail(); }); }, 150);
}
function renderTeach() {
  const box = $("#teachBox"); box.replaceChildren(el("h2", { class: "sec", text: t("planTitle") }));
  renderPlan(box);
  renderBooks(box);
  renderStruct(box);
  box.append(el("h2", { class: "sec", text: t("teachTitle") }));
  T.forEach((x) => {
    const lang = S.ui;
    box.append(el("div", { class: "card link", onclick: () => openTeaching(x) },
      el("h3", { text: x.title[lang] }),
      el("p", { class: "meta", text: refLabel(x.ref, lang) }),
      el("p", { text: x.body[lang].slice(0, 110) + "…" })));
  });
}
async function openTeaching(x) {
  const lang = S.ui, ver = verInfo(S.ver), bible = await loadBible(S.ver, x.ref[0]), ps = passageOf(bible, x.ref);
  openSheet(el("h3", { text: x.title[lang] }),
    el("p", { class: "meta", text: refLabel(x.ref, lang) }),
    el("p", { class: "quote", text: x.body[lang] }),
    ps.length ? el("div", { class: "card" },
      el("h3", { text: t("passage") + " · " + refLabel(x.ref, ver.lang) + " (" + ver.short + ")" }),
      ps.map(([n, tx]) => el("p", {}, el("sup", { text: n + " ", style: "color:var(--gold);font-weight:600" }), tx))) : null,
    el("div", { class: "row" },
      el("button", { class: "btn primary", text: "▶ " + t("listen"), onclick: () => readAloud(x.title[lang] + ". " + x.body[lang], lang) }),
      ps.length ? el("button", { class: "btn", text: "▶ " + t("listenPassage"), onclick: () => readAloud(refLabel(x.ref, ver.lang) + ". " + ps.map((q) => q[1]).join(" "), ver.lang) }) : null,
      el("button", { class: "btn", text: "■ " + t("stop"), onclick: stopAudio })),
    el("div", { class: "row" },
      el("button", { class: "btn", text: "📖 " + t("readPassage"), onclick: () => { stopAudio(); closeSheet(); go(x.ref[0], x.ref[1], x.ref[2]); } }),
      el("button", { class: "btn", text: t("close"), onclick: () => { stopAudio(); closeSheet(); } })));
}

// ---------- mes versets ----------
async function renderSaved() {
  const box = $("#savedBox"); box.replaceChildren(el("h2", { class: "sec", text: t("saved") }));
  const keys = new Set([...Object.keys(S.fav), ...Object.keys(S.hl), ...Object.keys(S.notes)]);
  if (!keys.size) return box.append(el("p", { class: "notice", text: t("emptySaved") }));
  const bible = await loadBible(S.ver, [...new Set([...keys].map((k) => +k.split(".")[0]))]), lang = verInfo(S.ver).lang;
  [...keys].map((k) => k.split(".").map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]).forEach(([b, c, v]) => {
    const k = key(b, c, v), vs = verses(bible, b, c), txt = vs && vs[v - 1];
    box.append(el("div", { class: "card link", onclick: () => go(b, c, v) },
      el("h3", { text: (S.fav[k] ? "♥ " : "") + bookName(b, lang) + " " + c + ":" + v }),
      txt ? el("p", { class: "quote", text: txt }) : null,
      S.notes[k] ? el("p", { class: "meta", text: "✎ " + S.notes[k] }) : null));
  });
}

// ---------- réglages ----------
function renderSettings() {
  const box = $("#setBox"); box.replaceChildren(el("h2", { class: "sec", text: t("settings") }));
  const sel = (opts, cur, fn) => { const s = el("select", {}, opts.map(([v, l]) => el("option", { value: v, text: l }))); s.value = cur; s.onchange = () => fn(s.value); return s; };
  const fs = el("input", { type: "range", min: 15, max: 30, value: S.fs }); fs.oninput = () => { S.fs = +fs.value; save(); renderRead(); };
  const an = el("input", { type: "checkbox" }); an.checked = S.autoNext; an.onchange = () => { S.autoNext = an.checked; save(); };
  box.append(
    el("label", { class: "f" }, t("uiLang"), sel(Object.entries(LANGS), S.ui, (v) => { S.ui = v; save(); applyUI(); renderSettings(); })),
    el("label", { class: "f" }, t("theme"), sel([["auto", t("auto")], ["light", t("light")], ["dark", t("dark")], ["sepia", t("sepia")]], S.theme, (v) => { S.theme = v; save(); applyTheme(); })),
    el("label", { class: "f" }, t("fontSize"), fs),
    el("label", { class: "f" }, t("autoNext"), an),
    el("h2", { class: "sec", text: t("versions") }));
  Object.keys(LANGS).forEach((l) => {
    box.append(el("div", { class: "card" }, el("h3", { text: LANGS[l] }),
      V.filter((v) => v.lang === l).map((v) => el("p", { class: "meta", text:
        (avail[v.id] ? "✔ " : "○ ") + v.name + " — " + (v.pd ? t("pd") : t("rights")) + (v.verify ? " (" + t("verifyNote") + ")" : "") + (avail[v.id] ? "" : " · " + t("tNotInst")) }))));
  });
  refreshVoices();
  const cnt = (l) => voices.filter((v) => (v.lang || "").toLowerCase().startsWith(l)).length;
  const offCard = el("div", { class: "card" }, el("p", { class: "meta", text: t("offlineInfo") }));
  box.append(el("h2", { class: "sec", text: t("offline") }), offCard);
  renderOffline(offCard);
  box.append(
    el("h2", { class: "sec", text: t("audio") }),
    el("div", { class: "card" },
      ...Object.keys(LANGS).map((l) => { const list = voicesOf(l), cur = voiceFor(l);
        const s = el("select", {}, el("option", { value: "", text: t("voiceAuto") + (cur ? " — " + cur.name : "") }),
          list.map((v) => el("option", { value: v.name, text: v.name + (isFem(v) ? " ♀" : "") })));
        s.value = (S.voice && S.voice[l]) || ""; s.onchange = () => { S.voice = S.voice || {}; if (s.value) S.voice[l] = s.value; else delete S.voice[l]; save(); };
        return el("label", { class: "f" }, t("voiceFor") + " " + LANGS[l], s); }),
      el("label", { class: "f" }, t("engLabel"), sel([["auto", t("engAuto")], ["builtin", t("engBuiltin")]], S.eng, (v) => { S.eng = v; save(); })),
      el("label", { class: "f" }, t("bvLabel"), sel([["f", t("bvF")], ["m", t("bvM")]], S.bv, (v) => { S.bv = v; save(); $("#bvSel").value = v; })),
      (TTSOK && voices.length) ? null : el("p", { class: "notice", text: t("builtinNote") }),
      el("p", { class: "meta", text: t("voiceInfo") + " : FR " + cnt("fr") + " · EN " + cnt("en") + " · DE " + cnt("de") + (canSpeak() ? "" : " — " + t("noVoice")) }),
      el("div", { class: "row" }, el("button", { class: "btn", text: "▶ " + t("voiceTest"), onclick: () => {
        prime(); if (!canSpeak()) return toast(t("noVoice"), 5000); stopAudio();
        setTimeout(() => speak(t("voiceSample"), S.ui, null, audioFail), 150); } }),
        el("button", { class: "btn", text: t("guideBtn"), onclick: openVoiceGuide }))));
  const keyIn = el("input", { type: "password", id: "cloudKey", autocomplete: "off", placeholder: "sk-…", value: S.cloudKey || "" });
  keyIn.style.cssText = "max-width:55%;height:40px;border:1px solid var(--line);background:var(--card);border-radius:10px;padding:0 10px";
  const voiceSel = sel(["nova", "alloy", "shimmer", "echo", "fable", "onyx"].map((x) => [x, x]), S.cloudVoice || "nova", (v) => { S.cloudVoice = v; save(); });
  box.append(el("h2", { class: "sec", text: t("cloudTitle") }),
    el("div", { class: "card" }, EMBEDDED ? el("p", { class: "notice", text: t("cloudBlocked") }) : null, el("p", { class: "meta", text: t("cloudInfo") }),
      el("label", { class: "f" }, t("cloudKey"), keyIn),
      el("label", { class: "f" }, t("cloudVoice"), voiceSel),
      el("div", { class: "row" },
        el("button", { class: "btn primary", text: t("cloudSave"), onclick: () => {
          const k = keyIn.value.trim(); if (!k) return; S.cloudKey = k; cloudBroken = false; save(); toast(t("cloudSaved"), 2000);
          prime(); stopAudio(); setTimeout(() => speak(t("voiceSample"), S.ui, null, audioFail), 150); } }),
        S.cloudKey ? el("button", { class: "btn", text: t("cloudRemove"), onclick: () => { delete S.cloudKey; cloudBroken = false; save(); toast(t("cloudRemoved"), 2000); renderSettings(); } }) : null)));
  box.append(el("h2", { class: "sec", text: t("about") }),
    el("div", { class: "card" }, el("h3", { text: C.appName }), el("p", { text: t("createdBy") + " " + C.author })));
}


// ---------- hors ligne : interface ----------
async function renderOffline(card) {
  const st = await offlineStatus();
  if (!st) { card.append(el("p", { class: "notice", text: t("offNoCache") })); return; }
  const ids = V.filter((v) => avail[v.id]).map((v) => v.id), todo = ids.filter((i) => st[i] < 1);
  const bar = el("div", { class: "bar", hidden: "" }, el("i")), msg = el("p", { class: "meta" });
  const run = async (list) => {
    if (!list.length) return;
    bar.hidden = false; btnAll.disabled = true;
    const fails = await saveOffline(list, (d, n) => { bar.firstChild.style.width = (d * 100 / n) + "%"; msg.textContent = t("offSaving") + " " + Math.round(d * 100 / n) + " %"; });
    toast(fails ? t("offPartial") : t("offlineDone"), 3500); renderSettings();
  };
  const btnAll = el("button", { class: "btn primary", text: todo.length ? t("offlineBtn") + " (≈ " + Math.round(todo.length * 4.4) + " " + t("mb") + ")" : "✔ " + t("offlineDone"),
    onclick: () => run(todo) });
  if (!todo.length) btnAll.disabled = true;
  card.append(el("div", { class: "row" }, btnAll), bar, msg,
    ids.map((i) => el("p", { class: "meta" }, (st[i] >= 1 ? "✔ " : st[i] > 0 ? "◐ " : "○ ") + verInfo(i).name + " ",
      st[i] < 1 ? el("a", { href: "#", text: t("offSave"), onclick: (e) => { e.preventDefault(); run([i]); } }) : null)));
}
// Première visite : proposer d'enregistrer les textes pour lire sans Internet (et garder la version lue automatiquement)
async function offlineFirstRun() {
  if (!("caches" in window) || !navigator.onLine || location.protocol.indexOf("http") !== 0) return;
  try { const st = await offlineStatus(); if (!st) return;
    if (st[S.ver] < 1) saveOffline([S.ver]).catch(() => {});
    if (S.offAsked || Object.keys(st).every((i) => st[i] >= 1)) return;
    S.offAsked = 1; save();
    const n = Object.keys(st).filter((i) => st[i] < 1).length;
    openSheet(el("h3", { text: t("offlineAskT") }), el("p", { text: t("offlineAskB").replace("{n}", Math.round(n * 4.4)) }),
      el("div", { class: "row" },
        el("button", { class: "btn primary", text: t("offlineAskYes"), onclick: () => { closeSheet(); toast(t("offSaving"), 2500); saveOffline(V.filter((v) => avail[v.id]).map((v) => v.id)).then(() => { toast(t("offlineDone"), 3000); if (!$("#v-set").hidden) renderSettings(); }); } }),
        el("button", { class: "btn", text: t("offlineAskNo"), onclick: closeSheet })));
  } catch (e) {}
}

// ---------- thème / langue ----------
function applyTheme() {
  if (S.theme === "auto") document.body.removeAttribute("data-app-theme"); else document.body.setAttribute("data-app-theme", S.theme);
}
function buildVersionSelects() {
  const mk = (withNone) => {
    const frag = document.createDocumentFragment();
    if (withNone) frag.append(el("option", { value: "", text: t("cmpNone") }));
    Object.keys(LANGS).forEach((l) => frag.append(el("optgroup", { label: LANGS[l] },
      V.filter((v) => v.lang === l && avail[v.id] !== false).map((v) => el("option", { value: v.id, text: v.short })))));
    return frag;
  };
  const vs = $("#verSel"), cs = $("#cmpSel");
  vs.replaceChildren(mk(false)); vs.value = S.ver;
  cs.replaceChildren(mk(true)); cs.value = S.cmp;
}
function applyUI() {
  document.documentElement.lang = S.ui;
  document.querySelectorAll("[data-t]").forEach((n) => (n.textContent = t(n.dataset.t)));
  $("#q").placeholder = t("searchPh");
  const sc = $("#scopeSel"), cur = sc.value || "all";
  sc.replaceChildren(...[["all", "scopeAll"], ["ot", "scopeOT"], ["nt", "scopeNT"]].map(([v, k]) => el("option", { value: v, text: t(k) })));
  sc.value = cur;
  buildVersionSelects(); renderRead();
}

// ---------- démarrage ----------
async function probe() {
  try {
    const r = await fetch("data/bibles/index.json"); if (!r.ok) throw new Error("index"); const ids = await r.json();
    V.forEach((v) => (avail[v.id] = ids.indexOf(v.id) >= 0)); S.ids = ids; save();
  } catch (e) { const ids = S.ids; V.forEach((v) => (avail[v.id] = ids ? ids.indexOf(v.id) >= 0 : !!v.pd)); }
}
function init() {
  applyTheme();
  $("#nav").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(b.dataset.v); });
  $("#refBtn").onclick = openRef;
  $("#scrim").onclick = closeSheet;
  $("#verSel").onchange = (e) => { stopAudio(); S.ver = e.target.value; save(); renderRead(); };
  $("#cmpSel").onchange = (e) => { S.cmp = e.target.value; save(); renderRead(); };
  $("#bvSel").value = S.bv || "f";
  $("#bvSel").onchange = (e) => { S.bv = e.target.value; save(); };
  $("#rateSel").value = String(S.rate);
  $("#rateSel").onchange = (e) => { S.rate = +e.target.value; save(); if (A.rec) A.rec.playbackRate = S.rate; };
  $("#prevBtn").onclick = () => { stopAudio(); if (advance(-1)) renderRead(); window.scrollTo(0, 0); };
  $("#nextBtn").onclick = () => { stopAudio(); if (advance(1)) renderRead(); window.scrollTo(0, 0); };
  $("#audioBtn").onclick = toggleAudio;
  $("#stopBtn").onclick = () => { stopAudio(); A.idx = 0; };
  $("#text").addEventListener("click", (e) => { const v = e.target.closest(".v"); if (v) openVerse(+v.dataset.n); });
  $("#searchForm").onsubmit = (e) => { e.preventDefault(); doSearch($("#q").value); };
  if ("speechSynthesis" in window) speechSynthesis.getVoices();
  probe().then(() => {
    if (avail[S.ver] === false) { const alt = V.find((v) => v.lang === verInfo(S.ver).lang && avail[v.id]) || V.find((v) => avail[v.id]); if (alt) S.ver = alt.id; }
    if (S.cmp && avail[S.cmp] === false) S.cmp = "";
    save(); buildVersionSelects(); renderRead(); setTimeout(offlineFirstRun, 5000);
  });
  applyUI();
}
window.YAPI = { S, save, el, toast, B, LI, bookName, verInfo, loadBible, verses, speak, stopAudio, prime, canSpeak, voicesReady };
init();
})();
