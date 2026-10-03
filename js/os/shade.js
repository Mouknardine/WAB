// @ts-check
/**
 * WAB OS — l'ombre de l'oiseau
 * De loin en loin, l'ombre d'un oiseau qui passe au-dessus du studio
 * glisse sur le bureau et ses fenêtres : la silhouette des oiseaux du
 * site, floue, à 7 % d'encre, qui bat des ailes et traverse l'écran
 * en sept secondes. Une première fois après une vingtaine de
 * secondes, puis toutes les une à deux minutes.
 * Ordinateur seulement (souris), jamais sous « réduire les
 * animations », jamais quand l'onglet est caché. Un seul élément,
 * déplacé par transform. Styles : os-sky.css.
 */

import { COLS, ROWS, FRAMES } from '../birds/frames.js?v=8';

const FIRST_MS = 22000;
const GAP_MIN_MS = 60000;
const GAP_MAX_MS = 120000;
const FLIGHT_MS = 7000;
const PX = 3; // un point du dessin = 3 px d'ombre

/**
 * La silhouette d'une image : chaque point dessiné devient noir.
 * @param {string[]} frame
 * @returns {string} une image data:
 */
function silhouette(frame) {
    const canvas = document.createElement('canvas');
    canvas.width = COLS * PX;
    canvas.height = ROWS * PX;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.fillStyle = '#000';
    frame.forEach((line, row) => {
        for (let col = 0; col < COLS; col++) {
            const point = line[col];
            if (point && point !== '.') ctx.fillRect(col * PX, row * PX, PX, PX);
        }
    });
    return canvas.toDataURL('image/png');
}

/** @returns {HTMLElement} */
function buildShade() {
    const shade = document.createElement('div');
    shade.className = 'os-shade';
    shade.setAttribute('aria-hidden', 'true');
    FRAMES.slice(0, 2).forEach((frame) => {
        const wing = document.createElement('i');
        wing.style.backgroundImage = `url("${silhouette(frame)}")`;
        shade.append(wing);
    });
    return shade;
}

/** @param {number} min @param {number} max */
const between = (min, max) => min + Math.random() * (max - min);

export function initShade() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (typeof Element.prototype.animate !== 'function') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    /** @type {HTMLElement | null} */
    let shade = null;

    const fly = () => {
        if (!reduced.matches && !document.hidden) {
            shade ??= document.body.appendChild(buildShade());
            const w = window.innerWidth;
            const h = window.innerHeight;
            const ltr = Math.random() < 0.5;
            const y0 = between(0.15, 0.55) * h;
            const y1 = y0 + between(-0.12, 0.12) * h;
            const from = ltr ? -160 : w + 60;
            const to = ltr ? w + 60 : -160;
            const flip = ltr ? 1 : -1;
            const el = shade;
            el.classList.add('is-flying');
            const flight = el.animate([
                { transform: `translate(${from}px, ${y0}px) scaleX(${flip})`, opacity: 0 },
                { opacity: 1, offset: 0.12 },
                { opacity: 1, offset: 0.88 },
                { transform: `translate(${to}px, ${y1}px) scaleX(${flip})`, opacity: 0 },
            ], { duration: FLIGHT_MS, easing: 'linear' });
            const land = () => el.classList.remove('is-flying');
            flight.addEventListener('finish', land, { once: true });
            flight.addEventListener('cancel', land, { once: true });
        }
        window.setTimeout(fly, between(GAP_MIN_MS, GAP_MAX_MS));
    };

    window.setTimeout(fly, FIRST_MS);
}
