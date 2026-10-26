# Yeshua — application biblique

Application web installable (PWA) : téléphone, tablette, ordinateur. **Fonctionne sans Internet** : au premier lancement l'application propose d'enregistrer toutes les versions sur l'appareil (≈ 70 Mo, mieux en Wi-Fi) ; ensuite lecture, recherche, méditation et voix intégrée marchent sans connexion (Réglages → Utilisation hors ligne).

## Contenu
**17 Bibles complètes (66 livres, Genèse → Apocalypse, ≈ 31 100 versets chacune)**

| Langue | Versions incluses |
|---|---|
| Français | Louis Segond 1910 · Ostervald · Martin 1744 · Darby · Bovet-Bonnet 1900 · Perret-Gentil et Rilliet |
| English | King James · World English Bible (NHEB) · American Standard · Young's Literal · Webster 1833 · Rotherham · Geneva 1599 |
| Deutsch | Luther 1912 · Luther 1545 · Elberfelder 1905 · Elberfelder 1871 |

**Fonctions :** changement de version en un geste · comparaison de deux versions · recherche · audio chapitre par chapitre (voix de l'appareil, vitesse réglable, enchaînement automatique) · plan de lecture (Bible en 1 an, Nouveau Testament en 90 jours, Psaumes et Proverbes en 30 jours) · **présentation des 66 livres** (auteur, époque, thème, résumé, verset clé, lecture audio) · 12 enseignements avec passage biblique et audio · saut direct à une référence (ex. « Jean 3:16 ») · favoris, surlignage, notes · thèmes clair/sombre/sépia · interface FR/EN/DE.

## Versions non incluses (droits d'auteur)
*La Bible du Semeur* (Biblica) et *Parole de Vie* (Alliance biblique française) sont protégées : elles ne sont **pas** fournies. Pour les ajouter, obtenez une licence auprès de l'éditeur, puis importez le texte (ci-dessous). Les entrées existent déjà dans le catalogue (`data/versions.js`) et s'activent d'elles-mêmes dès que `data/bibles/BDS/` ou `PDV/` existe et que l'ID figure dans `index.json`.

## À vérifier avant une publication publique
- **Ostervald** : la source indique « statut inconnu ». Le texte d'Ostervald (XVIIIe–XIXe siècle) est ancien, mais cette édition numérique n'est pas documentée : vérifiez-la, ou retirez `OST` du catalogue.
- Les textes proviennent de dépôts publics (scrollmapper/bible_databases, Beblia/Holy-Bible-XML-Format). Contrôlez la mention de droits de chaque fichier si vous diffusez largement.
- Dans certaines versions (Darby, Luther), Malachie 4 est fusionné dans Malachie 3 : l'application l'indique.

## Méditer
Onglet **Méditer** : séance guidée (respiration, lecture à voix haute avec musique douce, silence et question de réflexion, prière).
- **4 plans de 7 jours** : La paix de Dieu, Confiance, Louange, Espérance.
- **Méditer la Bible en entier** : un chapitre à la fois, de la Genèse à l'Apocalypse ; l'application retient où vous en êtes.
- **Sons de méditation seuls** (5 à 30 min).
- **Musique** : 4 ambiances composées par l'application, libres de droits et sans Internet (louange douce gospel, orgue de prière, piano doux, pluie). Les instrumentaux d'artistes trouvés sur Google/YouTube sont protégés : ils ne peuvent pas être fournis avec l'application. Chacun peut toutefois **ajouter ses propres fichiers audio** (« Ajouter une musique ») : ils restent sur l'appareil et jouent en boucle sous la lecture.

## Mémoire et rapidité
Chaque Bible est découpée en un fichier par livre (`data/bibles/ID/N.json`) : seul le livre lu est en mémoire (≈ 3 Mo au lieu de ≈ 14 Mo pour trois versions). La recherche lit livre par livre et s'arrête à 200 résultats. `tools/import_bible.py` produit directement ce format ; `tools/split_bibles.py` convertit d'anciens fichiers `ID.json`.

## Audio
L'application affiche, au-dessus du texte, **quelle voix est en train de lire**. Trois moteurs, dans cet ordre :
1. **Voix en ligne** (optionnelle, la plus humaine) : dans **Réglages → Voix en ligne**, collez votre clé OpenAI et choisissez une voix. Service payant à l'usage chez le fournisseur ; la clé reste sur l'appareil. Il faut Internet, et cela ne marche pas dans un aperçu intégré (ouvrez le site dans Chrome ou Safari). Testée ici avec un serveur de simulation, pas avec le vrai service. Pour un usage partagé, voir `cloud` dans `config.js`.
2. **Voix de l'appareil** : l'application choisit en priorité les voix « naturelles », « neurales » ou « haute qualité », sans déformer le ton, et lit par phrases courtes. Vous pouvez choisir la voix pour chaque langue (Réglages → Audio).
3. **Voix intégrée Yeshua** (`voice.js`) : synthèse faite dans l'application, qui marche partout et hors ligne. Intelligible, mais clairement synthétique : c'est la voix de secours quand l'appareil ne fournit aucune voix (fréquent dans une fenêtre intégrée d'une autre application). Un bandeau le signale et le bouton **Améliorer la voix** donne les étapes pour installer une voix naturelle.

Pour une voix humaine sans service payant : installez une voix « naturelle » dans les réglages du téléphone (Android : Synthèse vocale, voix Google ; iPhone : Accessibilité > Contenu énoncé > Voix, voix « Améliorée » ou « Premium » ; Windows/Edge : voix « Natural »). Ou enregistrez les chapitres en MP3 et renseignez `audioTemplate`.

## Enseignements
12 méditations (FR/EN/DE) avec leur passage biblique affiché et lu dans la version choisie, plan de lecture, fiches des 66 livres (auteur, époque, thème, résumé, verset clé) et repères sur la structure de la Bible.

## Personnaliser
- Votre nom : `config.js` → `author`
- Catalogue des versions : `data/versions.js`
- Ajouter une version : `python3 tools/import_bible.py ID fichier.(json|xml|csv)` (crée `data/bibles/ID/…` et met à jour `data/bibles/index.json`)

## Tester en local
```
cd app
python3 -m http.server 8000
```
puis http://localhost:8000

## Publier
Déposez le dossier `app` sur un hébergement statique (Netlify, GitHub Pages, Cloudflare Pages) : l'adresse s'ouvre sur tout appareil, et « Ajouter à l'écran d'accueil » / « Installer l'application » la transforme en application. Pour Google Play / App Store : PWABuilder.com ou Capacitor.
