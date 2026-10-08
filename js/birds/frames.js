// @ts-check
/**
 * WAB. — Le dessin de l'oiseau qui emporte un message envoyé
 * (js/contact/flight.js). Deux images en pixel art, ailes hautes et
 * ailes basses, décrites point par point. « K » est le contour noir,
 * « W » le blanc de l'œil, « Y » le bec, « B » le corps, en bleu Klein.
 */

export const COLS = 32;
export const ROWS = 28;

/* En hexadécimal : le canevas de certains navigateurs ignore oklch()
   et peindrait l'oiseau en noir. Équivalent OKLCH en commentaire. */
export const BODY_COLOR = '#161bf2'; // oklch(0.45 0.29 266), --klein

/** Contour encre, œil blanc, bec bleu pâle.
    @type {Record<string, string>} */
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
