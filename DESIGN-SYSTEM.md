# WAB. — Design système

Version 5 — 2 octobre 2026. Branche `refonte-studio`, appliquée à l'accueil et au socle commun (barre, boutons, jetons, icônes). Les autres pages suivront une fois l'accueil validé.

Historique de l'accueil : v1 plaques de texte (`9ec3f4f`, « trop de texte ») ; v2 sigle géant (`db37cd1`, écartée) ; v3 cartes de verre rose (`436aa19`, « cheap ») ; v4 cartes nettes et serrées (`14b80ac`, « très plat et sans âme ») ; v5, ci-dessous : la base de la v4, plus la personnalité du studio et une vraie composition, puis — retour d'Eliott en cours de route, « trop d'infos » — l'accueil réduit à quatre blocs, d'après Wild, MOUTHWASH et Pentagram (Mobbin).

---

## 1. Intention

**Des plaques de verre sur un ciel vivant.**

Le studio garde ce qui le rend reconnaissable — le fond animé en roses vifs, le grain, les oiseaux en pixel art, la police Sligoil — et y ajoute ce qui manquait pour être lu comme un grand studio : une règle unique de mise en page. Tout contenu vit dans une **plaque** de verre dépoli posée sur le ciel ; entre deux plaques, le ciel respire et les oiseaux passent. À l'intérieur d'une plaque, rien ne flotte : des grilles régulières, des filets d'un pixel, des colonnes égales.

Ce qui rend la direction originale : le contraste entre un décor vivant et ludique (le ciel, les oiseaux, la chasse fixe) et une mise en page d'une rigueur à la Apple. Le décor dit « studio de création », la grille dit « on peut nous confier un budget ». Aucun studio ne combine ces deux registres de cette façon, et rien de tout cela n'est neutre ni beige.

Ce qui est écarté, et pourquoi :
- le papier uni et immobile, les cartes blanches, les grands titres seuls (rejetés deux fois) ;
- les repères et filets au-dessus des titres, l'en-tête titre/phrase en deux colonnes (rejetés) ;
- les chiffres en exposant, les projets en très grand à tailles alternées, les ornements (rejetés).

### L'accueil, version 5 : quatre blocs, de l'âme dans les cartes

**Structure.** Une ouverture (promesse + Lausanne en direct + projet à la une), les travaux en bento, un seul bloc de contact, un pied de page d'une ligne. Tout le reste — services détaillés, faits, liens rapides — vit sur Work, Services et About. Références : [Wild](https://mobbin.com/sites/sections/c18cb634-beea-4af7-8d3a-08211610a68b) (une phrase, trois grandes cartes projet), [MOUTHWASH](https://mobbin.com/sites/sections/364878c8-261d-4943-81e9-d2b944b82247) (un titre court, quatre cartes), [Pentagram](https://mobbin.com/sites/sections/933958ee-3d23-4692-bcb7-650e850a84ee) (nom + une ligne).

