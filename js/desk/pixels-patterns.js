// @ts-check
/**
 * WAB. — Les motifs des bords (premier écran de l'accueil)
 * Au repos, quelques formes en escalier, tirées au hasard à chaque
 * visite, restent posées sur les bords gauche et droit de l'écran,
 * avec leurs signes blancs et quelques lettres bleues autour. Elles
 * débordent parfois hors de l'écran, jamais sur le nom ni sur les
 * touches. Survolée, une forme bouge : un pavé part, un autre pousse,
 * deux signes changent. Cliquée (ou touchée), elle se redessine en
 * entier un peu plus loin sur son bord.
 */

import { GLYPHS, KLEIN, LETTERS, WHITE, shortWords, isMoving, paintBlocks, paintGlyphs, pick, touches } from './pixels-ink.js?v=2';

/** Part de la largeur, de chaque côté, où vivent les motifs. */
const EDGE_SHARE = 0.2;
/** Écart minimal entre deux changements d'une forme survolée. */
const MUTATE_EVERY_MS = 90;
const STEPS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/** @typedef {import('./pixels-ink.js').Rect} Rect */
/** @typedef {import('./pixels-ink.js').Glyph & { key: string | null }} Mark */
/** @typedef {{ side: 'left' | 'right', cells: Map<string, { col: number, row: number }>, marks: Mark[], changedAt: number }} Pattern */
/** @typedef {{ left: [number, number] | null, right: [number, number] | null }} Zones colonnes permises de chaque côté, ou null */
/** @typedef {{ zones?: Zones, perSide?: number }} Layout */

