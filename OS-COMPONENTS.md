# WAB OS — composants partagés

État au **8 octobre 2026**. Référence pour les sept pages : accueil, Work, Services, About, Création de site, Applications, 404. Principes, jetons et teintes : `DESIGN-SYSTEM.md`.

Règle d'or : **les fichiers partagés (`os-*.css`, `key-btn.css`, `desk-keys.css`, `desk-margins.css`, `base*.css`, `js/os/`) ne reçoivent pas de style propre à une page.** Ce qui ne concerne qu'une page va dans `css/page-*.css` (ou `home-*` / `desk-*` pour l'accueil) et `js/page-*/`.

---

## 1. Mise en place d'une page

Le plus sûr : **copier le `<head>` et la fin de `<body>` d'une page existante** (par exemple `services.html`), qui ont les numéros de version à jour. Ordre des feuilles partagées (versions du 08.10) :

```html
<link rel="preload" href="assets/fonts/InstrumentSans-Var.woff2" as="font" type="font/woff2" crossorigin>

<link rel="stylesheet" href="css/base.css?v=35">
<link rel="stylesheet" href="css/base-ui.css?v=1">
<link rel="stylesheet" href="css/nav-panel.css?v=4">
<link rel="stylesheet" href="css/contact-modal.css?v=8">
<link rel="stylesheet" href="css/contact-form.css?v=5">
<link rel="stylesheet" href="css/os-tokens.css?v=12">
<link rel="stylesheet" href="css/os-tints.css?v=1">
<link rel="stylesheet" href="css/os-base.css?v=6">
<link rel="stylesheet" href="css/os-sky.css?v=6">
<link rel="stylesheet" href="css/sym.css?v=4">
<link rel="stylesheet" href="css/key-btn.css?v=3">
<link rel="stylesheet" href="css/os-bar.css?v=7">
<link rel="stylesheet" href="css/os-window.css?v=5">
<link rel="stylesheet" href="css/os-bubbles.css?v=4">   <!-- si la page a des bulles -->
<link rel="stylesheet" href="css/os-footer.css?v=11">
<link rel="stylesheet" href="css/desk-keys.css?v=4">    <!-- les touches du logo -->
<link rel="stylesheet" href="css/os-dock.css?v=6">
<link rel="stylesheet" href="css/os-dock-toc.css?v=2">
<link rel="stylesheet" href="css/desk-margins.css?v=3">
<link rel="stylesheet" href="css/os-overlay.css?v=4">
<link rel="stylesheet" href="css/os-sticker.css?v=2">   <!-- si la page pose l'autocollant -->
<!-- puis les feuilles de la page : css/page-*.css -->

<script src="nav-clock.js?v=3" defer></script>
<script src="js/nav.js?v=6" defer></script>
<script src="js/reveal.js?v=4" defer></script>          <!-- si la page utilise .reveal -->
<script type="module" src="js/contact/index.js?v=13"></script>
<script type="module" src="js/os/index.js?v=11"></script>
<script type="module" src="js/page-xxx/index.js?v=N"></script>  <!-- le module de la page -->
```

- `<html lang="fr-CH" class="no-js">` et, en tête du `<head>`, le petit script qui remplace `no-js` par `js`.
- `<body class="os">` (plus une classe de page si besoin : `page-work`, `page-apps`, `page-404` ; l'accueil : `os desk`).
- Dans `<main>`, en premier : `<div class="margins" aria-hidden="true" data-margins></div>` (motifs de pixels des marges).
- Le corps reste transparent : les fonds se posent sur les sections ou les cartes.
- La 404 utilise des chemins absolus (`/css/…`) : elle est servie à n'importe quelle adresse.

## 2. La barre du haut — `css/os-bar.css`, `css/nav-panel.css`, `js/nav.js`

Une pilule de verre blanc qui flotte en haut. À gauche le logo en mini-touches, au centre les pages (la page en cours porte `aria-current="page"`), à droite la recherche ⌘K et Contact. Au téléphone, un bouton à deux traits déroule le panneau dans la pilule. Copier le `<header class="menubar">` et le `<div class="topbar-scrim">` d'une page existante ; sur l'accueil seulement, le lien du logo porte `aria-current="page"`.

```html
<a href="/" class="menubar__brand" aria-label="WAB., accueil"><span class="keys menubar__keys" aria-hidden="true" translate="no"><span class="key key--tint" data-tint="vert"><span class="key__face">W</span></span><span class="key key--tint" data-tint="jaune"><span class="key__face">A</span></span><span class="key key--tint" data-tint="rose"><span class="key__face">B</span></span><span class="key key--dot"><span class="key__face">.</span></span></span></a>
```

Le menu ne porte que **Work, Services, About** (+ Contact). Toute nouvelle page se rattache à l'un d'eux.

## 3. Les touches

### Le bouton-touche — `css/key-btn.css`

```html
<a href="mailto:contact@wearebrothers.ch" data-contact class="key-btn key-btn--klein">Démarrer un projet</a>
<a href="/realisations" class="key-btn">Voir nos réalisations</a>
```

- `.key-btn` : touche blanche. `--klein` : touche pleine de la teinte du bloc, avec petite flèche — l'action principale, une par écran. `--sm` : barre, dock, cartes. `--deep` : touche plus profonde, pour les actions d'un premier écran.
- Sur une surface `.on-klein`, les touches s'inversent seules.
- `:disabled` / `aria-disabled="true"` gérés ; l'appui ne bouge plus sous « réduire les animations ».

### Les touches de lettre — `css/desk-keys.css`

`.keys > .key > .key__face` : une touche de clavier en volume (jupe, face éclairée). `.key--tint` + `data-tint` : touche colorée ; `.key--dot` : le point bleu. Sert au logo, au pied de page et au nom du premier écran de l'accueil (`css/desk-hero.css`, brouillé par `js/desk/scramble.js` via `[data-scramble]`).

### Le bruit — `js/os/keysound.js`

Toute touche (`.key-btn`, `.key`, `.menubar__link`, `.dock__chip`, `.dock__item`, `.topbar__menu`, onglets…) fait un « clac » à l'appui. Pour qu'un nouveau type de touche sonne, ajouter son sélecteur à la liste `KEYS` du module.

## 4. Les fenêtres — `css/os-window.css`

Dessinées comme un navigateur : barre blanche, trois pastilles rouge / jaune / vert à gauche, adresse en Sligoil au centre.

```html
<div class="win">
    <div class="win__bar"><span class="win__lights"></span><span class="win__title">lepetitcentral.ch</span></div>
    <div class="win__body"><img src="…" alt="…" width="1600" height="1000" loading="lazy" decoding="async"></div>
</div>
```

- `.win__body` prend le ratio natif de l'image (16/10 pour une capture, 4/5 pour une photo).
- `.win--framed` (cadre tramé en pixels) : ne reste que sur la 404.
- Pas de `backdrop-filter` sur les fenêtres posées (performance).
- **Fenêtres qui s'ouvrent** (fiche projet, dossier Work, terminal, palette ⌘K, menu du clic droit) : `js/os/apps.js` charge à la première ouverture leur feuille (`os-win`, `os-win-states`, `os-finder`, `os-case`, `os-terminal`, `os-palette`, `os-menu`) par `loadStyle()` (`js/os/lazy.js`), puis leur module. Au téléphone, elles deviennent une feuille qui monte du bas.
- Une carte qui ouvre la fiche d'un projet : `<a href="/realisations#zinema" data-card="zinema" data-title="zinema.ch">…</a>`. Les fiches sont lues dans `work.html` (`js/os/projects.js`) : c'est la seule source des projets.

## 5. La carte de section — `.os-card` (`css/os-base.css`)

Une grande carte gris chaud posée sur le bureau (rayon 20 px, liseré, relief, feuille décalée dessous). **Elle remplace les bandes pleine largeur** : une section mise en avant se pose dans une `.os-card`, à l'intérieur de `.os-wrap` / `.desk-wrap`.

- `.os-card--wash` : fond très clair de la teinte du bloc au lieu du gris.
- `.os-card--even` : même retrait en haut et en bas (contenu centré).
- Exemples : Offres (accueil), Savoir-faire (About), Déroulé (Work), Approche (Applications, `--wash`), Formules (Services), Refonte (Création de site).

Patron complet d'une section colorée : `DESIGN-SYSTEM.md`, dernière section.

## 6. Petits composants

- **Badge** (`os-base.css`) : `<p class="badge">FAQ</p>` — étiquette Sligoil en capitales, carré de la teinte devant.
- **Bulles** (`css/os-bubbles.css`) : `<div class="chat" aria-hidden="true"><p class="chat__ask">Un site qui tient sur mobile&nbsp;?</p><p class="chat__reply">Nous le codons de A à Z.</p></div>` — question gris chaud, réponse dans la teinte. Mise en scène, jamais témoignage : pas de nom, `aria-hidden`.
- **Symboles** (`css/sym.css`, `assets/icons/sym-*.svg`) : `<span class="sym sym--search" aria-hidden="true"></span>`, couleur du texte. Disponibles : arrow, bolt, chart, check, file, folder, grid, mail, moon, notes, plus, search, site, sun, team, terminal, trash, turn.
- **Icônes d'app** (`assets/icons/app-*.svg`) : touches 3D, utilisées dans les fenêtres et le dock de la 404. Générées par script : ne pas retoucher à la main.
- **Autocollant** « HELLO my name is WAB. » (`css/os-sticker.css`) : sur Work, Services et Applications, toujours droit, dans un conteneur `aria-hidden`. Kaomoji : uniquement le « (o_O) » de la 404 (`css/desk-objects.css`).

## 7. Les marges en pixels — `js/desk/pixels-margins.js`, `css/desk-margins.css`

Sur toutes les pages : des formes de gros pixels de couleur posées de part et d'autre du contenu, jusqu'au pied de page (survol : elles bougent ; clic : elles se redessinent). Il faut le `[data-margins]` dans `<main>` et au moins un `.desk-wrap` (le script mesure la largeur du contenu sur le premier trouvé — souvent celui du pied de page). Rien quand l'écran est trop étroit pour avoir des marges. Chargé par `js/os/index.js`.

L'accueil a en plus le canevas du premier écran (`[data-pixels]`, `js/desk/pixels.js`, `pixels-field.js`, `pixels-patterns.js`, `pixels-ink.js`) : il ne peint jamais sous les éléments `[data-pixels-keep]` (le nom, les boutons).

## 8. Le pied de page — `css/os-footer.css`

Une bande compacte sur papier blanc : logo en mini-touches et phrase du studio, colonnes Studio et Expertises, bloc contact, ligne de mentions. **Les liens Création de site internet et Applications de gestion ne doivent jamais disparaître** : c'est le chemin visible vers ces deux pages (sinon Google les traite comme pages satellites). Copier le `<footer class="foot">` d'une page existante.

## 9. Le dock = sommaire de la page — `css/os-dock.css`, `css/os-dock-toc.css`, `js/os/toc.js`

Sur ordinateur seulement (souris, 900 px et plus), toujours affiché : une pilule blanche en bas avec les sections de la page, chacune d'un pixel de sa teinte ; la section lue s'allume (`aria-current="location"`) et un trait de lecture suit le bord bas de la pilule. Au bout, la touche « Écrire ». Les fenêtres réduites se rangent après (`js/os/dock.js`). Placer juste avant `</body>` :

```html
<nav class="dock dock--toc" aria-label="Sommaire de la page" data-dock data-toc>
    <ol class="dock__toc">
        <li><a class="dock__chip" href="#projets" data-tint="bleu">Projets</a></li>
        <li><a class="dock__chip" href="#deroule" data-tint="vert">Déroulé</a></li>
    </ol>
    <a class="dock__cta key-btn key-btn--klein key-btn--sm" href="mailto:contact@wearebrothers.ch" data-contact>Écrire</a>
    <ul class="dock__shelf" data-dock-shelf aria-label="Fenêtres réduites" hidden></ul>
    <span class="dock__progress" aria-hidden="true"></span>
</nav>
```

Chaque `href` doit viser l'`id` d'une section, et la teinte de l'entrée celle de la section. **Exception : la 404** garde l'ancien dock d'apps (`.dock__apps`, icônes Work, Services, About, Lettre, Terminal, Contact) et ne charge pas `os-dock-toc.css`.

## 10. Le système — `js/os/index.js`

Un seul module partagé, chargé par les sept pages. Il démarre, chacun isolé dans un `try` (un module en panne n'emporte pas les autres) :

- `sky.js` : la lumière de l'heure de Lausanne (`data-sky` sur la racine) ;
- `shell.js` : palette ⌘K / Ctrl+K, menu du clic droit, cartes `data-card`, dock ; charge `apps.js` à la demande ;
- `toc.js` : le sommaire du dock ;
- `keysound.js` : le bruit des touches ;
- `../desk/pixels-margins.js` : les marges en pixels.

Les erreurs passent par `report()` (`js/os/lazy.js`) : attribut `data-os-error` sur la racine et `window.reportError`, jamais `console.log`. L'heure (`[data-local-time]`) est mise à jour par `nav-clock.js`.

## 11. La fenêtre de contact — `js/contact/`, `send-message.php`

Il n'y a pas de page Contact : tout lien `data-contact` ouvre la fenêtre par-dessus la page (sans JavaScript, il reste un `mailto:`). `/contact` et `#ecrire` l'ouvrent à l'arrivée (redirection 301 dans `.htaccess`).

- `markup.js` (champs et listes de choix), `form.js` (validation, envoi), `dom.js`, `index.js` ; `flight.js` : l'oiseau qui emporte le message (dessin dans `js/birds/sprites.js` et `frames.js`, seuls restes des oiseaux).
- Les listes de choix (type de projet, budget, délai) existent **en double** : `js/contact/markup.js` et `send-message.php`, qui refuse toute autre valeur. Les modifier ensemble.
- Envoi : `send-message.php` → `smtp-mailer.php` (SMTP authentifié Infomaniak ; `mail()` est désactivé chez l'hébergeur). Identifiants dans `mail-config.php`, généré au déploiement depuis les secrets GitHub, jamais dans le dépôt (`.gitignore`).

## 12. Numéros de version `?v=`

Les navigateurs gardent les CSS un mois en cache : **toute modification d'un fichier impose de relever son numéro partout où il est appelé.**

1. **Feuille CSS** : relever `?v=` dans chaque page qui la charge (`grep -n "nom.css" *.html`).
2. **Module JS** : les modules s'importent en chaîne avec des numéros (`import { initToc } from './toc.js?v=1'`). Modifier `toc.js` impose de relever son numéro dans `js/os/index.js`, donc de modifier `index.js`, donc de relever `js/os/index.js?v=` dans les sept pages. Remonter ainsi jusqu'au HTML. Un même fichier doit porter le **même numéro** partout où il est importé, sinon il est chargé deux fois.
3. **Feuilles chargées à la demande** : leur numéro est dans `js/os/apps.js` (`loadStyle(name, 4)` pour les fenêtres, `3` pour le menu). Le relever, puis remonter la chaîne `apps.js` → `shell.js` → `index.js` → HTML.
4. `.htaccess` sert les `.js` en `no-cache` (revalidés à chaque visite) : un oubli côté JS se voit moins, mais relevez quand même.

## 13. Règles communes

- Contenus réels uniquement (voir `PRODUCT.md`) ; prix publics : 1'000 – 2'500 CHF, 2'500 – 7'000 CHF, dès 7'000 CHF.
- `&nbsp;` avant `? ! : ;` ; jamais de `?` ou `!` seul en début de ligne (vérifier à 320 px).
- Mobile : une seule ligne grise secondaire par bloc.
- Contraste AA ; `prefers-reduced-motion` fige tout et coupe le son.
- Rien de penché ; aucun nouvel oiseau décoratif.
- Fichiers de moins de 200 lignes ; JavaScript en `// @ts-check`, zéro `console.log`.
