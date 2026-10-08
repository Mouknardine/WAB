> **Historique — ne décrit plus le site actuel.** Passe de finition du 03.10.2026, faite sur une version antérieure (bouton de verre rose `glass-btn.css`, oiseaux, autocollant unique, complication de l'horloge) qui n'existe plus. Le site en ligne depuis le 08.10.2026 est décrit dans `DESIGN-SYSTEM.md` et `OS-COMPONENTS.md`. Restent valables : les trois durées `--dur-1/2/3`, l'anneau de focus de 2 px, la lumière unique venant du haut, le refus du curseur personnalisé et de la réfraction réelle. Le son, écarté ici, a été ajouté depuis (bruit de clavier, `js/os/keysound.js`). La proposition de police Geist a été rejetée.

# WAB OS — finition « plus pro, plus singulière »

Passe du 03.10.2026. Demande d'Eliott : garder la structure, les espacements et la mise en page, et élever la finition.

## Méthode

- **Sites de référence, mesurés en direct.** 15 sites premium chargés dans un navigateur, styles calculés relevés (taille, interlettrage, graisse, ombres, rayons, sélection) : Linear, Vercel, Raycast, Resend, Clerk, Mercury, Granola, Teenage Engineering, Nothing, Rauno, Family, Framer, Stripe, Apple macOS, Arc. Captures : `scratchpad/shots/ref-*.png`.
- **Mobbin.** L'outil Mobbin n'était pas disponible dans cette session. Je me suis appuyé sur les 17 sections Mobbin relevées le même jour pour les pages Services et Work (`scratchpad/research-mobbin.md`), et sur la mesure directe des sites ci-dessus, qui donne des valeurs exactes plutôt qu'une capture.
- **21st.dev** (CLI `21st`, identifiants ci-dessous : `21st get <id>`). 11 recherches (liquid glass button, premium navbar, mac window, dock, command palette, faq accordion, pricing card, footer, custom cursor, noise grain, icon set), lecture du code de 9 composants et de la liste « cool » d'Eliott (29 éléments).

## Références et règles tirées

| Référence | Ce qu'elle fait mieux que nous | Règle retenue |
|---|---|---|
| [Linear](https://linear.app) | Boutons de 32 px dont l'ombre tient en 5 couches de 1 à 8 % d'opacité : on ne voit aucune ombre, seulement un objet posé. | Ombres en 4 couches (contact 1 px à 4 %, puis 2/8/20 px), aucune au-delà de 10 % : `--glass-shadow`. |
| [Vercel](https://vercel.com) | Titres de 64 px à −0,06 em, texte secondaire en Geist Mono gris. Le mono y est le signe « technique ». | Interlettrage optique qui se resserre avec la taille : `calc(0.8px − 0.065em)` (−0,02 em à 18 px, −0,045 em à 40 px, −0,06 em à 160 px). |
| [Raycast](https://www.raycast.com) | Bouton : anneau sombre de 2 px, liseré intérieur blanc de 1 px en haut, ombre interne de 1 px en bas, lueur de 14 px. Nettement « matériel ». | Un seul liseré de 1 px (`--hair`), reflet blanc en haut et pénombre de 1 px en bas, au lieu du double liseré flouté. |
| 21st — Apple Tahoe Liquid Glass Button (jahed, id 12460) | 8 ombres internes orientées par une source de lumière unique ; appui à `scale(0.96)` sur ressort `(0.4, 1.5, 0.3, 1)` en 400 ms. | Lumière unique venant du haut à gauche (reflet, icônes, liseré des fenêtres) ; appui à 0,97 en 150 ms, retour sur ressort en 400 ms. La réfraction par carte de déplacement est écartée : coûteuse, et peu fiable sur Safari. |
| 21st — Accordion (ddoemonn, id 23530) | Durées tenues : 150 ms pour un survol, 180 ms pour ouvrir, 140 ms pour fermer ; ombre `0 1px 2px / 6 %` + `0 4px 10px −8px / 45 %`. | Trois durées pour tout le site : 150, 250 et 400 ms (`--dur-1`, `--dur-2`, `--dur-3`), substituées dans toutes les feuilles partagées. |
| 21st — Dock (ibelick, id 990) | Ressort doux (masse 0,1, raideur 150, amortissement 12) et étiquettes de 12 px en pilule. | Le ressort du site passe d'environ 6 % à 3 % de rebond (`--ease-spring`). |
| 21st — Dot Pattern (dillionverma, id 1537), liste « cool » | Trame 16 px, point de 1 px. | Trame conservée, gris neutre en OKLCH ; un grain fractal à 3,5 % ajouté dessous. |
| [Clerk](https://clerk.com) | Fond clair tramé très finement, texte gris à 6:1, hiérarchie portée par le gris plus que par la taille. | Gris de texte gardés à 6,4:1 et 5,5:1 ; aucune troisième nuance. |
| [Resend](https://resend.com) | Sélection de texte en blanc à 20 %, discrète ; ombres à 10 % maximum. | Sélection rose `--mark` conservée (déjà juste), barre de défilement fine et neutre. |
| [Family](https://family.co) | Mascottes et objets colorés, mais une seule logique d'illustration : tout vient de la même main. | Oiseaux en palette resserrée (rose, porcelaine, rose poudré), avec une règle stricte : posé = rose (alterné avec le rose poudré quand ils sont plusieurs), en vol = pâle. |
| [Teenage Engineering](https://teenage.engineering) | Le produit traité comme un instrument : petites pièces techniques, précises, jamais décoratives. | La complication de Lausanne : un cadran de montre de 16 px devant l'heure. |
| [Apple macOS](https://www.apple.com/macos/) | Icônes d'app éclairées toutes du même côté, liseré qui s'éteint vers le bas. | Icônes régénérées : dégradé en diagonale, reflet en haut à gauche, liseré blanc dégradé, bord sombre renforcé en bas à droite, pictogramme en léger relief. |
| [Mobbin — Linear, chapitres numérotés](https://mobbin.com/sites/sections/11fa0cf7-8a9c-41f1-b38f-66918fac01f4) | Le mono porte la numérotation et les repères, jamais l'ornement. | Petites capitales espacées (+0,08 em, `--track-caps`) réservées aux badges et repères. |
| [Mobbin — Ditto, pied de page](https://mobbin.com/sites/sections/5a66fc44-ead0-4f5e-a49c-4f2288565a98) | Un seul geste typographique géant, en fin de page. | Le « WAB. » en pixels reste le seul grand geste ; rien d'autre n'est agrandi. |

**Constat transversal.** Les 15 sites premium mesurés composent tous leur texte courant en grotesque. Le mono, quand il existe (Vercel, Raycast), sert aux repères. D'où la proposition de police ci-dessous, **non appliquée**.

## Proposition de police (à décider par Eliott)

Garder Sligoil pour les titres, les boutons, la barre, les noms de fichiers et les repères. Composer seulement le texte courant (paragraphes, listes) en **Geist** (SIL OFL, gratuite, celle de Vercel), à −0,011 em. Gain : lecture plus rapide des longs paragraphes, et un contraste mono/grotesque qui fait « studio d'interface ». Risque : on perd un peu du caractère « tout en Sligoil » choisi par Eliott.
Capture avant/après : `scratchpad/shots/pro-font-compare.png`.

## Changements appliqués, par priorité

1. **Matières et jetons** (`os-tokens.css`) : toute la palette en OKLCH ; ombres en couches ; flou du verre ramené de 24 à 16 px ; grain fin sous la trame ; un seul liseré de 1 px ; trois durées.
2. **Bouton de verre** (`glass-btn.css`) : rose moins saturé (chroma 0,04 → 0,09, presque opaque, encre à 11,9:1), reflet en dégradé radial au lieu d'un dôme, caustique au bas de la coque, appui net (0,97, ombre resserrée, reflet éteint), plus de grossissement au survol. Bouton secondaire en verre neutre.
3. **Typographie** (`os-base.css`) : interlettrage optique unique pour tous les h1-h3, titres équilibrés (`text-wrap: balance`), lissage des glyphes. Sligoil est à chasse fixe : les chiffres de l'horloge sont déjà alignés.
4. **Icônes** : app-*.svg régénérées avec une lumière commune venant du haut à gauche ; Contact devient la seule squircle rose ; dossier et terminal recalés sur la même boîte optique que les autres symboles.
5. **Gadgets maîtrisés** : kaomoji ramenés de 8 à 2 (accueil, 404) ; une seule version de l'autocollant, imprimée (encre rose, grain, reflet de vinyle, ombre d'objet), là où il y en avait trois ; oiseaux en vol de 2 à 3 au lieu de 2 à 4, palette resserrée.
6. **Micro-détails** : anneau de focus de 2 px décollé de 2 px, barre de défilement fine, survol de la recherche adouci, liseré de verre posé sur les captures des fenêtres.
7. **Signatures** : la complication de Lausanne (cadran devant l'heure) ; l'ombre d'un oiseau qui passe sur le bureau toutes les une à deux minutes (ordinateur, jamais sous mouvement réduit) ; la règle des oiseaux, posés en rose et en vol pâles comme des mouettes du Léman.
8. **Corrections** : bande blanche de 12 px à droite de la photo dans la fiche projet au téléphone (ratio 4:5 combiné à une hauteur plafonnée) ; dock ajouté sur About.

## Écarté

- Curseur personnalisé : il gêne plus qu'il ne signe, même sur le bureau seul.
- Son : exclu.
- Réfraction réelle par SVG/WebGL : trop coûteuse pour un gain invisible à la taille d'un bouton.
