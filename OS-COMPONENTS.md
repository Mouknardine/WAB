# WAB OS — composants partagés

Référence pour toutes les pages (Work, Services, About, Création de site, Applications, 404). Propriétaire : l'agent de l'accueil. **Ne modifiez pas ces fichiers depuis une page** : si un composant manque, signalez-le ; les styles propres à une page vont dans `css/page-*.css`.

Direction : la structure de heyclicky.com, le rendu « verre liquide » rose (macOS Tahoe / iOS 26), la police Sligoil partout. Détails et décisions : `DESIGN-SYSTEM.md`, section « WAB OS ».

## 1. Mise en place d'une page

1. `<body class="os">` — c'est la classe `os` qui porte les jetons, la trame de points, le rose système (sélection, focus, curseur). Ajoutez `data-birds="rare"` pour deux à quatre oiseaux (l'accueil), rien pour le régime calme.
2. Dans le `<head>`, après les balises SEO :

```html
    <!-- Avant tout rendu (déjà en place sur chaque page) -->
    <script>document.documentElement.classList.replace('no-js', 'js');</script>

    <!-- WAB OS : composants partagés -->
    <link rel="stylesheet" href="css/base.css?v=33">
    <link rel="stylesheet" href="css/nav-panel.css?v=1">
    <link rel="stylesheet" href="css/contact-modal.css?v=7">
    <link rel="stylesheet" href="css/contact-form.css?v=3">
    <link rel="stylesheet" href="css/os-tokens.css?v=2">
    <link rel="stylesheet" href="css/os-base.css?v=2">
    <link rel="stylesheet" href="css/os-sky.css?v=2">
    <link rel="stylesheet" href="css/sym.css?v=3">
    <link rel="stylesheet" href="css/glass-btn.css?v=3">
    <link rel="stylesheet" href="css/os-bar.css?v=2">
    <link rel="stylesheet" href="css/os-window.css?v=2">
    <link rel="stylesheet" href="css/os-bubbles.css?v=1">
    <link rel="stylesheet" href="css/os-footer.css?v=2">
    <link rel="stylesheet" href="css/os-dock.css?v=3">
    <link rel="stylesheet" href="css/os-overlay.css?v=3">
    <link rel="stylesheet" href="css/os-sticker.css?v=1"> <!-- si la page pose l'autocollant -->
    <!-- puis la ou les feuilles propres à la page (css/page-*.css) -->

    <script src="nav-clock.js?v=3" defer></script>
    <script src="js/nav.js?v=6" defer></script>
    <script type="module" src="js/birds/index.js?v=8"></script>
    <script type="module" src="js/contact/index.js?v=10"></script>
    <script type="module" src="js/os/index.js?v=2"></script>
```

3. Ne posez **aucun fond sur `body`** : la trame est une couche fixe à z-index négatif qui se peint entre le fond de la racine et le corps. Un fond sur le corps la cache. Les fonds de section se posent sur les sections.
4. Pour un contenu borné à la colonne du site : `.os-wrap` (largeur `--measure` + gouttières).

## 2. Jetons — `css/os-tokens.css`

Toutes les valeurs vivent ici, en OKLCH, aucune valeur en dur ailleurs. Les principaux :

| Jeton | Rôle |
|---|---|
| `--desk` `#fafafa` | le fond : blanc à 2 % de gris |
| `--desk-dot`, `--desk-grid` | la trame « Dot Pattern », 16 px, très légère |
| `--ink`, `--ink-muted`, `--ink-faint` | encre, gris de texte (AA sur le fond) |
| `--pink`, `--accent`, `--mark` | rose des signes ; rose qui porte du texte et focus (7:1) ; sélection |
| `--glass`, `--glass-strong`, `--glass-blur`, `--glass-rim`, `--glass-edge`, `--glass-specular`, `--glass-shadow`, `--glass-shadow-lift` | le verre |
| `--glass-ink` | l'encre fixe du verre clair (ne change jamais, même sur fond sombre) |
| `--bubble-pink`, `--bubble-clear` | la texture rose et claire des boutons et bulles |
| `--sky-mesh`, `--wallpaper` | le ciel rose (bandes pleine largeur) ; le fond d'écran des cadres |
| `--r-win` 18, `--r-ctl` 12, `--r-px` 3, `--r-pill` 999, `--r-dock` 24 | les rayons |
| `--term-bg`, `--term-ink`, `--term-muted`, `--term-accent` | surfaces sombres (terminal) |
| `--t-cap`, `--t-small`, `--t-body`, `--t-lede`, `--t-title`, `--gutter`, `--section`, `--measure` | typo et rythme |
| `--track-optical`, `--track-caps` | interlettrage des titres (se resserre avec la taille, appliqué à tous les h1-h3 par os-base.css) ; capitales |
| `--grain`, `--hair`, `--pink-print` | grain du fond, épaisseur unique des liserés, rose d'imprimerie de l'autocollant |
| `--dur-1` 150 ms, `--dur-2` 250 ms, `--dur-3` 400 ms | les trois seules durées : retour, état, déplacement |
| `--ease-out`, `--ease-spring` | courbes (ressort à 3 % de rebond) |
| `--z-win` 130, `--z-dock` 180, `--z-bar` 190, `--z-menu` 210, `--z-toast` 220 | calques |

