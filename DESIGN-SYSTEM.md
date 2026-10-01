# WAB. — Design système

Version 1 — 1er octobre 2026. Branche `refonte-studio`, appliquée à l'accueil et au socle commun (barre, boutons, jetons). Les autres pages suivront une fois l'accueil validé.

---

## 1. Intention

**Des plaques de verre sur un ciel vivant.**

Le studio garde ce qui le rend reconnaissable — le fond animé en roses vifs, le grain, les oiseaux en pixel art, la police Sligoil — et y ajoute ce qui manquait pour être lu comme un grand studio : une règle unique de mise en page. Tout contenu vit dans une **plaque** de verre dépoli posée sur le ciel ; entre deux plaques, le ciel respire et les oiseaux passent. À l'intérieur d'une plaque, rien ne flotte : des grilles régulières, des filets d'un pixel, des colonnes égales.

Ce qui rend la direction originale : le contraste entre un décor vivant et ludique (le ciel, les oiseaux, la chasse fixe) et une mise en page d'une rigueur à la Apple. Le décor dit « studio de création », la grille dit « on peut nous confier un budget ». Aucun studio ne combine ces deux registres de cette façon, et rien de tout cela n'est neutre ni beige.

Ce qui est écarté, et pourquoi :
- le papier uni et immobile, les cartes blanches, les grands titres seuls (rejetés deux fois) ;
- les repères et filets au-dessus des titres, l'en-tête titre/phrase en deux colonnes (rejetés) ;
- les chiffres en exposant, les projets en très grand à tailles alternées, les ornements (rejetés).

---

## 2. Références retenues

