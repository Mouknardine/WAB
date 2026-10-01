// @ts-check
/**
 * WAB. — L'ouverture : le point qui s'ouvre
 * Le sigle WAB. occupe l'écran ; son point est un carré qui laisse
 * déjà voir un vrai projet. Au défilement, ce carré grandit depuis sa
 * place exacte jusqu'à devenir le cadre plein écran du travail, et
 * les lettres, agrandies autour du même centre, passent de part et
 * d'autre comme si l'on traversait le point.
 *
 * Le masque et les lettres suivent la même échelle : à tout instant,
 * l'ouverture est le point agrandi, jamais une forme qui s'en écarte.
 * Seuls transform, opacity et clip-path changent.
 *
 * Sous « réduire les animations », rien de tout cela : le point reste
 * un point, la page défile normalement.
 */

import { clamp01, onResizeSettled, trackProgress } from './scroll-progress.js?v=1';

/** Les lettres ont disparu à cette fraction du parcours. */
const MARK_GONE = 0.75;
/** La légende du projet apparaît sur la fin du parcours. */
const CAPTION_FROM = 0.86;

/**
 * @typedef {Object} Geometry
 * @property {number} cx centre du point, relatif au cadre
 * @property {number} cy
 * @property {number} half demi-côté du point
 * @property {number} scale échelle à laquelle le point couvre le cadre
 * @property {number} width taille du cadre
 * @property {number} height
 * @property {number} radius rayon final du cadre
 */

/**
 * Mesure le point et le cadre au repos (sans transformation).
 * @param {HTMLElement} mark
 * @param {HTMLElement} dot
 * @param {HTMLElement} frame
 * @returns {Geometry}
 */
function measure(mark, dot, frame) {
    mark.style.transform = '';
    frame.style.clipPath = '';
    const d = dot.getBoundingClientRect();
    const f = frame.getBoundingClientRect();
    const m = mark.getBoundingClientRect();

    const cx = d.left + d.width / 2 - f.left;
    const cy = d.top + d.height / 2 - f.top;
    const half = Math.max(1, d.width / 2);
    mark.style.transformOrigin = `${d.left + d.width / 2 - m.left}px ${d.top + d.height / 2 - m.top}px`;

    return {
        cx,
        cy,
        half,
        scale: Math.max(cx, f.width - cx, cy, f.height - cy) / half,
        width: f.width,
        height: f.height,
        radius: parseFloat(getComputedStyle(frame).borderTopLeftRadius) || 0,
    };
}

/**
 * @param {Geometry} g
 * @param {number} p progression 0 → 1
 * @returns {string} la valeur de clip-path du cadre
 */
function clipFor(g, p) {
    // Échelle exponentielle : le zoom paraît régulier à l'œil.
    const half = g.half * Math.pow(g.scale, p);
    const top = Math.max(0, g.cy - half);
    const left = Math.max(0, g.cx - half);
    const right = Math.max(0, g.width - (g.cx + half));
    const bottom = Math.max(0, g.height - (g.cy + half));
    const radius = Math.min(g.radius, 2 + p * g.radius);
    return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
}

export function initOpening() {
    const section = document.querySelector('[data-opening]');
    if (!(section instanceof HTMLElement)) return;

    const mark = section.querySelector('[data-opening-mark]');
    const dot = section.querySelector('[data-opening-dot]');
    const frame = section.querySelector('[data-opening-frame]');
    const foot = section.querySelector('[data-opening-foot]');
    const caption = section.querySelector('[data-opening-caption]');
    if (!(mark instanceof HTMLElement) || !(dot instanceof HTMLElement) || !(frame instanceof HTMLElement)
        || !(foot instanceof HTMLElement) || !(caption instanceof HTMLElement)) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    section.classList.add('is-scrubbed');
    let geometry = measure(mark, dot, frame);
    let progress = 0;

    /** @param {number} p */
    const render = (p) => {
        progress = p;
        frame.style.clipPath = clipFor(geometry, p);
        mark.style.transform = `scale(${Math.pow(geometry.scale, p)})`;
        mark.style.opacity = String(1 - clamp01(p / MARK_GONE));
        foot.style.opacity = String(1 - clamp01(p / 0.12));
        foot.style.transform = `translateY(${clamp01(p / 0.12) * -16}px)`;
        caption.style.opacity = String(clamp01((p - CAPTION_FROM) / (1 - CAPTION_FROM)));
        // Invisible, l'élément ne doit plus recevoir de clic ni de focus.
        foot.style.visibility = p > 0.12 ? 'hidden' : '';
        mark.style.visibility = p > MARK_GONE ? 'hidden' : '';
    };

    const request = trackProgress(section, render);

    // La police change la largeur des lettres : on remesure une fois
    // qu'elle est là, puis à chaque redimensionnement stabilisé.
    const remeasure = () => {
        geometry = measure(mark, dot, frame);
        render(progress);
        request();
    };
    document.fonts.ready.then(remeasure).catch(remeasure);
    onResizeSettled(remeasure);
}
