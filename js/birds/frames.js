/**
 * WAB. — Dessins des oiseaux
 * Deux images en pixel art, ailes hautes et ailes basses, décrites
 * point par point. « K » est le contour noir, « W » le blanc de
 * l'œil, « Y » le bec, « B » le corps : sa couleur est choisie au
 * moment du dessin, dans une palette resserrée (voir plus bas).
 */

export const COLS = 32;
export const ROWS = 28;

/* La palette de l'oiseau qui emporte un message envoyé (js/contact/
   flight.js) : le bleu, la porcelaine et le bleu ciel du site. */
/* En hexadécimal : le canevas de certains navigateurs ignore oklch()
   et peindrait l'oiseau en noir. Équivalents OKLCH en commentaire. */
const KLEIN = '#161bf2'; // oklch(0.45 0.29 266), --klein
const PORCELAINE = '#f4f6fb'; // oklch(0.97 0.006 266)
const CIEL = '#b4c6ff'; // oklch(0.83 0.08 268)

/** Couleurs de corps, par rang (data-color) : 0 et 4 sont le Klein. */
export const BODY_COLORS = [KLEIN, PORCELAINE, CIEL, PORCELAINE, KLEIN, CIEL, PORCELAINE];

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