**SiteInspire** (catégories [Agencies & consultancies](https://www.siteinspire.com/websites/category/agencies-and-consultancies) et [Design & art direction](https://www.siteinspire.com/websites/category/design-and-art-direction))

| Site | Ce qu'on en garde |
|---|---|
| [Pentagram — About](https://www.pentagram.com/about) | L'argument dit comme une structure : ceux qui possèdent le studio font le travail et sont l'interlocuteur. C'est la phrase du bloc « studio ». |
| [Ragged Edge](https://www.raggededge.com/) | Le client comme sujet de la phrase ; un appel final en question courte. |
| [Koto](https://koto.com/) | Titres très courts, puis un paragraphe qui explique ; le lieu comme preuve. |
| [Quatrième Étage](https://quatriemeetage.studio/) | Un duo présenté sobrement : qui, quoi, comment ils travaillent ensemble. |
| [Studio OL](https://ol.studio/) | Le ton : la décision avant l'effet, « une sensibilité plutôt qu'un style ». |
| [Studio Dumbar](https://studiodumbar.com/), [Order](https://order.design/) | Le travail parle seul : le nom du projet suffit sous l'image. |
| [Locomotive](https://locomotive.ca/en), [basement.studio](https://basement.studio/) | Livrables nommés par métier ; contre-exemple de ton (trop familier). |
| [Instrument](https://www.instrument.com/), [Little Plains](https://littleplains.com/) | Contre-exemples : accroche générique, jargon. |

**Mobbin** (plateforme web, sections)

| Référence | Ce qu'on en garde |
|---|---|
| [Linear — navigation](https://mobbin.com/sites/sections/192414ab-334b-4a7f-a278-1d4cf5bdc095) | Liens petits et espacés, un seul bouton plein à droite. |
| [T1 Energy — navigation](https://mobbin.com/sites/sections/08b1da0a-e784-4a8c-8d23-0359ff00b023) | Le bouton Contact emboîté dans la plaque de navigation. |
| [Pentagram — projets](https://mobbin.com/sites/sections/933958ee-3d23-4692-bcb7-650e850a84ee) | Colonnes égales, même format d'image, le nom dessous. |
| [Raw Materials — services](https://mobbin.com/sites/sections/67c9761c-a201-45f1-910a-ca8faa50cb33) | Trois colonnes égales, listes sous filets, cadre arrondi. |
| [Analogue — services](https://mobbin.com/sites/sections/7063e124-d7b5-4fe4-9797-b318a5be20d1) | Filet vertical entre colonnes. |
| [Unseen Studio — accueil](https://mobbin.com/sites/sections/1bdc4e01-2f7e-4e09-9aa1-27f02c13bcbe) | Un univers rose peut rester haut de gamme si la typographie est sobre et l'action unique. |
| [Fiasco — appel final](https://mobbin.com/sites/sections/755f3c1e-059d-4997-82bd-dfb55cd761bf) | Une phrase, un seul bouton pilule. |
| [Until — pied de page](https://mobbin.com/sites/sections/a816108f-6370-41d7-be86-8905784daf1c) | L'email en grand, le reste sur une ligne. |

**21st.dev**

| Composant | Ce qu'on en garde |
|---|---|
| [Project Card — ravikatiyar162](https://21st.dev/@ravikatiyar162/components/project-card) | Le zoom de l'image au survol, ramené de 1.1 à 1.03, sans montée de carte. |
| [Interactive Hover Button — dillionverma](https://21st.dev/@dillionverma/components/interactive-hover-button) | Écarté : trop démonstratif. On garde seulement l'idée d'une flèche qui avance. |
| [Expanding Arrow Button — starc007](https://21st.dev/@starc007/components/expanding-arrow-button) | Même réponse au survol qu'au focus clavier. |
| Jeux d'icônes ([shadcn](https://21st.dev/@shadcn/components/icons), [Codehagen](https://21st.dev/@Codehagen/components/icons), [Icon Set](https://21st.dev/@ravikatiyar162/components/icon-set), [Lucide Icon Drawer](https://21st.dev/@oldkong88/components/lucide-icon-drawer)) | Aucun n'est exploitable sans React : ce sont des logos de marques, ou des grilles qui chargent Lucide en interne. D'où le choix de Lucide à la source (§ 7). |

---

## 3. Jetons

Tous dans `css/base.css`, bloc `:root`. Aucune valeur en dur ailleurs pour une couleur, un rayon ou une durée.

### Couleur

| Jeton | Valeur | Rôle |
|---|---|---|
| `--ink` | `#0b0b0c` | Texte, boutons pleins. |
| `--ink-soft` / `--ink-muted` | `#18181c` / `#202026` sur le fond animé | Paragraphes / texte secondaire. |
| `--line` / `--line-strong` | encre à 14 % / 30 % | Filets / contours de boutons, soulignés. |
| `--pink` | `#ff2d9b` | Signal seulement : point « au studio », pastilles. Jamais du petit texte. |
| `--pink-deep` | `#a00f5a` | Le rose qui porte du texte sur le verre clair (4,9:1 au pire). |
| `--pink-soft` | `#ff8cc6` | Le rose lisible sur la surface encre (8,8:1). |
| `--accent` | `--pink-deep`, ou `--pink-soft` en surface encre | Ce que les composants demandent. |
| `--on-ink` | blanc, ou encre en surface encre | Texte posé sur un aplat d'encre. |

**Quota de l'accent** : le rose ne sert qu'au survol des liens, aux icônes des faits de la plaque encre et au point « au studio ». Le fond animé est déjà rose : un accent de plus partout cesserait de signaler quoi que ce soit.

### Surfaces qui s'inversent

`.surface-ink` redéfinit `--ink`, `--ink-soft`, `--ink-muted`, `--line`, `--line-strong`, `--accent`, `--on-ink`, `--ink-hover` et `--plate-bg` pour elle et ses enfants. Un composant n'a jamais à connaître la couleur de son fond.

Paires vérifiées qui deviendraient invisibles sans ce mécanisme : bouton plein (encre sur encre → blanc sur encre), bouton fantôme (contour), lien fléché (souligné), icône, filet, focus (contour encre → blanc).

### Typographie

Une seule famille : **Sligoil** (Micro 400, Medium 500, Bold 700), chasse fixe, choisie par Eliott. Pas de faux gras : les trois graisses sont de vrais fichiers. Chasse fixe = 15 % plus large qu'une grotesque : les titres restent mesurés.

| Jeton | Taille | Usage |
|---|---|---|
| `--text-xs` | 12 px | Rôles, adresse dans la fenêtre. |
| `--text-sm` | 14 px | Liens fléchés, listes de livrables, pied de page. |
| `--text-md` | 16 px | Texte courant, noms de projets. |
| `--text-lg` | 17–19 px | Introductions de section. |
| `--text-xl` | 23–35 px | Titres de section (H2). |
| `--text-2xl` | 30–58 px | Titre de la plaque encre. Le H1 de l'ouverture a sa propre borne (28–48 px). |

Interlignage : 1.12–1.18 pour les titres (en dessous, cédilles et accents se touchent), 1.6 pour le texte. Approche : −0.02 à −0.04 em sur les titres.

### Espacements

Base 4 px : `--space-1` 4, `--space-2` 8, `--space-3` 12, `--space-4` 16, `--space-5` 24, `--space-6` 32–48, `--space-7` 48–96. Écart entre plaques `--plate-gap` 20–40 px ; marge intérieure `--plate-pad` 20–48 px.

### Rayons

`--radius-sm` 8 (vignettes, contrôles intérieurs), `--radius-md` 12 (barre, fenêtres), `--radius-lg` 18 (plaques), `--radius-pill` (boutons). Un rayon intérieur est toujours plus petit que celui qui l'entoure.

### Verre et ombres

`--plate-bg` blanc à 66 %, `--plate-blur` flou 22 px. Liseré `--edge` + reflet d'arête `--edge-sheen` + ombre `--shadow-lg`. Le flou n'est posé que sur les plaques, la barre et la fenêtre de contact : ailleurs il coûterait du calcul pour rien.

### Mouvement

Courbes : `--ease` (entrée, ressort doux), `--ease-out` (réponse au geste). Durées : `--dur-1` 0,2 s (couleur), `--dur-2` 0,35 s (flèche, souligné), `--dur-3` 0,7 s (fondu, zoom). Seuls `transform`, `scale`, `translate` et `opacity` s'animent. Sous « réduire les animations » : tout s'arrête, la fenêtre de l'accueil reste sur sa première capture et son bouton de pause disparaît.

---

## 4. Grille

- **Gouttière** `--gutter` : 18–32 px sur téléphone, 40–88 px sur ordinateur ; au-delà de 1580 px de large, le contenu est borné à 1440 px et centré.
- Barre, plaques et pied de page partent de la même gouttière : le bord de chaque plaque tombe sous le bord de la barre.
- À l'intérieur d'une plaque : 2 colonnes égales (projets), 3 colonnes égales (métiers), 2 colonnes texte/visuel (studio, appel final). Une colonne sur téléphone, ou une rangée qui défile au doigt.
- Points de rupture : 700 px (en-têtes de section, listes), 760 px (grille de projets), 900 px (barre, colonnes de métiers), 1000 px (deux colonnes).

---

## 5. Composants

**Barre de navigation** — plaque de verre flottante, coins 12 px. Sigle à gauche, trois liens et un bouton d'encre « Contact » à droite. Les lettres basculent au survol. Sur téléphone, quatre carrés qui pivotent ouvrent le panneau dans la plaque.

**Plaque** (`.plate`) — le bloc de contenu. Jamais une plaque dans une plaque. Variante `.surface-ink` : une seule par page, pour l'appel final.

**En-tête de section** (`.section-head`) — la réponse au « titre tout nu » : le titre porte son action sur la même ligne (« Tous les projets → »), comme les rayons de l'App Store ; la phrase d'introduction suit. Sur téléphone, l'action passe sous la phrase. Pas d'étiquette, pas de filet au-dessus.

**Introduction de page** — le titre ne vient jamais seul : il est dans une plaque avec sa phrase et son action, et la preuve est posée à côté (sur l'accueil, la fenêtre qui fait passer de vrais sites). C'est le modèle des futures pages : titre en plaque + objet de preuve (capture, portrait, application).

**Boutons** — pilule pleine d'encre (une seule action principale par plaque) ; pilule fantôme à contour pour une action secondaire. Montée de 2 px au survol, enfoncement à 97 % à l'appui. Sur les écrans de moins de 380 px, le libellé descend d'un cran pour tenir sur une ligne.

**Lien fléché** (`.link-arrow`) — l'action secondaire : un mot souligné et une flèche qui avance de 3 px au survol.

**Fenêtre** (`.window`) — le cadre de navigateur de Work : trois pastilles, capture 16/10. Sous une fenêtre : le nom seul et le petit rond fléché, qui passe à l'encre au survol. Jamais de ligne de contexte ni de disciplines.

**Équipe** — portraits 4/5, nom dessous ; le rôle n'apparaît qu'à partir de 700 px.

**Pied de page** (`.site-footer`) — la dernière plaque : l'email en grand, puis les pages et le lieu avec l'heure de Lausanne sur une ligne. Sur téléphone, une seule ligne secondaire.

**Oiseau posé** — un seul par page au maximum, sur l'arête d'un objet (la fenêtre de l'accueil). C'est l'élément inattendu ; on ne l'accumule pas.

---

## 6. Écriture

Ton : français, direct, concret, vouvoiement. Deux longueurs de phrase : des titres de 2 à 10 mots, puis un paragraphe de 15 à 30 mots.

1. **Commencer par une définition vérifiable.** « WeAreBrothers est un studio fondé à Lausanne par deux frères. »
2. **La preuve plutôt que le superlatif.** Un délai, un lieu, un nom de projet réel. Jamais « innovant », « unique », « passionné ».
3. **Le client comme sujet.** « Chaque site part de ce que fait le client. »
4. **Nommer les livrables**, pas les concepts : « Reprise de vos données », pas « accompagnement global ».
5. **Un seul argument différenciant, dit comme une structure** : ceux qui dessinent sont ceux qui répondent.
6. **Une seule touche d'humanité par page**, bien placée (« On commence par un café ? »).
7. **Vocabulaire banni** : accompagner, sublimer, donner vie, solutions, expertise, sur-mesure en adjectif creux, « n'hésitez pas ».
8. **Jamais inventer** : témoignage, chiffre, client, prix, diplôme, récompense. Seuls les faits de `PRODUCT.md`.
9. **Typographie française** : espace insécable avant `?` `!` `:` `;` et dans « 24 h » ; aucun signe seul en début de ligne, vérifié à 320 px.
10. **Sur téléphone**, une seule ligne secondaire par bloc.

---

## 7. Icônes

**Jeu unique : [Lucide](https://lucide.dev)** (licence ISC), tracés copiés depuis le dépôt officiel, en SVG inline.

Pourquoi Lucide : demandé sur 21st.dev, aucun jeu d'icônes n'y est utilisable sans React — ceux qui existent chargent eux-mêmes Lucide (voir § 2). On prend donc la source, sans intermédiaire.

Règles :
- grille 24 × 24, `viewBox="0 0 24 24"`, extrémités et angles arrondis ;
- **une seule épaisseur : 1,5**, fixée en CSS par `.icon` (`--icon-stroke`), jamais dans le balisage ;
- taille : 1,25 em dans le texte, 24 px pour les icônes de titre (`.icon--lg`), 16 px dans les ronds et les contrôles ;
- couleur : `currentColor` — l'icône suit la gamme de sa surface ;
- toujours `aria-hidden="true"` : l'icône n'est jamais seule à porter le sens ;
- pas d'animation propre à l'icône : seule la flèche d'un lien avance au survol.

Icônes en place : `arrow-right`, `arrow-up-right`, `app-window`, `layout-dashboard`, `pen-tool`, `clock`, `calendar`, `wallet`, `pause`, `play`. Le bouton menu (quatre carrés) n'est pas une icône Lucide : c'est un signe propre au studio, il reste.

Dette connue : les pages intérieures utilisent encore des icônes dessinées à la main en quatre épaisseurs (1,6 à 2). Elles passeront à Lucide 1,5 avec leur refonte.
