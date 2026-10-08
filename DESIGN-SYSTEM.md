# WAB. — Design système

État du site en ligne au **8 octobre 2026** (branche `main`). Ce document décrit ce qui existe dans le code ; les composants et leur balisage sont dans `OS-COMPONENTS.md`, le produit (public, offres, ton) dans `PRODUCT.md`. `FINITION-PRO.md` et `DIRECTION-ARTISTIQUE.md` sont des historiques.

Si ce document et le code divergent, **le code fait foi** : corrigez le document.

---

## 1. Intention

**Un bureau d'ordinateur rangé, en six couleurs.**

Le site est un « WAB OS » : un bureau blanc à trame de petits points gris et grain fin, sur lequel sont posés des objets d'interface — des touches de clavier en relief (boutons, logo, nom du studio), des fenêtres de navigateur (captures des projets), des cartes de section gris chaud, une barre en pilule en haut et un dock en bas. Six teintes vives se répartissent les blocs, une teinte par bloc.

Le décor dit « studio de création » ; la mise en page dit « on peut nous confier un budget » : grilles régulières, rien de penché, aucun ornement, ton de grande agence. Le site est lui-même la première démonstration du savoir-faire vendu.

## 2. Couleur

Toutes les valeurs sont en OKLCH, dans deux fichiers seulement : `css/os-tokens.css` (neutres, matières, dérivés) et `css/os-tints.css` (les six teintes). Aucune couleur en dur ailleurs.

### Les neutres (`os-tokens.css`)

| Jeton | Rôle |
|---|---|
| `--desk` | le blanc à peine grisé du bureau (sous la trame de points `--desk-dot`) |
| `--paper` | blanc pur : cartes, fenêtres, barre, pied de page |
| `--panel` | gris chaud des cartes de section `.os-card` et des bulles-questions |
| `--ink`, `--ink-muted`, `--ink-faint` | encre (18,8:1), gris (7,1:1), gris clair (5,5:1) sur blanc |
| `--line`, `--line-strong`, `--edge` | filets ; liseré d'un pixel des objets |

### Les six teintes (`os-tints.css`)

Un bloc prend une teinte avec l'attribut `data-tint="…"`. Sans attribut, c'est le bleu (Klein).

| `data-tint` | Teinte | Texte posé sur l'aplat (`--on-klein`) |
|---|---|---|
| `bleu` | bleu électrique, le Klein (défaut) | blanc |
| `ciel` | bleu ciel | encre |
| `vert` | vert vif | encre |
| `jaune` | jaune citron | encre |
| `rose` | rose | encre |
| `rouge` | rouge | blanc |

Chaque teinte redéfinit la même gamme — les noms gardent le préfixe `klein` par héritage :

| Jeton | Rôle |
|---|---|
| `--klein` | l'aplat (touches principales, pixels, bulles-réponses, carré des badges) |
| `--klein-hi` | sa lumière (reflets, halo) |
| `--klein-ink` | la teinte lisible en petit texte sur blanc (≥ 4,5:1) |
| `--klein-deep` | liseré des touches, lignes sombres |
| `--klein-tint`, `--klein-wash` | survols, fonds très clairs (`.os-card--wash`) |
| `--klein-soft` | la teinte lisible sur fond sombre (terminal) |
| `--on-klein` | le texte posé sur l'aplat : blanc sur bleu et rouge, **encre** sur les teintes claires |
| `--klein-pair` | le texte d'une touche claire posée sur l'aplat |
| `--klein-text` | la teinte quand elle écrit sur blanc : l'aplat pour bleu et rouge, sa version foncée pour les teintes claires |

**Les dérivés suivent seuls.** `os-tokens.css` recalcule sur chaque `[data-tint]` tout ce qui dépend de la gamme : `--accent`, `--on-accent`, `--mark` (sélection), l'écran à lignes (`--klein-screen`, `--klein-screen-flat`), les touches (`--key-klein`…), les bulles (`--bubble-reply…`), le cadre des fenêtres. Un composant n'a jamais besoin de savoir dans quelle teinte il se trouve.

**Surface pleine.** Un élément posé sur l'aplat prend la classe `.on-klein` : l'encre, les gris, les filets, la sélection et les touches s'inversent pour rester lisibles (blanc sur bleu/rouge, encre sur les teintes claires).

### Règles de couleur

