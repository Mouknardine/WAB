# WAB OS — composants partagés

Référence pour toutes les pages (Work, Services, About, Création de site, Applications, 404). Propriétaire : l'agent de l'accueil. **Ne modifiez pas ces fichiers depuis une page** : si un composant manque, signalez-le ; les styles propres à une page vont dans `css/page-*.css`.

Direction **Klein** (3 octobre 2026, branche `klein`) : la structure de heyclicky.com gardée telle quelle, l'aspect d'agentcard.sh — un seul accent, le bleu Klein, sur blanc net et gris chaud ; écrans bleus à lignes horizontales, bords tramés en pixels, grain fin ; boutons en touches de clavier ; Instrument Sans pour le texte, Sligoil en signature. Détails et décisions : `DESIGN-SYSTEM.md`, section « Klein ».

## 1. Mise en place d'une page

1. `<body class="os">` — c'est la classe `os` qui porte les jetons, le fond blanc à grain fin et le bleu système (sélection, focus, curseur). Ajoutez `data-birds="rare"` pour deux à quatre oiseaux (l'accueil), rien pour le régime calme.
2. Dans le `<head>`, après les balises SEO :

```html
    <!-- Avant tout rendu (déjà en place sur chaque page) -->
    <script>document.documentElement.classList.replace('no-js', 'js');</script>

    <!-- Polices servies depuis le site : Instrument Sans (texte et
         titres), Sligoil en signature (chargée à la demande). -->
    <link rel="preload" href="assets/fonts/InstrumentSans-Var.woff2" as="font" type="font/woff2" crossorigin>

    <!-- WAB OS : composants partagés -->
    <link rel="stylesheet" href="css/base.css?v=34">
    <link rel="stylesheet" href="css/base-ui.css?v=1">
    <link rel="stylesheet" href="css/nav-panel.css?v=2">
    <link rel="stylesheet" href="css/contact-modal.css?v=8">
    <link rel="stylesheet" href="css/contact-form.css?v=4">
    <link rel="stylesheet" href="css/os-tokens.css?v=4">
    <link rel="stylesheet" href="css/os-base.css?v=3">
    <link rel="stylesheet" href="css/os-sky.css?v=3">
    <link rel="stylesheet" href="css/sym.css?v=4">
    <link rel="stylesheet" href="css/key-btn.css?v=1">
    <link rel="stylesheet" href="css/os-bar.css?v=3">
    <link rel="stylesheet" href="css/os-window.css?v=3">
    <link rel="stylesheet" href="css/os-bubbles.css?v=2">
    <link rel="stylesheet" href="css/os-footer.css?v=3">
    <link rel="stylesheet" href="css/os-dock.css?v=4">
    <link rel="stylesheet" href="css/os-overlay.css?v=3">
    <link rel="stylesheet" href="css/os-sticker.css?v=2"> <!-- si la page pose l'autocollant -->
    <!-- puis la ou les feuilles propres à la page (css/page-*.css) -->

    <script src="nav-clock.js?v=3" defer></script>
    <script src="js/nav.js?v=6" defer></script>
    <script type="module" src="js/birds/index.js?v=9"></script>
    <script type="module" src="js/contact/index.js?v=11"></script>
    <script type="module" src="js/os/index.js?v=4"></script>
```

