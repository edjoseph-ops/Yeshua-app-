// Configuration personnelle de l'application Yeshua
window.YESHUA_CONFIG = {
  appName: "Yeshua",
  author: "Votre nom",              // <- remplacez par votre nom (affiché dans « À propos »)
  // Audio enregistré (optionnel). Exemple : "audio/{ver}/{book}/{chapter}.mp3"
  // Si défini et si le fichier existe, il est lu à la place de la voix de synthèse.
  audioTemplate: null,
  // Voix en ligne, très naturelle (optionnelle, payante chez le fournisseur). Exemple avec OpenAI :
  //   cloud: { url: "https://api.openai.com/v1/audio/speech", key: "VOTRE_CLE", model: "gpt-4o-mini-tts",
  //            voice: "alloy", voices: { fr: "alloy", en: "alloy", de: "alloy" } }
  // Attention : la clé est visible par quiconque ouvre le site. À réserver à un usage personnel.
  cloud: null
};
