// @ts-check
/**
 * WAB. — Les motifs des marges (accueil, sous le premier écran)
 * Les mêmes formes en escalier que sur les bords du premier écran
 * (pixels-patterns.js), posées cette fois dans les marges de toute la
 * page, de part et d'autre du contenu, jusqu'au pied de page. Elles
 * sont peintes en HTML ([data-margins], desk-margins.css) pour défiler
 * avec la page sans canevas géant. Survolée, une forme bouge ;
 * cliquée, elle se redessine.
 *
 * Seulement quand les marges ont la place d'au moins un gros pixel ;
 * sinon (téléphone, petit portable), rien n'est posé.
 */

import { createPatterns } from './pixels-patterns.js?v=4';

const SIZE = { block: 60, glyph: 20 };
/** Écart gardé entre le contenu et le premier pavé, en px. */
const GAP = 24;
/** Une forme par côté pour tant de rangées de hauteur. */
const ROWS_PER_SHAPE = 9;
/** Écart de hauteur à partir duquel on retire les formes (images chargées, FAQ ouverte). */
const REFLOW_PX = 160;
/** Une marque plus jeune que ceci surgit (desk-margins.css). */
const FRESH_MS = 60;

export function initMargins() {
    const host = document.querySelector('[data-margins]');
    const wrap = document.querySelector('.desk-wrap');
    if (!(host instanceof HTMLElement) || !(wrap instanceof HTMLElement)) return;
    const hero = document.querySelector('[data-pixels]');
    const patterns = createPatterns(SIZE);
    let lastWidth = 0;
    let lastHeight = 0;
    /** @type {number | undefined} */
    let pending;

    /** Colonnes libres à gauche et à droite du contenu ; null si trop étroit. */
    function zones() {
        const box = host.getBoundingClientRect();
        const style = getComputedStyle(wrap);
        const rect = wrap.getBoundingClientRect();
        const left = rect.left + parseFloat(style.paddingLeft) - box.left - GAP;
        const right = rect.right - parseFloat(style.paddingRight) - box.left + GAP;
        const lastLeft = Math.floor(left / SIZE.block) - 1;
        const firstRight = Math.ceil(right / SIZE.block);
        const cols = Math.ceil(box.width / SIZE.block);
        return {
            left: lastLeft >= 0 ? /** @type {[number, number]} */ ([-1, lastLeft]) : null,
            // À droite, il faut au moins un demi-pavé visible avant le bord.
            right: box.width - firstRight * SIZE.block >= SIZE.block / 2 ? /** @type {[number, number]} */ ([firstRight, cols]) : null,
        };
    }

    /** @param {number} index */
    function render(index) {
        const pattern = patterns.list()[index];
        if (!pattern) return;
        const now = performance.now();
        const shape = host.children[index] ?? host.appendChild(document.createElement('div'));
        shape.className = 'margins__shape';
        shape.setAttribute('data-index', String(index));
        shape.replaceChildren();
        shape.style.setProperty('--cell', pattern.tint.fill);
        for (const cell of pattern.cells.values()) {
            const block = document.createElement('span');
            block.className = 'margins__cell';
            block.style.transform = `translate(${cell.col * SIZE.block}px, ${cell.row * SIZE.block}px)`;
            shape.append(block);
        }
        for (const mark of pattern.marks) {
            const sign = document.createElement('span');
            sign.className = 'margins__mark';
            sign.style.color = mark.color;
            if (now - mark.born < FRESH_MS) sign.classList.add('is-fresh');
            sign.style.transform = `translate(${mark.x}px, ${mark.y}px)`;
            sign.textContent = mark.text;
            shape.append(sign);
        }
    }

    function layout() {
        lastWidth = host.clientWidth;
        lastHeight = host.clientHeight;
        host.replaceChildren();
        const free = zones();
        if (!free.left && !free.right) return;
        const top = hero ? hero.getBoundingClientRect().bottom - host.getBoundingClientRect().top + SIZE.block : 0;
        const rows = Math.max(1, (lastHeight - top) / SIZE.block);
        const perSide = Math.max(1, Math.round(rows / ROWS_PER_SHAPE));
        patterns.generate(lastWidth, lastHeight, [], top, performance.now(), { zones: free, perSide });
        patterns.list().forEach((_, index) => render(index));
    }

    function relayoutIfNeeded() {
        const moved = host.clientWidth !== lastWidth || Math.abs(host.clientHeight - lastHeight) > REFLOW_PX;
        if (!moved) return;
        window.clearTimeout(pending);
        pending = window.setTimeout(layout, 150);
    }

    /** @param {Event} event */
    function shapeIndex(event) {
        const shape = event.target instanceof Element ? event.target.closest('.margins__shape') : null;
        return shape ? Number(shape.getAttribute('data-index')) : -1;
    }

    host.addEventListener('pointerover', (event) => {
        const index = shapeIndex(event);
        const pattern = patterns.list()[index];
        if (pattern && patterns.mutate(pattern, performance.now())) render(index);
    });

    host.addEventListener('click', (event) => {
        const index = shapeIndex(event);
        const pattern = patterns.list()[index];
        if (!pattern) return;
        patterns.regenerate(pattern, performance.now());
        render(index);
    });

    new ResizeObserver(relayoutIfNeeded).observe(host);
    layout();
}