- Une teinte par bloc. Les teintes se répartissent sur la page (le sommaire du dock en montre une par section) ; on évite deux sections voisines de même teinte.
- Ne jamais écrire du texte avec `--klein` directement : utiliser `--klein-text` (ou `--klein-ink` en petit), sinon le jaune et le vert deviennent illisibles sur blanc.
- Le jaune n'est pas utilisé pour des signes sur une touche blanche (trop pâle) — `js/desk/scramble.js` l'exclut.
- Pas de dégradé décoratif, pas de violet, pas de seconde palette.

## 3. Typographie

- **Instrument Sans** (`--font-display`), fichier variable 400–700 auto-hébergé (`assets/fonts/InstrumentSans-Var.woff2`, préchargé par chaque page) : tout le texte et les titres.
- **Sligoil** (`--font-mono`), trois fichiers statiques : la signature seulement — badges de section, adresse des fenêtres, `kbd`, `time`, `code`, noms de fichiers, terminal.
- Graisses : `--w-regular` 400 (texte), `--w-medium` 500 (titres), `--w-strong` 600 (boutons). Jamais de gras décoratif.
- Échelle : `--t-cap` 12 px, `--t-small` 14 px, `--t-body` 16 px, `--t-lede` 17–20 px, `--t-title` 28–40 px. Titres h1–h3 en interlettrage optique `--track-optical` et `text-wrap: balance` (`os-base.css`). Capitales seulement en Sligoil (`--track-caps`).
- Pas de chiffres en exposant, pas de titre géant hors du premier écran.
- Ponctuation française : `&nbsp;` avant `? ! : ;` ; jamais de `?` ou `!` seul en début de ligne (vérifier jusqu'à 320 px).

## 4. Espace et grille

- `--gutter` : 16 à 40 px de marge latérale ; `--measure` : 1120 px de colonne. `.desk-wrap` et `.os-wrap` bornent le contenu (identiques).
- `--section` : 80 à 128 px entre sections (`.block`).
- `--bar-h` : la place de la barre flottante, réservée en haut (`scroll-padding-top`) ; `--dock-space` : la place du dock en bas sur ordinateur.
- Grilles régulières : colonnes égales, hauteurs égales ; 1 colonne au téléphone, cartes qui défilent au doigt quand une rangée ne tient pas.
- Mobile d'abord : une seule ligne grise secondaire par bloc au téléphone — fondre ou masquer le reste.

## 5. Matières, relief, rayons

- **Fond** : `--desk` + grain fractal (`--grain`) sur la racine, trame de points fixe (`.os::before`, `os-base.css`). La lumière du haut de page suit l'heure de Lausanne (`data-sky` posé par `js/os/sky.js`, `css/os-sky.css`) — très discrète.
- **Relief** : éclairé d'en haut — `--relief` (fil blanc en haut, pénombre en bas), ombres `--shadow-soft`, `--shadow-object`, `--shadow-lift` ; `--sheet` : la feuille décalée de 7 px sous une carte (effet de pile).
- **Verre** : `--glass*`, réservé à la barre du haut, au dock et aux fenêtres ouvertes.
- **Rayons** : `--r-win` 12 (fenêtres), `--r-panel` 20 (cartes de section), `--r-ctl` 8, `--r-key` 6 (touches, badges), `--r-pill`.
- **Trame en pixels** (`--dither-*`, `assets/textures/`) : ne sert plus qu'au cadre `.win--framed` de la 404.

## 6. Mouvement et son

- Trois durées : `--dur-1` 150 ms (retour d'appui, survol), `--dur-2` 250 ms (changement d'état), `--dur-3` 400 ms (déplacement). Courbes `--ease-out` et `--ease-spring` (rebond de 3 %).
- Apparitions au défilement : `.reveal` (`js/reveal.js`, `base-ui.css`), une seule fois, en décalé dans un `[data-reveal-group]`.
- **Pixels** : au premier écran de l'accueil, le canevas se creuse de gros pixels de couleur au passage de la souris ou du doigt, puis s'éteint case par case ; des motifs en escalier restent dans les marges de toutes les pages (survol : ils bougent ; clic : ils se redessinent).
- **Bruit de clavier** : un « clac » mécanique synthétisé (Web Audio, aucun fichier) à l'appui d'une touche (`js/os/keysound.js`), uniquement sur un geste du visiteur.
- `prefers-reduced-motion` : tout se fige, le son se coupe, le nom ne se brouille plus, pas de passage fantôme des pixels.
- Rotations : seulement fonctionnelles (le + qui devient ×, le menu). **Rien de penché.**

## 7. Signatures

- **Le nom en touches** : « WeAreBrothers. » tapé en touches de clavier en bas du premier écran de l'accueil (`css/desk-keys.css`), les initiales W, A, B colorées (vert, jaune, rose), le point en touche bleue. Survolée, une touche se brouille en symboles puis revient (`js/desk/scramble.js`). Le H1 garde le texte lisible pour Google et les lecteurs d'écran.
- **Le logo** : « W A B . » en mini-touches (vert, jaune, rose, point) dans la barre du haut et le pied de page.
- **Favicon** : la touche rose « B » (`favicon.ico`, `favicon.png`, `apple-touch-icon.png`, icônes `assets/icon-*.png`).
- **Image de partage** : `assets/og-image.jpg` (1200 × 630, touches et pixels).
- **Bulles de dialogue** : un échange question / réponse de WAB, en mise en scène (jamais un témoignage).
- **L'oiseau du message** : seul oiseau restant, il traverse la fenêtre de contact quand un message part (`js/contact/flight.js`).

## 8. Règles permanentes du propriétaire

1. Rien de penché : aucune carte, fenêtre ou autocollant incliné.
2. Sobriété « à la Apple » : grilles régulières, pas d'ornement, pas d'image démesurée.
3. Ton « grande agence de design », vouvoiement ; ne jamais écrire « interlocuteur unique ». Les bulles de dialogue restent.
4. Rien d'inventé : aucun chiffre, témoignage ou logo client qui n'existe pas.
5. Le studio est à **Lausanne** (jamais Genève comme siège).
6. Pas de `?` / `!` seul en début de ligne.
7. Fichiers de moins de 200 lignes ; JavaScript en `// @ts-check`, zéro `console.log` ; erreurs signalées sans casser la page.
8. Avant toute nouvelle direction visuelle : demander une référence, la lui faire tester en vrai sur une branche jetable.

## 9. Directions écartées (ne pas reproposer)

| Date | Direction | Où la retrouver |
|---|---|---|
| août 2026 | refonte « premium neutre » ; police Geist | — |
| sept. – 02.10 | ciel rose animé, plaques de verre, oiseaux en pixel art (design système v1 à v5) | historique git |
| 27.09 | accueil éditorial sobre | — |
| 02.10 | cinq design systems dont « Fiche technique », trois accueils « hyper pro » génériques | — |
| 03–08.10 | bleu Klein comme **seul** accent, fenêtres à barre bleue, pied de page bleu à « WAB. » géant | remplacé par les six teintes le 08.10 |
| 05.10 | douze formes 3D WebGL sur l'accueil | branche locale `formes-3d` |
| 06.10 | nuage d'objets 3D façon agentcard (deux essais) | branche locale `hero-3d` |
| 06.10 | objets isométriques, autocollants penchés, kaomoji (sauf celui de la 404), volée d'oiseaux | — |
| 07.10 | premier écran en cartes sur bleu ; grande vitrine de projets défilante | branche locale `hero-cartes` |
| 07–08.10 | premier écran « vieil ordinateur » à écran cathodique | branche locale `hero-ordinateur` |
| 08.10 | bandes de couleur pleine largeur (remplacées par `.os-card`), cadres tramés autour des réalisations | — |

Également écartés : un accueil qui tient en un écran sans défiler, le curseur personnalisé, la réfraction de verre réelle (SVG/WebGL).

---

## Klein et les six teintes — comment s'en servir

(Section citée par l'en-tête de `css/os-tokens.css`.)

**Ajouter une section colorée** :

```html
<section class="ma-section" id="ancre" aria-labelledby="ancreTitle" data-tint="vert">
    <div class="os-wrap">
        <div class="os-card">              <!-- ou os-card os-card--wash : fond très clair de la teinte -->
            <p class="badge">Étiquette</p> <!-- le carré du badge prend la teinte -->
            <h2 id="ancreTitle">Titre de la section.</h2>
            …
        </div>
    </div>
</section>
```

Puis ajouter l'entrée dans le sommaire du dock de la page, avec la même teinte : `<li><a class="dock__chip" href="#ancre" data-tint="vert">Libellé</a></li>`. Un élément à l'intérieur peut changer de teinte avec son propre `data-tint` (les cartes de l'accueil le font). Pour un aplat plein : `background: var(--klein)` et la classe `on-klein` sur le même élément.

**Ajouter une septième teinte** : copier un bloc de `os-tints.css`, régler les dix valeurs, vérifier les contrastes (`--klein-ink` et `--klein-text` ≥ 4,5:1 sur blanc, `--on-klein` ≥ 4,5:1 sur `--klein`), puis relever `os-tints.css?v=` dans les sept pages.