Une surface sombre redéfinit localement `--ink`, `--ink-muted`, `--accent`, `--line` pour elle et ses enfants. Exemple : `.term-card` dans `desk-faq.css`.

## 3. La barre du haut — `css/os-bar.css` (+ `nav-panel.css`, `js/nav.js`)

À copier tel quel. Sur la page courante, ajoutez `aria-current="page"` au lien concerné. Sur une autre page que l'accueil, le lien `WAB.` mène à `/`.

```html
    <header class="menubar" id="topbar">
        <div class="topbar__inner menubar__inner" id="topbarBar">
            <div class="menubar__row">
                <a href="/" class="menubar__brand">WAB.</a>

                <nav class="menubar__nav" aria-label="Navigation principale">
                    <a href="/realisations" class="menubar__link">Work</a>
                    <a href="/services" class="menubar__link">Services</a>
                    <a href="/studio" class="menubar__link">About</a>
                </nav>

                <span class="menubar__os" aria-hidden="true" translate="no"><canvas class="menubar__sigil" data-perch="flap" data-scale="1" data-color="4"></canvas></span>

                <div class="menubar__state">
                    <button type="button" class="menubar__find" data-palette-open data-js-only aria-keyshortcuts="Meta+K Control+K">
                        <span class="sym sym--search" aria-hidden="true"></span>Rechercher<kbd data-shortcut>⌘K</kbd>
                    </button>
                    <span class="menubar__sky" aria-hidden="true"><span class="sym sym--sun" aria-hidden="true"></span><span class="sym sym--moon" aria-hidden="true"></span></span>
                    <span class="menubar__status" data-local-status hidden></span>
                    <time class="menubar__time" data-local-time>--:--</time>
                    <a href="mailto:contact@wearebrothers.ch" data-contact class="menubar__cta glass-btn glass-btn--pink glass-btn--sm">Contact</a>
                    <button type="button" class="topbar__menu" id="menuToggle" aria-expanded="false" aria-controls="topbarPanel">
                        <span class="topbar__dots" aria-hidden="true">
                            <span></span><span></span><span></span><span></span>
                        </span>
                        <span class="sr-only">Menu</span>
                    </button>
                </div>
            </div>
            <div class="topbar__panel" id="topbarPanel">
                <div class="topbar__panel-inner">
                    <nav class="panel__nav" aria-label="Navigation">
                        <a href="/realisations" class="panel__link">Work<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg></a>
                        <a href="/services" class="panel__link">Services<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg></a>
                        <a href="/studio" class="panel__link">About<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg></a>
                        <a href="mailto:contact@wearebrothers.ch" data-contact class="panel__link">Contact<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg></a>
                    </nav>
                    <div class="panel__meta">
                        <p class="panel__row">
                            <span class="panel__key">Email</span>
                            <a href="mailto:contact@wearebrothers.ch" class="panel__value">contact@wearebrothers.ch</a>
                        </p>
                        <p class="panel__row">
                            <span class="panel__key">Studio</span>
                            <span class="panel__value">Lausanne, Suisse — <time data-local-time>--:--</time></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div class="topbar-scrim" id="topbarScrim"></div>
```

## 4. Le bouton de verre — `css/glass-btn.css`

La texture des bulles : une pilule de verre, un reflet qui suit la souris (`js/os/glass.js`) et un appui sur ressort.

```html
<a href="mailto:contact@wearebrothers.ch" data-contact class="glass-btn glass-btn--pink">Démarrer un projet</a>
<a href="/realisations" class="glass-btn">Voir le travail</a>
<button type="button" class="glass-btn glass-btn--sm">Petit bouton</button>
```