/** @param {import('./pixels-ink.js').Size} size */
export function createPatterns(size) {
    /** @type {Pattern[]} */
    let patterns = [];
    const words = shortWords(size);
    /** @type {Rect[]} */
    let keep = [];
    let cols = 0;
    let minRow = 0;
    let maxRow = 0;
    /** @type {Zones | null} */
    let fixedZones = null;

    /** @param {'left' | 'right'} side */
    function zone(side) {
        if (fixedZones) return fixedZones[side] ?? [1, 0];
        const edge = Math.max(2, Math.round(cols * EDGE_SHARE));
        return side === 'left' ? [-1, edge - 1] : [cols - edge, cols];
    }

    /** @param {number} col @param {number} row @param {'left' | 'right'} side */
    function allowed(col, row, side) {
        const [from, to] = zone(side);
        return col >= from && col <= to && row >= minRow && row <= maxRow && !touches(keep, size.block, col, row);
    }

    /** Une forme en escalier qui pousse case par case depuis (col, row). */
    function grow(/** @type {Pattern} */ pattern, /** @type {number} */ count) {
        const list = () => Array.from(pattern.cells.values());
        for (let tries = 0; pattern.cells.size < count && tries < count * 30; tries += 1) {
            const from = pick(list());
            const [dc, dr] = pick(STEPS);
            const col = from.col + dc;
            const row = from.row + dr;
            if (allowed(col, row, pattern.side)) pattern.cells.set(`${col},${row}`, { col, row });
        }
    }

    /** Les signes d'une case : un caractère, parfois un mot, parfois rien. */
    function marksFor(/** @type {string} */ key, /** @type {{ col: number, row: number }} */ cell, /** @type {number} */ now) {
        const per = Math.floor(size.block / size.glyph);
        const x = cell.col * size.block;
        const y = cell.row * size.block + Math.floor(Math.random() * per) * size.glyph;
        const roll = Math.random();
        if (roll < 0.12) return [{ key, x: x + size.glyph * 0.4, y, text: pick(words), color: WHITE, born: now, until: Infinity }];
        if (roll < 0.72) return [{ key, x: x + Math.floor(Math.random() * per) * size.glyph, y, text: pick(GLYPHS), color: WHITE, born: now, until: Infinity }];
        return [];
    }

    /** Quelques lettres bleues posées sur le bureau, autour de la forme. */
    function strays(/** @type {Pattern} */ pattern, /** @type {number} */ now) {
        /** @type {Mark[]} */
        const marks = [];
        const cells = Array.from(pattern.cells.values());
        for (let i = 0; i < 6 && marks.length < 3; i += 1) {
            const cell = pick(cells);
            const col = cell.col + pick([-2, -1, 1, 2]);
            const row = cell.row + pick([-1, 0, 1]);
            if (pattern.cells.has(`${col},${row}`) || !allowed(col, row, pattern.side)) continue;
            marks.push({ key: null, x: col * size.block + size.glyph, y: row * size.block + size.glyph, text: pick(LETTERS), color: KLEIN, born: now, until: Infinity });
        }
        return marks;
    }

    function dress(/** @type {Pattern} */ pattern, /** @type {number} */ now) {
        pattern.marks = [];
        for (const [key, cell] of pattern.cells) pattern.marks.push(...marksFor(key, cell, now));
        pattern.marks.push(...strays(pattern, now));
    }

    /** Une forme neuve, posée au hasard dans la bande [top, bottom] de son bord. */
    function shape(/** @type {'left' | 'right'} */ side, /** @type {number} */ top, /** @type {number} */ bottom, /** @type {number} */ now) {
        /** @type {Pattern} */
        const pattern = { side, cells: new Map(), marks: [], changedAt: now };
        const [from, to] = zone(side);
        for (let tries = 0; tries < 40 && !pattern.cells.size; tries += 1) {
            const col = from + Math.floor(Math.random() * (to - from + 1));
            const row = top + Math.floor(Math.random() * Math.max(1, bottom - top + 1));
            if (allowed(col, row, side)) pattern.cells.set(`${col},${row}`, { col, row });
        }
        const big = cols >= 16;
        grow(pattern, (big ? 6 : 4) + Math.floor(Math.random() * (big ? 7 : 4)));
        dress(pattern, now);
        return pattern;
    }

    /**
     * Tire les formes au hasard, réparties en bandes égales de haut en bas.
     * Par défaut, sur le cinquième gauche et droit de la largeur, trois
     * par côté ; `layout` fixe d'autres colonnes et un autre nombre.
     * @param {number} w @param {number} h @param {Rect[]} rects
     * @param {number} topSpace @param {number} now @param {Layout} [layout]
     */
    function generate(w, h, rects, topSpace, now, layout = {}) {
        keep = rects;
        cols = Math.ceil(w / size.block);
        minRow = Math.ceil(topSpace / size.block);
        maxRow = Math.floor(h / size.block) - 1;
        fixedZones = layout.zones ?? null;
        const perSide = layout.perSide ?? 3;
        const band = Math.max(1, Math.floor((maxRow - minRow + 1) / perSide));
        patterns = [];
        for (const side of /** @type {const} */ (['left', 'right'])) {
            if (fixedZones && !fixedZones[side]) continue;
            for (let i = 0; i < perSide; i += 1) {
                const top = minRow + i * band;
                const made = shape(side, top, top + band - 1, now);
                if (made.cells.size) patterns.push(made);
            }
        }
    }

    /** La forme sous (x, y), ou juste à côté ; null s'il n'y en a pas. */
    function find(/** @type {number} */ x, /** @type {number} */ y) {
        const col = Math.floor(x / size.block);
        const row = Math.floor(y / size.block);
        return patterns.find((pattern) => pattern.cells.has(`${col},${row}`)) ?? null;
    }

    /** Survol : un pavé part, un autre pousse, deux signes changent. */
    function mutate(/** @type {Pattern} */ pattern, /** @type {number} */ now) {
        if (now - pattern.changedAt < MUTATE_EVERY_MS) return false;
        pattern.changedAt = now;
        if (pattern.cells.size > 3) {
            const gone = pick(Array.from(pattern.cells.keys()));
            pattern.cells.delete(gone);
            pattern.marks = pattern.marks.filter((mark) => mark.key !== gone);
        }
        const before = new Set(pattern.cells.keys());
        grow(pattern, pattern.cells.size + 1 + Math.round(Math.random()));
        for (const [key, cell] of pattern.cells) {
            if (!before.has(key)) pattern.marks.push(...marksFor(key, cell, now));
        }
        for (let i = 0; i < 2; i += 1) {
            const mark = pick(pattern.marks);
            if (mark && mark.text.length === 1) {
                mark.text = pick(mark.color === WHITE ? GLYPHS : LETTERS);
                mark.born = now;
            }
        }
        return true;
    }

    /** Clic : la forme se redessine en entier, ailleurs sur son bord. */
    function regenerate(/** @type {Pattern} */ pattern, /** @type {number} */ now) {
        const rows = Array.from(pattern.cells.values()).map((cell) => cell.row);
        const middle = Math.round((Math.min(...rows) + Math.max(...rows)) / 2);
        const fresh = shape(pattern.side, middle - 2, middle + 2, now);
        if (fresh.cells.size) patterns[patterns.indexOf(pattern)] = fresh;
    }

    /** @param {CanvasRenderingContext2D} ctx @param {number} now @param {boolean} still */
    function draw(ctx, now, still) {
        for (const pattern of patterns) {
            paintBlocks(ctx, pattern.cells.values(), size.block);
            paintGlyphs(ctx, pattern.marks, size, now, still);
        }
    }

    /** Vrai tant qu'un signe d'une forme se brouille ou se tape. */
    function moving(/** @type {number} */ now) {
        return patterns.some((pattern) => pattern.marks.some((mark) => isMoving(mark, now)));
    }

    /** Les formes, dans l'ordre : pour qui les peint en HTML (pixels-margins.js). */
    function list() {
        return patterns;
    }

    return { generate, find, mutate, regenerate, draw, moving, list };
}
