// Plans de méditation : 4 thèmes × 7 jours. ref = [livre, chapitre, verset début, verset fin]; th = thème du jour [fr, en, de].
window.YESHUA_MEDITATION = {
  plans: [
    { id: "paix", name: ["La paix de Dieu", "The peace of God", "Der Friede Gottes"],
      desc: ["7 jours pour déposer l'inquiétude et recevoir la paix.", "7 days to lay down worry and receive peace.", "7 Tage, um Sorgen abzulegen und Frieden zu empfangen."],
      days: [
        { ref: [19, 23, 1, 6], th: ["Le Berger qui conduit", "The Shepherd who leads", "Der Hirte, der führt"] },
        { ref: [43, 14, 25, 27], th: ["Ma paix je vous donne", "My peace I give you", "Meinen Frieden gebe ich euch"] },
        { ref: [50, 4, 4, 9], th: ["Ne vous inquiétez de rien", "Do not be anxious", "Sorgt euch um nichts"] },
        { ref: [23, 26, 1, 4], th: ["Un cœur ferme, gardé en paix", "A steadfast mind in perfect peace", "Ein fester Sinn in Frieden"] },
        { ref: [40, 11, 28, 30], th: ["Venez à moi, je vous soulagerai", "Come to me and rest", "Kommt her zu mir, ich will euch erquicken"] },
        { ref: [51, 3, 12, 17], th: ["Que la paix du Christ règne", "Let the peace of Christ rule", "Der Friede Christi regiere"] },
        { ref: [4, 6, 22, 27], th: ["La bénédiction", "The blessing", "Der Segen"] }] },
    { id: "confiance", name: ["Confiance en Dieu", "Trusting God", "Gottvertrauen"],
      desc: ["7 jours pour s'appuyer sur la fidélité de Dieu.", "7 days to lean on God's faithfulness.", "7 Tage, um sich auf Gottes Treue zu stützen."],
      days: [
        { ref: [20, 3, 1, 8], th: ["Confie-toi de tout ton cœur", "Trust with all your heart", "Vertraue von ganzem Herzen"] },
        { ref: [19, 91, 1, 8], th: ["À l'abri du Très-Haut", "In the shelter of the Most High", "Im Schutz des Höchsten"] },
        { ref: [23, 41, 8, 13], th: ["Ne crains pas, je suis avec toi", "Fear not, I am with you", "Fürchte dich nicht, ich bin bei dir"] },
        { ref: [24, 17, 5, 8], th: ["L'arbre planté près de l'eau", "The tree by the water", "Der Baum am Wasser"] },
        { ref: [19, 46, 1, 11], th: ["Dieu, notre refuge", "God, our refuge", "Gott, unsere Zuflucht"] },
        { ref: [45, 8, 28, 39], th: ["Rien ne peut nous séparer de son amour", "Nothing can separate us from his love", "Nichts trennt uns von seiner Liebe"] },
        { ref: [58, 11, 1, 6], th: ["La foi", "Faith", "Der Glaube"] }] },
    { id: "louange", name: ["Louange et adoration", "Praise and worship", "Lob und Anbetung"],
      desc: ["7 jours pour entrer dans la louange.", "7 days to enter into praise.", "7 Tage, um ins Lob einzutreten."],
      days: [
        { ref: [19, 100, 1, 5], th: ["Entrez dans ses portes avec reconnaissance", "Enter his gates with thanksgiving", "Geht durch seine Tore mit Danken"] },
        { ref: [19, 103, 1, 14], th: ["Bénis l'Éternel, mon âme", "Bless the Lord, my soul", "Lobe den Herrn, meine Seele"] },
        { ref: [19, 145, 1, 13], th: ["Je t'exalterai, mon Dieu", "I will exalt you, my God", "Ich will dich erheben, mein Gott"] },
        { ref: [19, 150, 1, 6], th: ["Que tout ce qui respire loue l'Éternel", "Let everything that breathes praise the Lord", "Alles, was Odem hat, lobe den Herrn"] },
        { ref: [66, 4, 8, 11], th: ["Saint, saint, saint", "Holy, holy, holy", "Heilig, heilig, heilig"] },
        { ref: [19, 34, 1, 9], th: ["Goûtez et voyez combien l'Éternel est bon", "Taste and see that the Lord is good", "Schmeckt und seht, wie freundlich der Herr ist"] },
        { ref: [49, 5, 15, 20], th: ["Chantez de tout votre cœur", "Sing from your heart", "Singt von Herzen"] }] },
    { id: "esperance", name: ["Espérance", "Hope", "Hoffnung"],
      desc: ["7 jours pour relever le regard vers l'espérance.", "7 days to lift your eyes to hope.", "7 Tage, um den Blick zur Hoffnung zu heben."],
      days: [
        { ref: [45, 15, 4, 13], th: ["Le Dieu de l'espérance", "The God of hope", "Der Gott der Hoffnung"] },
        { ref: [25, 3, 21, 26], th: ["Ses bontés se renouvellent chaque matin", "His mercies are new every morning", "Seine Güte ist jeden Morgen neu"] },
        { ref: [19, 42, 1, 11], th: ["Mon âme, pourquoi t'abattre ?", "Why are you downcast, my soul?", "Was betrübst du dich, meine Seele?"] },
        { ref: [23, 40, 28, 31], th: ["Ils prendront un nouvel essor", "They will soar on wings", "Sie bekommen neue Kraft"] },
        { ref: [60, 1, 3, 9], th: ["Une espérance vivante", "A living hope", "Eine lebendige Hoffnung"] },
        { ref: [45, 5, 1, 5], th: ["L'espérance ne trompe point", "Hope does not disappoint", "Die Hoffnung lässt nicht zuschanden werden"] },
        { ref: [66, 21, 1, 7], th: ["Toutes choses nouvelles", "All things new", "Alles neu"] }] }
  ],
  // Questions de réflexion (tournent selon les jours)
  questions: [
    ["Quel mot ou quelle phrase m'a touché ? Je la répète lentement.", "Which word or phrase touched me? I repeat it slowly.", "Welches Wort oder welcher Satz hat mich berührt? Ich wiederhole ihn langsam."],
    ["Que me dit ce texte sur qui est Dieu ?", "What does this text tell me about who God is?", "Was sagt mir dieser Text darüber, wer Gott ist?"],
    ["Qu'est-ce que Dieu me demande de laisser entre ses mains aujourd'hui ?", "What is God asking me to place in his hands today?", "Was soll ich heute in Gottes Hände legen?"],
    ["Pour quoi puis-je dire merci en ce moment ?", "What can I thank God for right now?", "Wofür kann ich jetzt danken?"],
    ["Quel pas simple puis-je faire aujourd'hui pour vivre ce texte ?", "What simple step can I take today to live this text?", "Welchen einfachen Schritt kann ich heute gehen, um diesen Text zu leben?"],
    ["Qui puis-je encourager ou bénir avec cette parole ?", "Whom can I encourage or bless with this word?", "Wen kann ich mit diesem Wort ermutigen oder segnen?"],
    ["Je me tais et j'écoute. Dieu me parle-t-il dans le silence ?", "I am quiet and listen. Is God speaking in the silence?", "Ich schweige und höre. Spricht Gott in der Stille zu mir?"]
  ],
  breathe: ["Installez-vous. Respirez lentement, par le nez… et relâchez.", "Settle in. Breathe slowly through your nose… and let go.", "Setzen Sie sich bequem hin. Atmen Sie langsam ein… und lassen Sie los."],
  listen: ["Écoutez la Parole.", "Listen to the Word.", "Hören Sie das Wort."],
  silence: ["Moment de silence. Méditez.", "A moment of silence. Meditate.", "Ein Moment der Stille. Meditieren Sie."],
  prayer: [
    "Seigneur, merci pour ta Parole. Grave-la dans mon cœur, conduis mes pas et garde-moi dans ta paix. Au nom de Jésus. Amen.",
    "Lord, thank you for your Word. Write it on my heart, guide my steps and keep me in your peace. In Jesus' name. Amen.",
    "Herr, danke für dein Wort. Schreibe es in mein Herz, leite meine Schritte und bewahre mich in deinem Frieden. In Jesu Namen. Amen."]
};