- Variantes : `.glass-btn--pink` (verre rose : l'action principale, une par écran) et `.glass-btn--sm` (barres, fenêtres, cartes).
- `:disabled` et `[aria-disabled="true"]` sont gérés.
- Le texte prend toujours `--glass-ink`, lisible même sur une surface sombre.
- Tout lien `data-contact` ouvre la fenêtre de contact (`js/contact`) ; sans JavaScript, il reste un lien mailto.

## 5. Les fenêtres de verre — `css/os-window.css`

```html
<div class="win">
    <div class="win__bar"><span class="win__lights"></span><span class="win__title"><span class="sym sym--site" aria-hidden="true"></span>lepetitcentral.ch</span></div>
    <div class="win__body"><img src="…" alt="…" width="1600" height="1000" loading="lazy" decoding="async"></div>
</div>
<span class="file-name">lepetitcentral.ch</span>
```

- Les pastilles WAB : trois carrés aux coins doux, rose, encre et blanc cerné.
- `.win__body` n'a pas de format imposé : donnez-lui le ratio natif de l'image (`aspect-ratio: 16 / 10` pour les captures, `4 / 5` pour les photos).
- Ces fenêtres décoratives imitent le verre **sans** `backdrop-filter`, par souci de performance.
- Les fenêtres qui s'ouvrent (fiche projet, dossier Work, terminal) sont gérées par `js/os` : n'en construisez pas à la main.

## 6. Le badge de section — `css/os-base.css`

```html
<p class="badge">FAQ</p>
```

## 7. Les bulles de verre — `css/os-bubbles.css`

```html
<div class="chat" aria-hidden="true">
    <p class="chat__ask">Un site qui tient sur mobile&nbsp;?</p>
    <p class="chat__reply">On le code de A à Z.</p>
</div>
```

Ce sont des répliques de mise en scène, jamais des témoignages : pas de nom, `aria-hidden`, le vrai contenu est porté par le titre et le texte voisins.

## 8. Les icônes — `assets/icons/`, `css/sym.css`

- **Symboles au trait** (masques CSS, couleur du texte) : `<span class="sym sym--search" aria-hidden="true"></span>`. Disponibles : `bolt`, `chart`, `file`, `folder`, `grid`, `mail`, `moon`, `notes`, `search`, `site`, `sun`, `team`, `terminal`, `trash`. Les fichiers `sym-check.svg` et `sym-plus.svg` existent aussi, à utiliser en `mask` direct (voir `desk-plans.css`, `desk-faq.css`).
- **Icônes d'app** (carré blanc aux coins à peine arrondis, éclairé d'en haut à gauche, pictogramme encre en léger relief ; Contact est la seule icône rose) : `<img class="app-icon" src="assets/icons/app-work.svg?v=3" alt="" width="56" height="56">`. Disponibles : `work`, `services`, `about`, `notes`, `terminal`, `mail`, `trash`, `file`.
- Seuls les oiseaux et le grand « WAB. » du pied de page restent en pixel art. Aucune autre icône pixel.

## 8 bis. L'autocollant — `css/os-sticker.css`

