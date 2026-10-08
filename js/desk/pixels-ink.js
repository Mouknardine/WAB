// @ts-check
/**
 * WAB. — L'encre des pixels du premier écran
 * Ce que partagent la traînée (pixels-field.js) et les motifs des
 * bords (pixels-patterns.js) : le bleu, les signes, les mots, et la
 * façon de peindre un pavé ou un signe.
 */

/**
 * @typedef {{ fill: string, ink: string, stray: string }} Tint
 * Les six teintes du site (os-tints.css), converties d'OKLCH en hex
 * pour le canevas : l'aplat, l'encre des signes posés dessus (blanc
 * sur les teintes sombres, encre sur les claires), et la couleur des
 * lettres isolées sur le bureau (le jaune, trop pâle, y prend son
 * liseré plus soutenu).
 * @type {Tint[]}
 */
export const TINTS = [
    { fill: '#161bf2', ink: '#ffffff', stray: '#161bf2' },
    { fill: '#63cbfe', ink: '#101214', stray: '#3aa4dc' },
    { fill: '#50df5f', ink: '#101214', stray: '#2fb043' },
    { fill: '#f6e12b', ink: '#101214', stray: '#b39b00' },
    { fill: '#fe86c2', ink: '#101214', stray: '#e9559f' },
    { fill: '#d40e14', ink: '#ffffff', stray: '#d40e14' },
];

/** Une teinte au hasard, différente de `not` si on la donne. */
export function pickTint(/** @type {Tint | undefined} */ not) {
    const choices = TINTS.filter((tint) => tint !== not);
    return choices[Math.floor(Math.random() * choices.length)];
}

export const GLYPHS = Array.from('{}<>/\\#$%&*+=;:01_|~^?!@[]()▓▒░█⌘⌥⇧↵');
export const LETTERS = GLYPHS.concat(Array.from('abcdefghijklmnopqrstuvwxyz'));
const WORDS = ['hello', 'wab', 'lausanne', '<div>', 'git push', 'design', 'code', 'ok', ':)', 'brothers', 'build', 'v1.0', 'npm i', '</>', 'hi!', '404', 'print', 'run'];

/**
 * Les mots qui tiennent dans un seul pavé : un mot blanc qui en
 * déborderait disparaîtrait sur le bureau clair.
 * @param {Size} size
 */
export function shortWords(size) {
    const room = Math.floor((size.block - size.glyph * 0.4) / (size.glyph * 0.62));
    return WORDS.filter((word) => word.length <= room);
}

/** Temps pendant lequel un caractère se brouille avant de se fixer. */
const POP_MS = 260;
/** Vitesse de frappe d'un mot, en ms par lettre. */
const TYPE_MS = 34;

/**
 * @typedef {{ x: number, y: number, w: number, h: number }} Rect
 * @typedef {{ x: number, y: number, text: string, color: string, born: number, until: number }} Glyph
 * @typedef {{ block: number, glyph: number }} Size
 */

/** @template T @param {T[]} list @returns {T} */
export function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
}

/**
 * Les zones protégées ([data-pixels-keep] dans `root`), en px par
 * rapport au canevas, élargies de `margin`.
 * @param {HTMLElement} root @param {HTMLElement} canvas @param {number} margin
 * @returns {Rect[]}
 */
export function keepRects(root, canvas, margin) {
    const origin = canvas.getBoundingClientRect();
    return Array.from(root.querySelectorAll('[data-pixels-keep]')).map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - origin.left - margin, y: r.top - origin.top - margin, w: r.width + margin * 2, h: r.height + margin * 2 };
    });
}

/** Vrai si le pavé (col, row) touche l'une des zones protégées. */
export function touches(/** @type {Rect[]} */ rects, /** @type {number} */ block, /** @type {number} */ col, /** @type {number} */ row) {
    const x = col * block;
    const y = row * block;
    return rects.some((r) => x < r.x + r.w && x + block > r.x && y < r.y + r.h && y + block > r.y);
}

/** Vrai tant qu'un signe se brouille ou qu'un mot se tape. */
export function isMoving(/** @type {Glyph} */ glyph, /** @type {number} */ now) {
    const age = now - glyph.born;
    return glyph.text.length > 1 ? age < glyph.text.length * TYPE_MS : age < POP_MS;
}

/** @param {Glyph} glyph @param {number} now @param {boolean} still */
function textOf(glyph, now, still) {
    if (still) return glyph.text;
    const age = now - glyph.born;
    if (glyph.text.length > 1) return glyph.text.slice(0, Math.max(1, Math.floor(age / TYPE_MS)));
    return age < POP_MS ? pick(GLYPHS) : glyph.text;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Iterable<{ col: number, row: number, fill?: string }>} cells
 * @param {number} block
 * @param {string} [fill] la couleur de toutes les cases, à défaut de la leur
 */
export function paintBlocks(ctx, cells, block, fill) {
    for (const cell of cells) {
        ctx.fillStyle = cell.fill ?? fill ?? TINTS[0].fill;
        ctx.fillRect(cell.col * block, cell.row * block, block, block);
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Glyph[]} glyphs
 * @param {Size} size
 * @param {number} now
 * @param {boolean} still sans brouillage (mouvement réduit)
 */
export function paintGlyphs(ctx, glyphs, size, now, still) {
    ctx.font = `${Math.round(size.glyph * 1.05)}px Sligoil, ui-monospace, monospace`;
    ctx.textBaseline = 'top';
    for (const glyph of glyphs) {
        ctx.fillStyle = glyph.color;
        ctx.fillText(textOf(glyph, now, still), glyph.x, glyph.y);
    }
}
