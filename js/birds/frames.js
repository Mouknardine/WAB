/**
 * WAB. — Dessins des oiseaux
 * Deux images en pixel art, ailes hautes et ailes basses, décrites
 * point par point. « K » est le contour noir, « W » le blanc de
 * l'œil, « Y » le bec, « B » le corps : sa couleur est choisie au
 * moment du dessin, c'est ce qui donne un oiseau différent à chaque
 * passage.
 */

export const COLS = 32;
export const ROWS = 28;

/* Part du carré de dessin réellement occupée par l'oiseau : le reste
   n'est que du vide, et le compter ferait fuir l'oiseau bien trop tôt
   devant les textes. */
export const BODY_BOX = { x: 1 / COLS, y: 0, w: 22 / COLS, h: 21 / ROWS };

/** Couleurs de corps tirées au sort d'un oiseau à l'autre. */
export const BODY_COLORS = [
    '#2EA8E0', // bleu
    '#4CAF50', // vert
    '#F5A623', // orange
    '#E040FB', // violet
    '#F06292', // rose
    '#FF5252', // rouge
    '#FFEB3B', // jaune
];

/** Couleurs fixes, communes à tous les oiseaux. */
export const FIXED_COLORS = { K: '#000000', W: '#FFFFFF', Y: '#F5A623' };

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