Une seule version pour tout le site (imprimé : encre rose, grain, reflet de vinyle, ombre d'objet posé). Toujours dans un conteneur `aria-hidden`, positionné par la feuille de la page.

```html
<span class="sticker"><span class="sticker__hello">HELLO</span><span class="sticker__mine">my name is</span><span class="sticker__name" translate="no">WAB.</span></span>
```

Kaomoji : deux sur tout le site (le salut de l'accueil, le « (o_O) » de la 404). N'en ajoutez pas.

## 8 ter. Les oiseaux — `js/birds/frames.js`

Palette resserrée, une seule logique : un oiseau **posé** (`data-color="0"` ou `"4"`) est rose WAB (en groupe, il alterne avec le rose poudré) ; les oiseaux **en vol** sont porcelaine ou rose poudré (`FLIGHT_COLORS`). Régime `rare` : deux ou trois oiseaux.

## 9. Le pied de page — `css/os-footer.css`

À copier tel quel. Les pixels apparaissent de gauche à droite si `js/desk/pixels.js` et `watch.js` sont chargés ; sans eux, le nom reste simplement visible.

```html
    <footer class="foot">
        <div class="desk-wrap">
            <div class="foot__cols">
                <nav class="foot__col" aria-label="Pages">
                    <p class="foot__label">Pages</p>
                    <a href="/realisations">Work</a>
                    <a href="/services">Services</a>
                    <a href="/studio">About</a>
                </nav>
                <nav class="foot__col" aria-label="Expertises">
                    <p class="foot__label">Expertises</p>
                    <a href="/creation-site-internet-lausanne">Création de site internet</a>
                    <a href="/applications">Applications</a>
                </nav>
                <div class="foot__col">
                    <p class="foot__label">Contact</p>
                    <a href="mailto:contact@wearebrothers.ch">contact@wearebrothers.ch</a>
                    <span>Lausanne, Suisse — <time data-local-time>--:--</time></span>
                </div>
                <p class="foot__note">Codé à la main à Lausanne, oiseaux compris.</p>
            </div>
            <svg class="pixel-name" data-watch="once" viewBox="-1 -1 202 72" role="img" aria-label="WAB.">
                <defs>
                    <symbol id="wab-px" viewBox="0 0 10 10" width="10" height="10" overflow="visible"><rect class="px__edge" x="0.5" y="1.6" width="9" height="9" rx="0.6"/><rect class="px__body" x="0.5" y="0.5" width="9" height="9" rx="0.6"/></symbol>
                </defs>
                <use class="px" href="#wab-px" x="0" y="0"/>
                <use class="px" href="#wab-px" x="40" y="0"/>
                <use class="px" href="#wab-px" x="0" y="10"/>
                <use class="px" href="#wab-px" x="40" y="10"/>
                <use class="px" href="#wab-px" x="0" y="20"/>
                <use class="px" href="#wab-px" x="40" y="20"/>
                <use class="px" href="#wab-px" x="0" y="30"/>
                <use class="px" href="#wab-px" x="20" y="30"/>
                <use class="px" href="#wab-px" x="40" y="30"/>
                <use class="px" href="#wab-px" x="0" y="40"/>
                <use class="px" href="#wab-px" x="20" y="40"/>
                <use class="px" href="#wab-px" x="40" y="40"/>
                <use class="px" href="#wab-px" x="0" y="50"/>
                <use class="px" href="#wab-px" x="20" y="50"/>
                <use class="px" href="#wab-px" x="40" y="50"/>
                <use class="px" href="#wab-px" x="10" y="60"/>
                <use class="px" href="#wab-px" x="30" y="60"/>
                <use class="px" href="#wab-px" x="70" y="0"/>
                <use class="px" href="#wab-px" x="80" y="0"/>
                <use class="px" href="#wab-px" x="90" y="0"/>
                <use class="px" href="#wab-px" x="60" y="10"/>
                <use class="px" href="#wab-px" x="100" y="10"/>
                <use class="px" href="#wab-px" x="60" y="20"/>
                <use class="px" href="#wab-px" x="100" y="20"/>
                <use class="px" href="#wab-px" x="60" y="30"/>
                <use class="px" href="#wab-px" x="70" y="30"/>
                <use class="px" href="#wab-px" x="80" y="30"/>
                <use class="px" href="#wab-px" x="90" y="30"/>
                <use class="px" href="#wab-px" x="100" y="30"/>
                <use class="px" href="#wab-px" x="60" y="40"/>
                <use class="px" href="#wab-px" x="100" y="40"/>
                <use class="px" href="#wab-px" x="60" y="50"/>
                <use class="px" href="#wab-px" x="100" y="50"/>
                <use class="px" href="#wab-px" x="60" y="60"/>
                <use class="px" href="#wab-px" x="100" y="60"/>
                <use class="px" href="#wab-px" x="120" y="0"/>
                <use class="px" href="#wab-px" x="130" y="0"/>
                <use class="px" href="#wab-px" x="140" y="0"/>
                <use class="px" href="#wab-px" x="150" y="0"/>
                <use class="px" href="#wab-px" x="120" y="10"/>
                <use class="px" href="#wab-px" x="160" y="10"/>
                <use class="px" href="#wab-px" x="120" y="20"/>
                <use class="px" href="#wab-px" x="160" y="20"/>
                <use class="px" href="#wab-px" x="120" y="30"/>
                <use class="px" href="#wab-px" x="130" y="30"/>
                <use class="px" href="#wab-px" x="140" y="30"/>
                <use class="px" href="#wab-px" x="150" y="30"/>
                <use class="px" href="#wab-px" x="120" y="40"/>
                <use class="px" href="#wab-px" x="160" y="40"/>
                <use class="px" href="#wab-px" x="120" y="50"/>
                <use class="px" href="#wab-px" x="160" y="50"/>
                <use class="px" href="#wab-px" x="120" y="60"/>
                <use class="px" href="#wab-px" x="130" y="60"/>
                <use class="px" href="#wab-px" x="140" y="60"/>
                <use class="px" href="#wab-px" x="150" y="60"/>
                <use class="px" href="#wab-px" x="180" y="50"/>
                <use class="px" href="#wab-px" x="190" y="50"/>
                <use class="px" href="#wab-px" x="180" y="60"/>
                <use class="px" href="#wab-px" x="190" y="60"/>
            </svg>
            <p class="foot__legal">&copy; 2026 WeAreBrothers Studio</p>
        </div>
    </footer>
```

## 10. Le dock — `css/os-dock.css`, `js/os/dock.js`

Sur ordinateur seulement (souris, 900 px et plus). Il se range quand on descend la page. Placez-le juste avant `</body>`. Le lien Lettre pointe vers `/#lettre` hors de l'accueil, Services vers `/services`.

```html
    <nav class="dock" aria-label="Dock" data-dock>
        <ul class="dock__apps">
            <li><a class="dock__item" href="/realisations" data-app="work"><img class="app-icon" src="assets/icons/app-work.svg?v=3" alt="" width="48" height="48"><span class="dock__label">Work</span></a></li>
            <li><a class="dock__item" href="#services" data-app="services"><img class="app-icon" src="assets/icons/app-services.svg?v=3" alt="" width="48" height="48"><span class="dock__label">Services</span></a></li>
            <li><a class="dock__item" href="/studio" data-app="about"><img class="app-icon" src="assets/icons/app-about.svg?v=3" alt="" width="48" height="48"><span class="dock__label">About</span></a></li>
            <li><a class="dock__item" href="#lettre" data-app="notes"><img class="app-icon" src="assets/icons/app-notes.svg?v=3" alt="" width="48" height="48"><span class="dock__label">Lettre</span></a></li>
            <li><button class="dock__item" type="button" data-app="terminal" data-js-only><img class="app-icon" src="assets/icons/app-terminal.svg?v=3" alt="" width="48" height="48"><span class="dock__label">Terminal</span></button></li>
            <li><a class="dock__item" href="mailto:contact@wearebrothers.ch" data-contact data-app="contact"><img class="app-icon" src="assets/icons/app-mail.svg?v=3" alt="" width="48" height="48"><span class="dock__label">Contact</span></a></li>
        </ul>
        <ul class="dock__shelf" data-dock-shelf aria-label="Fenêtres réduites" hidden></ul>
    </nav>
```

## 11. Le système (⌘K, terminal, fenêtres, clic droit) — `js/os/index.js`

Un seul module à charger : `<script type="module" src="js/os/index.js?v=2"></script>`. Il apporte :
- la palette ⌘K / Ctrl+K, ouverte aussi par le bouton `[data-palette-open]` de la barre ;
- le terminal (dock, palette) ;
- le menu du clic droit sur le fond ;
- la lumière de l'heure de Lausanne (`data-sky` sur la racine) ;
- la complication de Lausanne : un petit cadran devant l'heure de la barre (`dial.js`, styles dans `os-sky.css`) ;
- l'ombre d'un oiseau qui passe sur le bureau, de loin en loin (`shade.js`, ordinateur seulement, jamais sous « réduire les animations ») ;
- le reflet des boutons de verre ;
- les fenêtres à la demande : fiche projet lue sur `/realisations`, dossier Work.

Une carte qui doit ouvrir la fiche d'un projet : `<a href="/realisations#zinema" data-card="zinema" data-title="zinema.ch">…</a>`. Sans JavaScript, c'est un simple lien.

## 12. Règles communes

- Rien d'inventé : contenus réels de `index.html`, `work.html`, `services.html`, `about.html`, `PRODUCT.md`. Prix publics (Eliott, 3.10) : site vitrine 1'000 – 2'500 CHF, site et outils 2'500 – 7'000 CHF, expérience sur mesure dès 7'000 CHF sur devis.
- Ponctuation : `&nbsp;` avant `? ! : ;` ; jamais de `?` ou `!` seul en début de ligne (vérifier à 320 px).
- Mobile : une seule ligne grise secondaire par bloc.
- Contraste AA. `prefers-reduced-motion` fige tout.
- Fichiers de moins de 200 lignes. JavaScript en `// @ts-check`, zéro `console.log`.
- Numéros `?v=` à jour à chaque modification.