**Composition.** Pas deux blocs au même gabarit : ouverture 2/3 + 1/3 puis une bande pleine largeur ; travaux en 2 × 2 + satellites + case libre ; contact 5/12 encre + 7/12 photos. Dans les cartes, trois mises en page de texte (`css/home-type.css`) : étiquette en petites capitales puis valeur très grande (l'heure de Lausanne) ; texte posé sur l'image, en bas, sur un voile sombre déclaré `.surface-ink` ; titre en grand dans une carte de texte seul.

**Personnalité.**
- Trois oiseaux du ciel posés sur trois cartes, pas davantage (`perch.js`, `data-perch="fly"` + `data-perch-host` sur la carte) : sur la carte « en direct », dans la case libre « Votre projet », sur la carte encre du contact. Ils s'envolent quand la souris entre dans la carte et reviennent se poser ; au doigt et sous « réduire les animations », ils restent posés, immobiles.
- Le statut du studio en direct (`nav-clock.js`) : « Lausanne, en direct », l'heure en très grand, et « Au studio », « Lausanne dort »… avec le point rose qui bat aux heures de bureau.
- Humour sobre, sans rien inventer : la case libre « Votre projet — Cette place vous attend. » (reprise de Work) avec son oiseau qui attend ; la signature « Codé à la main à Lausanne, oiseaux compris. »

### La page Services (2 octobre 2026)

Le système de cartes appliqué à une page intérieure.
- **Ouverture sans en-tête** : le titre de la page dans une carte (deux lignes sur ordinateur), et à côté deux cartes de chapitre — un repère discret en petites capitales (« 6 prestations »), le nom et une flèche vers le bas. Aucun paragraphe, aucune numérotation. Au téléphone, les chapitres deviennent deux rangées basses, nom et flèche.
- **Tuile** (`.sv-tile`, `css/service-tiles.css`) : une carte nette dont l'aperçu est posé à 8 px du bord, au rayon de 8 px, avec un liseré intérieur. Son fond est un dégradé doux d'une teinte claire vers une teinte profonde de la même famille (`service-mesh.css`), dans une palette resserrée accordée au rose : rose, lilas, pêche, mauve, bleu crépuscule, violet. Les objets dessinés dedans (fenêtres, documents, cartes) partagent une seule ombre (`--mock-shadow`) et une même échelle. Deux mises en page : aperçu en haut, ou texte à gauche et aperçu à droite pour la tuile large. Un titre, une ligne.
- **Bentos** : quatre colonnes pour Technologie (une grande, une haute, une large, trois petites), trois pour Image de marque (une grande, deux petites) — jamais deux sections au même gabarit.
- **Mouvement** : inclinaison 3D légère (4° au plus, 2° sur les grandes tuiles) et reflet discret (`js/service-tilt.js`), et chaque aperçu fait le geste de ce qu'il montre ; rien au doigt ni sous « réduire les animations ».

---

## 2. Références retenues

**Version 4 — mesures des grilles serrées (Mobbin)**

| Référence | Mesure retenue |
|---|---|
| [Linear — cartes « Plan »](https://mobbin.com/sites/sections/d3332e07-9e99-40d1-a60d-0921233bd100) | Gouttière serrée (8 px), liseré d'un pixel sans ombre, titre de carte à 15 px précédé d'une icône, texte gris à 13–14 px. |
| [Vercel — cartes à liseré](https://mobbin.com/sites/sections/78c2180a-54ba-4e20-91af-a5f5a8d55eab) | Détachement par le seul liseré (`rgba(0,0,0,.08)`), rayon de 12 px, visuel intérieur à 8 px. |
| [Apple Newsroom — cartes](https://mobbin.com/sites/sections/d168a419-654a-48f5-8472-922efdcc2931) | Surface blanche franche, image collée au haut de la carte, petites capitales grises de 11–12 px. |
| [Pentagram — projets](https://mobbin.com/sites/sections/933958ee-3d23-4692-bcb7-650e850a84ee) | Grille de projets à 10–12 px, nom en 15 px, contexte en gris dessous. |

**Version 3 — direction donnée par Eliott**

| Référence | Ce qu'on en garde |
|---|---|
| [Vucko](https://vucko.co/) | Une phrase d'intention courte, beaucoup d'air ; les projets en cartes avec le nom et le client ; un projet mis en avant avec « Voir le projet ». |
| [Apple Developer Design](https://developer.apple.com/design/) | Des cartes égales en grille de trois, coins arrondis, une image ou une icône, un titre en gras, une à deux lignes, un lien ; une hiérarchie très nette. |
| [Header 3](https://21st.dev/efferd/header-3/default) (efferd) | La barre transparente au repos, floutée au défilement ; le tiroir mobile qui apparaît de 97 % à 100 % en fondu. |
| [Tabbed Feature Categories](https://21st.dev/olewandowski1/features-4/default) (olewandowski1) | Les métiers en trois onglets, chacun une grille de cartes icône / titre / ligne ; la case d'icône qui passe à l'encre au survol. |
| [Ruixen Bento Cards](https://21st.dev/ruixen.ui/ruixen-bento-cards/default) (ruixen.ui) | Le bento sur six colonnes du bloc « Le studio » ; sans les « + » d'angle, ornementaux. |
| [Nav List Card](https://21st.dev/arihantcodes_1f7b8c4d/nav-list-card/default) (arihantcodes) | La carte-liste de liens du contact : lignes à icône qui glissent de 2 px avec un léger ressort et s'enfoncent à l'appui. |
| [Footer Section 4](https://21st.dev/solaceui/footer-section-4/default) (solaceui) | Le pied de page en deux cartes : marque et liens ; sans newsletter. |
| Feature 197 (shadcnblocks, id 688) | Écarté : un accordéon qui change l'image demande des images de déroulé que le studio n'a pas, et ajouterait du texte. |

Les adresses 21st.dev des composants sont déduites du modèle `21st.dev/<auteur>/<composant>/default` (l'outil ne renvoie que l'adresse d'installation).

**Version 2 — accueils dont l'impact vient du visuel** (écartée)

| Référence | Ce qui la rend mémorable, en une phrase |
|---|---|
| [Grapa Studio](https://studiograpa.com) (SiteInspire) | L'accueil n'est qu'une photo de projet plein cadre, presque sans texte. |
| [Locomotive](https://locomotive.ca/en) · [Mobbin](https://mobbin.com/sites/sections/6a2f519f-af72-4525-a6ca-2ef3457bdf63) | Une couleur d'identité saturée et une image plein écran ; le nom posé dans un coin. |
| [Freshman — Mobbin](https://mobbin.com/sites/sections/efd2c199-fe77-4b3a-971a-0ec6bdeb686b) | Le mot-logo géant coupé par le bas de l'écran, qui invite à descendre. |
| [Studio Freight — Mobbin](https://mobbin.com/sites/sections/37214c10-d891-48bc-a46e-6050033671b4) | Quatre mots en chasse fixe géante, une image glissée dans le texte. |
| [MOUTHWASH — pied de page](https://mobbin.com/sites/sections/082f5fac-4648-4314-aa7d-a06fe0235b77) | Le sigle sur 90 % de la largeur ferme la page. |
| [OFF+BRAND — Mobbin](https://mobbin.com/sites/sections/0b70740a-eb7a-415b-b48d-09d66ce3ec38) | Une rangée de projets qui sort de l'écran, sur un dégradé rose. |
| [Lusion](https://lusion.co), [Unseen](https://unseen.co) | Le défilement pilote une seule scène ; écartés pour leur 3D, trop lourde pour un petit studio. |
| [Scroll Horizontal Gallery — 21st.dev](https://21st.dev/@motiondotdev/components/motion-scroll-horizontal) | Le défilement vertical fait glisser une rangée : adapté en JS sans bibliothèque pour la planche. |
| [Hero scroll animation — 21st.dev](https://21st.dev/@uilayout.contact/components/hero-scroll-animation) | Une scène figée pendant que le défilement la transforme : le principe de l'ouverture. |

**Version 1**

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

**Barre de navigation** — plaque de verre flottante, coins 12 px. Au repos, tout en haut de la page, presque transparente et sans ombre ; dès 10 px de défilement, le verre s'épaissit et se floute (`.is-scrolled`, `js/nav.js`, d'après Header 3). Sigle à gauche, trois liens et un bouton d'encre « Contact » à droite. Sur téléphone, quatre carrés qui pivotent ouvrent le panneau, dont le contenu arrive de 97 % à 100 % en fondu (`css/nav-panel.css`).

**Carte** (`.card`, `css/plate.css`) — surface presque opaque (`--surface`), liseré d'un pixel, ombre levée seulement au survol d'une carte-lien, rayon de 16 px ; ce qui est posé dedans (images, pastilles) est à 8 px du bord, au rayon de 8 px. Gouttière unique de 12 px. Variante `.surface-ink` : une seule par page. Une ligne de texte au plus.

**En-tête de section** (`.section-head`) — le titre porte son action sur la même ligne (« Travaux choisis » / « Tous les projets → »), comme les rayons de l'App Store. Pas d'étiquette, pas de filet au-dessus, pas de phrase dessous.

**Ouverture** — deux cartes côte à côte, à la même hauteur : la promesse (titre, trois métiers en pastilles, deux boutons, le lieu et l'heure) et le projet à la une (capture 16/9, nom, client, « Voir le projet »). Au téléphone, l'une sous l'autre, sans les pastilles.

**Pastille d'icône** (`.icon-chip`) — 32 px, rayon 8 px, fond `--surface-sunk`, liseré fin, icône de 16 px ; elle passe à l'encre au survol de sa carte.

**Onglets** (`css/home-tabs.css`, `js/home/tabs.js`) — motif ARIA complet (flèches, Début, Fin ; un seul onglet dans l'ordre de tabulation). Sans script, les panneaux se lisent à la suite. Sur téléphone, les onglets se partagent la largeur et les cartes deviennent des rangées basses icône + titre.

**Bento** (`css/home-bento.css`) — quatre colonnes : une carte de deux sur deux remplie par les trois portraits de l'équipe, quatre cartes d'une case pour des faits vérifiés. Deux colonnes sur tablette, une au téléphone (rangées basses pastille + titre).

**Boutons** — pilule pleine d'encre (une seule action principale par plaque) ; pilule fantôme à contour pour une action secondaire. Montée de 2 px au survol, enfoncement à 97 % à l'appui. Sur les écrans de moins de 380 px, le libellé descend d'un cran pour tenir sur une ligne.

**Lien fléché** (`.link-arrow`) — l'action secondaire : un mot souligné et une flèche qui avance de 3 px au survol.

**Carte projet** (`css/home-work.css`) — huit cartes sur quatre colonnes : photo de mise en situation 4/5 posée à 8 px du bord, nom en 15 px et client en 13 px, chacun sur une ligne. Deux colonnes sur tablette ; au téléphone, une rangée qui défile au doigt.

**Portraits** — `team-*-400.webp` (400 × 500, 18 à 27 Ko), cadrés sur le visage (`object-position: 50% 20%`).

**Pied de page** (`.site-footer`, `css/footer.css`) — deux cartes taillées à leur contenu : la marque sur `--pink-deep` (seul aplat de rose de la page), les liens en surface claire avec intitulés en petites capitales de 11 px.

**Les oiseaux** — densité « calme » sur l'accueil depuis la version 4 : ils volent dans les marges et entre les sections, sans encombrer les cartes.

---

## 6. Écriture

Ton : français, direct, concret, vouvoiement.

**Sur l'accueil : au plus une ligne par carte.** Une promesse de six mots et une action à l'ouverture ; le nom et le client sous chaque projet ; un titre et une ligne par carte de métier ou de fait ; une question et un bouton pour finir. Aucun paragraphe descriptif, aucune liste de livrables : le détail vit sur Work, Services et About, où l'on garde deux longueurs de phrase — des titres de 2 à 10 mots, puis un paragraphe de 15 à 30 mots.

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

Icônes en place sur l’accueil, regroupées une seule fois dans un sprite SVG en tête de page et appelées par `<use href="#i-…">` : `arrow-right`, `arrow-up-right`, `app-window`, `layout-dashboard`, `plug`, `workflow`, `mail`, `sparkles`, `pen-tool`, `id-card`, `clapperboard`, `compass`, `list-checks`, `brain`, `clock`, `calendar`, `server`, `wallet`, `map-pin`, `layout-grid`, `users`. Le bouton menu (quatre carrés) n’est pas une icône Lucide : c’est un signe propre au studio, il reste.

Dette connue : les pages intérieures utilisent encore des icônes dessinées à la main en quatre épaisseurs (1,6 à 2). Elles passeront à Lucide 1,5 avec leur refonte.

---

## WAB OS — accueil (3 octobre 2026, branche `bureau`, en attente de validation)

**Intention.** L'accueil est le système d'exploitation du studio, et il fonctionne : le site est lui-même la démonstration technique. **Structure : celle de [heyclicky.com](https://www.heyclicky.com/), section par section** (« vraiment la même structure, j'aime beaucoup cette vibe », Eliott, 3.10). **Rendu : verre liquide rose**, façon macOS Tahoe / iOS 26 (« ultra moderne »). Seuls les oiseaux et le grand « WAB. » du pied de page restent en pixel art. Le centre du premier écran reste parfaitement net. Toutes les fonctions avancées sont des bonus : sans JavaScript, au doigt ou au lecteur d'écran, le site reste entier.

**La séquence (calquée sur la référence).**
1. **Barre** de verre : WAB., Work, Services, About · l'oiseau au centre · Rechercher ⌘K (dès 1080 px), la lumière du jour (soleil ou lune, symbole fin), le statut du studio (dès 1180 px), l'heure de Lausanne, Contact en verre rose.
2. **Premier écran** : six fenêtres de vrais projets (liens vers `/realisations#projet`), l'autocollant HELLO, deux kaomoji, le dossier Work et la Corbeille en icônes d'app ; « WAB. », la promesse, deux boutons de verre, « Réponse sous 24 h, Lausanne » ; la vitrine, bouton lecture/pause en verre fumé.
3. **Trois blocs en quinconce** (Sites sur mesure, Applications de gestion, Automatisation et IA) : la fenêtre posée dans un **écran** (fond d'écran = le ciel rose du site, liseré `--screen-rim`), l'onde en traits, deux bulles de verre (une question plausible en rose, la réponse de WAB en clair : mise en scène, sans nom, masquée aux lecteurs d'écran, jamais un témoignage), le titre et une ligne. Seul le bloc au centre de l'écran est net (`focus-scroll.js`).
4. **La lettre** d'Eliott et Matt dans Notes, sous le badge « Le studio », accueillie par une **nuée d'oiseaux** qui arrive ensemble des deux côtés et se pose autour de la lettre et sur sa fenêtre (`js/desk/arrival.js`, une fois par visite, posés d'emblée sous « réduire les animations ») ; passage surligné, curseur rose, signataires (noms tapés) et sigle WAB. Puis un filet en pointillés.
5. **Le mur** : badge « Réalisations », « Fait à Lausanne » en grand (une seule fois), les **9 projets dans leur fenêtre** comme sur le bureau du haut (capture, nom dans la barre, adresse dessous ; colonne du milieu décalée), un clic ouvre la fiche ; carte de bilan « 9 projets en ligne, de Lausanne à Bavois (VD). Voir le travail ».
6. **Le ciel rose** (`--sky-mesh`, fondu en haut et en bas) : « Trois façons de travailler avec nous. », trois cartes de verre — **Site vitrine 1'000 – 2'500 CHF**, **Site et outils 2'500 – 7'000 CHF** (outil de gestion, e-commerce, options ; badge « Ce qui nous distingue », bouton rose), **Expérience sur mesure dès 7'000 CHF**, sur devis (refonte de marque). Prix donnés par Eliott le 3.10. Puis le mini-terminal sombre « > contact ».
7. **FAQ** : huit questions reprises mot pour mot de `/creation-site-internet-lausanne`, en `<details>` natifs. Pas de JSON-LD FAQPage sur l'accueil (il reste sur sa page).
8. **Pied de page** : colonnes, puis « WAB. » en pixels roses sur toute la largeur.

**Le verre.** Barre, dock, fenêtres ouvertes, palette, menu, cartes du ciel : `--glass` + `--glass-blur`, liseré lumineux `--glass-rim`, reflet `--glass-specular`, ombres diffuses. Le flou réel n'est posé que sur ces quelques surfaces ; les fenêtres décoratives (nombreuses) imitent le verre sans `backdrop-filter`. Sans prise en charge : surfaces opaques (`--glass-strong`).

**Le bouton `.glass-btn`** (`css/glass-btn.css`, réutilisable). Texture choisie par Eliott : **celle des bulles des services, partout**. Pilule, verre rose clair (`.glass-btn--pink`, `--bubble-pink`) ou clair (`--bubble-clear`), double liseré, reflet spéculaire sur la moitié haute (`::before`), fil de bord flouté (`::after`), pénombre interne en bas, flou léger de l'arrière-plan. Le reflet suit la souris (`--gb-x`, `--gb-y`, `js/desk/glass.js`), gonfle au survol (`scale 1.02`) et s'écrase à l'appui sur un ressort. Texte toujours `--glass-ink` (jamais `--ink`, qu'une surface sombre redéfinit). `.glass-btn--sm`, `:disabled`, mouvement coupé sous « réduire les animations ». Encre sur le rose : 10,7:1.

**Les icônes.** *Icônes d'app* (`assets/icons/app-*.svg`, dock, bureau, fenêtres réduites), sobres façon iOS 26 « teinté » après le retour d'Eliott (« c'est kitsch, plus simple et clean ») : la même squircle blanche à peine nacrée pour toutes, un liseré fin, un pictogramme encre au trait ; un seul rose, réservé à Contact. Ni halo, ni dégradé de couleur, ni ombre sur les pictogrammes. *Symboles* (`sym-*.svg`, d'après Lucide, licence ISC, trait 1,8) peints en masque CSS (`.sym.sym--nom`, `css/sym.css`) : ils prennent la couleur du texte de leur surface. Générés par un script (icônes d'app à couleurs fixes, symboles en masques).

**Le dock** (redemandé par Eliott : « comme sur les Mac ») : verre, rayon `--r-dock` (24 px), six apps, grossissement à ressort, point rose pour une app ouverte, fenêtres réduites après le séparateur ; il se range quand on descend et revient quand on remonte ; la page réserve sa place. Ordinateur seulement.

**Les fonctions.** Fenêtres (`js/os/wm*.js`) : passer devant, déplacer, agrandir, réduire dans le dock, Échap, focus rendu ; feuilles modales sous 760 px. Fiche projet lue sur la page Work (texte et adresses vérifiés seulement). Dossier Work (icônes / liste, flèches). Palette ⌘K / Ctrl+K. Terminal (`aide`, `projets`, `ouvrir N`, `services`, `equipe`, `contact`, `heure`, `effacer`, saisie bornée et nettoyée, `textContent` partout). Clic droit sur le bureau. Lumière du fond à l'heure de Lausanne (`data-sky`, via `window.WABClock` exposé par `nav-clock.js`). Oiseaux, beaucoup moins nombreux (« je veux toujours les oiseaux mais beaucoup moins ») : régime `data-birds="rare"`, deux à quatre en vol ; un posé sur zinema.ch, un sur l'escalier gauche, la mascotte de la barre ; ils s'envolent quand on déplace une fenêtre ; l'un vient se poser près du curseur après 9 s d'inactivité.

**Piège réglé.** La trame est une couche fixe à z-index négatif : elle se peint entre le fond de la racine et le corps de page. Tout fond posé sur `body` la cache ; la lumière de l'heure vit donc sur la racine (`:root:has(body.desk)`), le corps reste transparent.

**Jetons** — tous dans `css/os-tokens.css` (portés par `body.os`) :

| Jeton | Valeur | Rôle |
|---|---|---|
| `--desk` | `#fafafa` | le bureau : blanc à 2 % de gris, sans teinte chaude |
| `--desk-dot` · `--desk-grid` | `rgba(163,163,163,.42)` · 16 px, très léger | la trame « Dot Pattern » : un point de rayon 1 en (1,1), SVG en masque, couleur par jeton |
| `--ink` · `--ink-muted` · `--ink-faint` | `#0b0b0c` · `#5c5b63` · `#66656d` | 19:1 · 6,4:1 · 5,5:1 sur le bureau |
| `--pink` · `--accent` · `--mark` | `#ff2d9b` · `#a00f5a` · `#ffd0e6` | signes ; rose qui porte du texte et focus (7:1) ; sélection |
| `--glass` · `--glass-strong` · `--glass-blur` | blanc 66 % · 84 % · flou 24 px, saturation 1,8 | les surfaces de verre |
| `--glass-rim` · `--glass-edge` · `--glass-specular` | blanc 90 % · encre 10 % · reflet haut | liseré lumineux, trait fin, reflet |
| `--glass-ink` | `#0b0b0c` | l'encre fixe du verre clair |
| `--bubble-pink` · `--bubble-clear` | rose `#ffc4e2 → #ff8cc6` translucide · blanc | la texture des boutons, bulles, autocollant, pastilles |
| `--sky-mesh` | rose, lilas, pêche | le ciel des trois paliers |
| `--wallpaper` · `--screen-pad` · `--screen-rim` | ciel rose · 12 px · `#2a292e` | l'écran des services |
| `--r-win` · `--r-ctl` · `--r-px` · `--r-pill` · `--r-dock` | 18 · 12 · 3 · 999 · 24 px | fenêtres et cartes ; contrôles ; pastilles ; pilules ; dock |
| `--term-*` | fond `#121114`, encre `#ecebef`, gris `#a9a7b1`, rose `#ff8cc6` | terminal et mini-terminal (15,6 · 7,9 · 8,9:1) |
| `--z-*` | bureau 3 · fenêtres 130+ · dock 180 · barre 190 · menu 210 · notification 220 | les calques |

**Fichiers.** *Partagés par toutes les pages* (mode d'emploi : `OS-COMPONENTS.md`, `<body class="os">`) : `os-tokens`, `os-base`, `os-sky`, `sym`, `glass-btn`, `os-bar`, `os-window`, `os-bubbles`, `os-footer`, `os-dock`, `os-overlay`, et à la demande `os-win`, `os-win-states`, `os-case`, `os-finder`, `os-terminal`, `os-palette`, `os-menu` ; JS `js/os/` (entrée `index.js` : sky, glass, shell ; puis apps, lazy, gesture, actions, toast, clock, dock, dock-hide, dom, projects, wm, wm-frame, wm-wire, case, finder, terminal, terminal-commands, palette, palette-items, menu, trash, idle-bird). *Propres à l'accueil* (`body.desk`) : `desk-objects`, `desk-hero`, `desk-scatter`, `desk-scatter-wide`, `desk-blocks`, `desk-chat`, `desk-auto`, `desk-letter`, `desk-wall`, `desk-plans`, `desk-faq` ; JS `js/desk/` (index, drag, parallax, showcase, watch, pixels, focus-scroll, arrival). `desk-aqua.css` est supprimée ; les étapes et l'alerte finale ont quitté l'accueil (absentes de la référence ; les étapes restent sur Work).