3. Ne posez **aucun fond sur `body`** : les oiseaux sont un canevas fixe à z-index négatif qui se peint entre le fond de la racine (blanc, grain, lumière de l'heure) et le corps. Les fonds de section se posent sur les sections.
5. **Surface bleue** : `class="… on-klein"` + `background: var(--klein-screen)` (ou `--klein-screen-flat` pour un écran étroit). `.on-klein` redéfinit `--ink`, `--ink-muted`, `--accent`, `--line`, `--on-accent`, `--mark` : le texte, les touches et la sélection s'inversent seuls. Exemples : le premier écran de l'accueil, le pied de page.
4. Pour un contenu borné à la colonne du site : `.os-wrap` (largeur `--measure` + gouttières).

## 2. Jetons — `css/os-tokens.css`

Toutes les valeurs vivent ici, en OKLCH, aucune valeur en dur ailleurs. Les principaux :

| Jeton | Rôle |
|---|---|
| `--klein` | le bleu Klein, seul accent : aplats, touches, signes ; texte blanc dessus 8,5:1, lisible en petit texte sur blanc (8,5:1) |
| `--klein-ink`, `--klein-deep`, `--klein-hi` | bleu des petits textes sur bleu clair (8,2:1) ; liserés et lignes sombres ; halo des écrans |
| `--klein-tint`, `--klein-wash`, `--klein-soft` | barre de fenêtre ; survols ; bleu lisible sur surface sombre |
| `--on-klein` | le blanc fixe posé sur le Klein (ne s'inverse jamais) |
| `--accent`, `--on-accent`, `--mark` | texte d'accent et focus ; texte sur l'accent ; sélection (s'inversent sur `.on-klein`) |
| `--desk`, `--paper`, `--panel` | blanc de la page ; blanc des cartes ; gris chaud des grands panneaux |
| `--ink`, `--ink-muted`, `--ink-faint` | encre 18,8:1, gris 7,1:1 et 5,5:1 sur blanc |
| `--line`, `--line-strong`, `--edge` | filets ; liseré d'un pixel des objets |
| `--klein-screen`, `--klein-screen-flat`, `--scan-lines`, `--grain` | l'écran bleu à lignes d'écran (avec ou sans vignette) ; la ligne seule ; le grain |
| `--dither-top/bottom/left/right`, `--dither` | bandes de trame en pixels (`assets/textures/`), en masque |
| `--relief`, `--shadow-object`, `--shadow-soft`, `--shadow-lift`, `--sheet` | relief éclairé d'en haut ; ombres ; la feuille décalée de 7 px (effet de pile) |
| `--key-klein`, `--key-light` (+ `-relief`, `--key-pressed`) | les touches |
| `--win-bar`, `--win-bar-ink`, `--win-frame`, `--win-frame-color`, `--win-tilt` | la fenêtre |
| `--r-win` 12, `--r-panel` 20, `--r-ctl` 8, `--r-key` 6, `--r-icon` 22 % | les rayons |
| `--font-display` (Instrument Sans), `--font-mono` (Sligoil), `--w-regular/medium/strong` 400/500/600 | typo |
| `--t-*`, `--track-optical`, `--track-caps`, `--gutter`, `--section`, `--measure` | échelle et rythme |
| `--sky-dawn/day/dusk/night` | la lumière de l'heure (blanc froid, voile bleu) |
| `--term-*` | surfaces sombres (terminal) |
| `--dur-1/2/3`, `--ease-out`, `--ease-spring` | mouvement |
| `--z-*` | calques |

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
                    <a href="mailto:contact@wearebrothers.ch" data-contact class="menubar__cta key-btn key-btn--klein key-btn--sm">Contact</a>
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

## 4. Le bouton « touche » — `css/key-btn.css`

Un rectangle aux coins de 6 px, en relief comme une touche de clavier : reflet blanc sur l'arête haute, pénombre de 2 px en bas, liseré d'un pixel, ombre courte. À l'appui, la touche descend d'un pixel et son ombre se résorbe (150 ms).

```html
<a href="mailto:contact@wearebrothers.ch" data-contact class="key-btn key-btn--klein">Démarrer un projet</a>
<a href="/realisations" class="key-btn">Voir le travail</a>
<button type="button" class="key-btn key-btn--sm">Petit bouton</button>
```

- `.key-btn` : touche blanche, encre fixe `--glass-ink`. `.key-btn--klein` : touche bleue, texte blanc 8,5:1 et petite flèche ↗ peinte en masque — l'action principale, une par écran. `.key-btn--sm` : barres, fenêtres, cartes.
- Sur une surface `.on-klein`, la touche bleue passe en blanc à texte Klein, la blanche en touche translucide à texte blanc : rien à faire côté page.
- `:disabled` et `[aria-disabled="true"]` sont gérés ; sous « réduire les animations », l'appui ne bouge plus.
- Les boutons du formulaire de contact (`.btn--solid`, `.btn--ghost`, `base-ui.css`) ont la même matière.
- Tout lien `data-contact` ouvre la fenêtre de contact (`js/contact`) ; sans JavaScript, il reste un lien mailto.

## 5. Les fenêtres — `css/os-window.css`

```html
<div class="win">
    <div class="win__bar"><span class="win__lights"></span><span class="win__title">lepetitcentral.ch</span></div>
    <div class="win__body"><img src="…" alt="…" width="1600" height="1000" loading="lazy" decoding="async"></div>
</div>
<span class="file-name">lepetitcentral.ch</span>
```

- La barre : bleu clair (`--win-bar`), le `span.win__lights` vide devient le ↳ à gauche, le titre est centré en Sligoil, la barre porte elle-même le `[*]` à droite. Un symbole `.sym` dans le titre est masqué : le nom suffit.
- `.win--framed` : la fenêtre mise en avant (une par écran au plus) — cadre Klein de 12 px dont le bord intérieur s'émiette en pixels (bandes `--dither-*` en masque).
- `.win--tilt` / `.win--tilt-r` : inclinaison de ±1,2° pour les cartes et les citations.
- `.win__body` n'a pas de format imposé : donnez-lui le ratio natif de l'image (`16 / 10` pour les captures, `4 / 5` pour les photos).
- Aucune n'a de `backdrop-filter`, par souci de performance. Les fenêtres qui s'ouvrent (fiche projet, dossier Work, terminal) sont gérées par `js/os` (`os-win.css` : vrais boutons fermer Klein, réduire encre, agrandir blanc).
- Écran derrière une fenêtre (accueil, Work, Services) : `background: var(--klein-screen-flat)`, liseré `--klein-deep`, feuille `--sheet`.

## 6. Le badge de section — `css/os-base.css`

```html
<p class="badge">FAQ</p>
```

Une étiquette Sligoil en capitales, un petit carré Klein devant, posée comme une touche.

## 7. Les bulles — `css/os-bubbles.css`

```html
<div class="chat" aria-hidden="true">
    <p class="chat__ask">Un site qui tient sur mobile&nbsp;?</p>
    <p class="chat__reply">On le code de A à Z.</p>
</div>
```

La question en gris chaud, la réponse de WAB en bleu Klein (texte blanc). Ce sont des répliques de mise en scène, jamais des témoignages : pas de nom, `aria-hidden`, le vrai contenu est porté par le titre et le texte voisins.

## 8. Les icônes — `assets/icons/`, `css/sym.css`

- **Symboles au trait** (masques CSS, couleur du texte) : `<span class="sym sym--search" aria-hidden="true"></span>`. Disponibles : `arrow` (↗), `bolt`, `chart`, `file`, `folder`, `grid`, `mail`, `moon`, `notes`, `search`, `site`, `sun`, `team`, `terminal`, `trash`, `turn` (↳). `sym-check.svg` et `sym-plus.svg` s'emploient en `mask` direct.
- **Icônes d'app** : des touches de clavier 3D (jupe, face éclairée d'en haut à gauche, pictogramme gravé). Blanches, sauf Terminal (encre) et Contact (Klein) : `<img class="app-icon" src="assets/icons/app-work.svg?v=4" alt="" width="56" height="56">`. Disponibles : `work`, `services`, `about`, `notes`, `terminal`, `mail`, `trash`, `file`. Générées par un script (lumière commune) : ne pas les retoucher à la main.
- **Objets en relief** (`assets/objects/obj-*.svg` : `window`, `pencil`, `card`, `tee`) : décor de l'accueil, dans les marges, sur grand écran (`css/desk-floaters.css`).
- **Objets 3D du premier écran** (`assets/objects/3d/hero-<nom>-360.webp` et `-720.webp` : `window`, `phone`, `code`, `gear`, `sparkle`, `pencil`, `card`, `loupe`, `key`, `cursor`) : propres à l'accueil (`css/desk-hero.css`, `desk-scatter.css`, `desk-scatter-wide.css`), multicolores par exception. Toujours `width`/`height`, `srcset` aux largeurs réelles des fichiers, `sizes` à la largeur affichée, `decoding="async"`, `alt=""`, `draggable="false"`, jamais `loading="lazy"`.
- Seuls les oiseaux restent en pixel art ; le grand « WAB. » du pied de page est en lignes.

## 8 bis. L'autocollant — `css/os-sticker.css`

Une seule version pour tout le site : encre Klein, marge de découpe blanche de 3 px (il se détache du blanc comme du bleu), grain, reflet de vinyle, ombre d'objet posé. Toujours dans un conteneur `aria-hidden`, positionné par la feuille de la page.

```html
<span class="sticker"><span class="sticker__hello">HELLO</span><span class="sticker__mine">my name is</span><span class="sticker__name" translate="no">WAB.</span></span>
```

Kaomoji : deux sur tout le site (le salut de l'accueil, le « (o_O) » de la 404). N'en ajoutez pas.

## 8 ter. Les oiseaux — `js/birds/frames.js`

Palette bleu, encre et blanc, une seule logique : un oiseau **posé** (`data-color="0"` ou `"4"`) est bleu Klein (en groupe, il alterne avec le bleu ciel) ; les oiseaux **en vol** sont porcelaine ou bleu ciel (`FLIGHT_COLORS`). Bec bleu pâle. Régime `rare` : deux ou trois oiseaux.

## 9. Le pied de page — `css/os-footer.css`

À copier tel quel : surface Klein à lignes d'écran (`.on-klein`), colonnes de liens, bandeau qui fait défiler les projets en ligne (arrêté au survol et sous « réduire les animations »), puis « WAB. » en lignes horizontales, une lettre par cellule. Les cases apparaissent de gauche à droite si `js/desk/pixels.js` et `watch.js` sont chargés ; sans eux, le nom reste visible. Sur ordinateur, le pied de page réserve sous lui la place du dock (le bleu va jusqu'en bas).

```html
    <footer class="foot on-klein">
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
        </div>
        <!-- Le bandeau : les projets en ligne, en boucle (décor : la
             liste réelle vit sur /realisations). -->
        <div class="foot__ticker" aria-hidden="true" translate="no"><ul class="foot__track"><li>Zinéma</li><li>Le P’tit Central</li><li>Amarte Studio</li><li>La Slack</li><li>Nadège Mouine</li><li>Commissione Entretien</li><li>LAZIZZE DJ</li><li>Maison Alliani</li><li>LE MEMO</li></ul><ul class="foot__track"><li>Zinéma</li><li>Le P’tit Central</li><li>Amarte Studio</li><li>La Slack</li><li>Nadège Mouine</li><li>Commissione Entretien</li><li>LAZIZZE DJ</li><li>Maison Alliani</li><li>LE MEMO</li></ul></div>
        <div class="desk-wrap">
            <svg class="pixel-name" data-watch="once" viewBox="-1 -1 202 72" role="img" aria-label="WAB.">
                <defs>
                    <symbol id="wab-px" viewBox="0 0 10 10" width="10" height="10" overflow="visible"><rect class="px__line" x="-0.1" y="0.6" width="10.2" height="1.9"/><rect class="px__line" x="-0.1" y="3.9" width="10.2" height="1.9"/><rect class="px__line" x="-0.1" y="7.2" width="10.2" height="1.9"/></symbol>
                </defs>
                <!-- … les <use class="px" href="#wab-px" x="…" y="…"/> du nom, copiés depuis index.html … -->
            </svg>
            <p class="foot__legal">&copy; 2026 WeAreBrothers Studio</p>
        </div>
    </footer>
```

## 10. Le dock — `css/os-dock.css`, `js/os/dock.js`

Sur ordinateur seulement (souris, 900 px et plus) : un plateau de verre gris fumé, comme la barre flottante d'agentcard, et les apps en touches. Il se range quand on descend la page. Placez-le juste avant `</body>`. Le lien Lettre pointe vers `/#lettre` hors de l'accueil, Services vers `/services`.

```html
    <nav class="dock" aria-label="Dock" data-dock>
        <ul class="dock__apps">
            <li><a class="dock__item" href="/realisations" data-app="work"><img class="app-icon" src="assets/icons/app-work.svg?v=4" alt="" width="48" height="48"><span class="dock__label">Work</span></a></li>
            <li><a class="dock__item" href="#services" data-app="services"><img class="app-icon" src="assets/icons/app-services.svg?v=4" alt="" width="48" height="48"><span class="dock__label">Services</span></a></li>
            <li><a class="dock__item" href="/studio" data-app="about"><img class="app-icon" src="assets/icons/app-about.svg?v=4" alt="" width="48" height="48"><span class="dock__label">About</span></a></li>
            <li><a class="dock__item" href="#lettre" data-app="notes"><img class="app-icon" src="assets/icons/app-notes.svg?v=4" alt="" width="48" height="48"><span class="dock__label">Lettre</span></a></li>
            <li><button class="dock__item" type="button" data-app="terminal" data-js-only><img class="app-icon" src="assets/icons/app-terminal.svg?v=4" alt="" width="48" height="48"><span class="dock__label">Terminal</span></button></li>
            <li><a class="dock__item" href="mailto:contact@wearebrothers.ch" data-contact data-app="contact"><img class="app-icon" src="assets/icons/app-mail.svg?v=4" alt="" width="48" height="48"><span class="dock__label">Contact</span></a></li>
        </ul>
        <ul class="dock__shelf" data-dock-shelf aria-label="Fenêtres réduites" hidden></ul>
    </nav>
```

## 11. Le système (⌘K, terminal, fenêtres, clic droit) — `js/os/index.js`

Un seul module à charger : `<script type="module" src="js/os/index.js?v=4"></script>`. Il apporte :
- la palette ⌘K / Ctrl+K, ouverte aussi par le bouton `[data-palette-open]` de la barre ;
- le terminal (dock, palette) ;
- le menu du clic droit sur le fond ;
- la lumière de l'heure de Lausanne (`data-sky` sur la racine) ;
- la complication de Lausanne : un petit cadran devant l'heure de la barre (`dial.js`, styles dans `os-sky.css`) ;
- l'ombre d'un oiseau qui passe sur le bureau, de loin en loin (`shade.js`, ordinateur seulement, jamais sous « réduire les animations ») ;
- les fenêtres à la demande : fiche projet lue sur `/realisations`, dossier Work.

Une carte qui doit ouvrir la fiche d'un projet : `<a href="/realisations#zinema" data-card="zinema" data-title="zinema.ch">…</a>`. Sans JavaScript, c'est un simple lien.

## 12. Règles communes

- Rien d'inventé : contenus réels de `index.html`, `work.html`, `services.html`, `about.html`, `PRODUCT.md`. Prix publics (Eliott, 3.10) : site vitrine 1'000 – 2'500 CHF, site et outils 2'500 – 7'000 CHF, expérience sur mesure dès 7'000 CHF sur devis.
- Ponctuation : `&nbsp;` avant `? ! : ;` ; jamais de `?` ou `!` seul en début de ligne (vérifier à 320 px).
- Mobile : une seule ligne grise secondaire par bloc.
- Contraste AA. `prefers-reduced-motion` fige tout.
- Fichiers de moins de 200 lignes. JavaScript en `// @ts-check`, zéro `console.log`.
- Numéros `?v=` à jour à chaque modification.
