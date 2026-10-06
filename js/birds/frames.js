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

/* La palette des oiseaux, resserrée sur le bleu, l'encre et le blanc
   du site (DESIGN-SYSTEM.md, section « Klein »). Une seule logique :
   l'oiseau posé — sur une fenêtre, sur la barre, près du curseur —
   porte le bleu Klein (en groupe, il alterne avec le bleu ciel) ; ceux
   qui passent dans le ciel sont des mouettes du Léman, porcelaine ou
   bleu ciel, et s'effacent derrière le contenu. */
/* En hexadécimal : le canevas de certains navigateurs ignore oklch()
   et peindrait l'oiseau en noir. Équivalents OKLCH en commentaire. */
const KLEIN = '#161bf2'; // oklch(0.45 0.29 266), --klein
const PORCELAINE = '#f4f6fb'; // oklch(0.97 0.006 266)
const CIEL = '#b4c6ff'; // oklch(0.83 0.08 268)

/** Couleurs de corps, par rang (data-color) : 0 et 4 sont le Klein. */
export const BODY_COLORS = [KLEIN, PORCELAINE, CIEL, PORCELAINE, KLEIN, CIEL, PORCELAINE];

/** Les oiseaux en vol : jamais le Klein, réservé aux oiseaux posés. */
export const FLIGHT_COLORS = [PORCELAINE, CIEL];

/** Le ciel de l'accueil (data-birds-colors="accueil") : le blanc et
   les bleus du site, et de temps en temps un rose. Tirage au hasard
   dans cette liste : le nombre d'entrées fait la fréquence (rose : 1
   sur 10). */
export const HOME_COLORS = [
    PORCELAINE, PORCELAINE, PORCELAINE, PORCELAINE,
    CIEL, CIEL, CIEL,
    KLEIN, KLEIN,
    '#ff7eb3',
];

/** La volée d'ouverture de l'accueil (data-birds-opening) : toutes les
   couleurs, une seule traversée. */
export const OPENING_COLORS = [
    KLEIN, '#ff7eb3', '#ffd23f', '#ff8a3d', '#5fe0b0', '#b9a3ff', CIEL, PORCELAINE,
];

/** Couleurs fixes, communes à tous les oiseaux : contour encre, œil
   blanc, bec bleu pâle. */
export const FIXED_COLORS = { K: '#101214', W: '#ffffff', Y: '#cedeff' };

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
