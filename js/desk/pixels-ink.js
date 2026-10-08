// @ts-check
/**
 * WAB. — L'encre des pixels du premier écran
 * Ce que partagent la traînée (pixels-field.js) et les motifs des
 * bords (pixels-patterns.js) : le bleu, les signes, les mots, et la
 * façon de peindre un pavé ou un signe.
 */

/** Le bleu Klein du site (--klein, oklch(0.45 0.29 266)). */
export const KLEIN = '#161bf2';
export const WHITE = '#ffffff';

export const GLYPHS = Array.from('{}<>/\\#$%&*+=;:01_|~^?!@[]()▓▒░█⌘⌥⇧↵');
export const LETTERS = GLYPHS.concat(Array.from('abcdefghijklmnopqrstuvwxyz'));
export const WORDS = ['hello', 'wab', 'lausanne', '<div>', 'git push', 'design', 'code', 'ok', ':)', 'brothers', 'build', 'v1.0', 'npm i', '</>', 'hi!', '404', 'print', 'run'];

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
export const POP_MS = 260;
/** Vitesse de frappe d'un mot, en ms par lettre. */
export const TYPE_MS = 34;

/**
 * @typedef {{ x: number, y: number, w: number, h: number }} Rect
 * @typedef {{ x: number, y: number, text: string, color: string, born: number, until: number }} Glyph
 * @typedef {{ block: number, glyph: number }} Size
 */

/** @template T @param {T[]} list @returns {T} */
export function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
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
 * @param {Iterable<{ col: number, row: number }>} cells
 * @param {number} block
 */
export function paintBlocks(ctx, cells, block) {
    ctx.fillStyle = KLEIN;
    for (const cell of cells) ctx.fillRect(cell.col * block, cell.row * block, block, block);
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
