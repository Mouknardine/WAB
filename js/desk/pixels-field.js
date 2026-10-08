// @ts-check
/**
 * WAB. — La traînée des pixels bleus (premier écran de l'accueil)
 * Le premier écran est découpé en gros pavés ; un passage allume un
 * pavé et quelques voisins, en escalier. Dans le bleu surgissent des
 * signes blancs (un caractère qui se brouille un instant, ou un mot
 * qui se tape) ; autour, sur le bureau, quelques lettres bleues
 * isolées. Chaque pavé s'éteint d'un coup, à son heure : l'écran se
 * vide case par case. Les zones protégées (le nom, les touches) ne
 * s'allument jamais. L'entrée (souris, doigt, passage fantôme) est
 * dans pixels.js ; les motifs qui restent, dans pixels-patterns.js.
 */

import { GLYPHS, LETTERS, TINTS, shortWords, paintBlocks, paintGlyphs, pick, touches } from './pixels-ink.js?v=3';

/** Durée de vie d'un pavé, en ms : base, plus un écart au hasard. */
const LIFE_MS = 1100;
const LIFE_SPREAD_MS = 700;

/** @typedef {import('./pixels-ink.js').Rect} Rect */
/** @typedef {import('./pixels-ink.js').Glyph} Glyph */
/** @typedef {import('./pixels-ink.js').Size} Size */
/** @typedef {import('./pixels-ink.js').Tint} Tint */

/** @param {Size} size taille d'un pavé et d'une case de texte, en px */
export function createField(size) {
    /** @type {Map<string, { col: number, row: number, until: number, fill: string }>} */
    const blocks = new Map();
    const words = shortWords(size);
    /** @type {Glyph[]} */
    let glyphs = [];
    /** @type {Rect[]} */
    let keep = [];
    let width = 0;
    let height = 0;

    /** @param {number} col @param {number} row @param {number} now @param {Tint} tint */
    function light(col, row, now, tint) {
        if (col < 0 || row < 0 || col * size.block > width || row * size.block > height) return;
        if (touches(keep, size.block, col, row)) return;

        const key = `${col},${row}`;
        const existing = blocks.get(key);
        if (existing) {
            existing.until = Math.max(existing.until, now + LIFE_MS * 0.8);
            return;
        }

        const until = now + LIFE_MS + Math.random() * LIFE_SPREAD_MS;
        blocks.set(key, { col, row, until, fill: tint.fill });
        spawnInside(col, row, now, until, tint);
    }

    /** Un signe blanc, ou parfois un mot, posé sur la grille du texte. */
    function spawnInside(/** @type {number} */ col, /** @type {number} */ row, /** @type {number} */ now, /** @type {number} */ until, /** @type {Tint} */ tint) {
        const cells = Math.floor(size.block / size.glyph);
        const x = col * size.block + Math.floor(Math.random() * cells) * size.glyph;
        const y = row * size.block + Math.floor(Math.random() * cells) * size.glyph;
        const roll = Math.random();
        if (roll < 0.14) {
            glyphs.push({ x: col * size.block + size.glyph * 0.5, y, text: pick(words), color: tint.ink, born: now, until });
        } else if (roll < 0.7) {
            glyphs.push({ x, y, text: pick(GLYPHS), color: tint.ink, born: now, until });
        }
    }

    /** Une lettre bleue isolée, sur le bureau, près du passage. */
    function scatter(/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ now, /** @type {Tint} */ tint) {
        const reach = size.block * 2.5;
        const gx = Math.round((x + (Math.random() * 2 - 1) * reach) / size.glyph) * size.glyph;
        const gy = Math.round((y + (Math.random() * 2 - 1) * reach) / size.glyph) * size.glyph;
        const col = Math.floor(gx / size.block);
        const row = Math.floor(gy / size.block);
        if (blocks.has(`${col},${row}`) || touches(keep, size.block, col, row)) return;
        glyphs.push({ x: gx, y: gy, text: pick(LETTERS), color: tint.stray, born: now, until: now + 700 + Math.random() * 500 });
    }

    /** Un passage en (x, y) : le pavé touché et quelques voisins, dans la teinte donnée. */
    function stamp(/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ now, tint = TINTS[0]) {
        const col = Math.floor(x / size.block);
        const row = Math.floor(y / size.block);
        light(col, row, now, tint);
        for (let dc = -1; dc <= 1; dc += 1) {
            for (let dr = -1; dr <= 1; dr += 1) {
                if ((dc || dr) && Math.random() < 0.38) light(col + dc, row + dr, now, tint);
            }
        }
        if (Math.random() < 0.3) scatter(x, y, now, tint);
    }

    /** @param {CanvasRenderingContext2D} ctx @param {number} now @param {boolean} still sans brouillage */
    function draw(ctx, now, still) {
        paintBlocks(ctx, blocks.values(), size.block);
        paintGlyphs(ctx, glyphs, size, now, still);
    }

    /** Éteint ce qui a fait son temps ; vrai s'il reste quelque chose. */
    function prune(/** @type {number} */ now) {
        for (const [key, block] of blocks) {
            if (block.until <= now) blocks.delete(key);
        }
        glyphs = glyphs.filter((glyph) => glyph.until > now);
        return blocks.size > 0 || glyphs.length > 0;
    }

    /** @param {number} w @param {number} h @param {Rect[]} rects */
    function resize(w, h, rects) {
        width = w;
        height = h;
        keep = rects;
        blocks.clear();
        glyphs = [];
    }

    return { stamp, draw, prune, resize };
}
