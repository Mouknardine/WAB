/**
 * WAB. — Dessins des oiseaux
 * Deux images en pixel art, ailes hautes et ailes basses, décrites
 * point par point. « K » est le contour noir, « W » le blanc de
 * l'œil, « Y » le bec, « B » le corps : sa couleur est choisie au
 * moment du dessin, dans une palette resserrée (voir plus bas).
 */

export const COLS = 32;
export const ROWS = 28;

/* Part du carré de dessin réellement occupée par l'oiseau : le reste
   n'est que du vide, et le compter ferait fuir l'oiseau bien trop tôt
   devant les textes. */
export const BODY_BOX = { x: 1 / COLS, y: 0, w: 22 / COLS, h: 21 / ROWS };

/* La palette des oiseaux, resserrée sur le rose et l'encre du site
   (FINITION-PRO.md). Une seule logique : l'oiseau posé — sur une
   fenêtre, sur la barre, près du curseur — porte le rose WAB (en
   groupe, il alterne avec le rose poudré) ; ceux qui passent dans le
   ciel sont des mouettes du Léman, porcelaine ou rose poudré, et
   s'effacent derrière le contenu. */
/* En hexadécimal : le canevas de certains navigateurs ignore oklch()
   et peindrait l'oiseau en noir. Équivalents OKLCH en commentaire. */
const ROSE = '#ff2d9b'; // oklch(0.667 0.251 355.4), --pink
const PORCELAINE = '#f8f3f6'; // oklch(0.97 0.006 350)
const POUDRE = '#fbbcd6'; // oklch(0.86 0.08 352)

/** Couleurs de corps, par rang (data-color) : 0 et 4 sont le rose. */
export const BODY_COLORS = [ROSE, PORCELAINE, POUDRE, PORCELAINE, ROSE, POUDRE, PORCELAINE];

/** Les oiseaux en vol : jamais le rose, réservé aux oiseaux posés. */
export const FLIGHT_COLORS = [PORCELAINE, POUDRE];

/** Couleurs fixes, communes à tous les oiseaux. */
export const FIXED_COLORS = { K: '#0b0b0c', W: '#ffffff', Y: '#f5a623' };

export const FRAMES = [
    // IMAGE 0 — ailes en haut
    [
        "....K...........................",
        "...KBKKKK.....KKKK..............",
        "...KBBBBBK...KBBBBK.............",
        "....KBBBBBK.KBBBBBBK............",
        "...KBBBBBBBKBBBBBBBBK...........",
        "....KKBBBBBKBBBWWWWBK...........",
        "....KBBBBBBBBBWWWKWWK...........",
        ".....KBBBBBBBBWWWWWWYK..........",
        "......KKBBWWWBBWWWWKK...........",
        ".KKKKKKKKWWWWWWWWKK.............",
        ".KBBBBBBWWWWWWWWWBK.............",
        "..KBBBBBWWWWWWWWBBBK............",
        "...KBBBBBWWWWWBBBBBK............",
        "..KBBBBBKKKKKKBBBBBBKK..........",
        "...KKBBK.....KBBBBBBBBK.........",
        "....KBK.......KBKBBBKK..........",
        ".....K.........KKBKBBK..........",
        ".................K.KK...........",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
    ],
    // IMAGE 1 — ailes en bas
    [
        "................................",
        "................................",
        "................................",
        "................................",
        "...............KKKK.............",
        "..............KBBBBK............",
        ".............KBBBBBBK...........",
        "............KBBBBBBBBK..........",
        "...........KKBBBBWWWBK..........",
        "..........KBBBBBWWKWWK..........",
        ".........KBBBBBWWWWWWYK.........",
        ".......KKBBBBBBWWWWWKK..........",
        "..KKKKKKBBWWWBBKWWKK............",
        "..KBBBBBBWWWKBBBKWKK............",
        "...KBBBBBWWKBBBBBBBBK...........",
        "....KBBBBBWKBBBBBBBBK...........",
        "...KBBBBBKKKKBBBBBBBBK..........",
        "....KKBBK...KBBBBBBBBK..........",
        ".....KBK.....KBBBBBBK...........",
        "......K.......KKKBBBBK..........",
        "................KKKKK...........",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
    ],
];
