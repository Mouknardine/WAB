// @ts-check
/**
 * WAB OS — la complication de Lausanne
 * Un petit cadran de montre, posé devant l'heure de la barre de
 * menus : lunette d'un fil, quatre index, aiguilles des heures et des
 * minutes à l'encre, l'axe en rose WAB. Il donne l'heure de Lausanne,
 * comme les chiffres à côté, et se met à jour à chaque minute.
 * Décor (aria-hidden) : l'heure lisible reste le texte <time>.
 * Les aiguilles tournent par transform ; sous « réduire les
 * animations », elles sautent sans glisser (os-sky.css).
 */

import { getClock } from './clock.js?v=1';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Le dessin du cadran, sur une grille de 24 (comme les symboles). */
const FACE = `
<circle class="dial__bezel" cx="12" cy="12" r="10.25"/>
<path class="dial__index" d="M12 3.6v1.6M20.4 12h-1.6M12 20.4v-1.6M3.6 12h1.6"/>
<line class="dial__hand dial__hand--h" x1="12" y1="12" x2="12" y2="7.4"/>
<line class="dial__hand dial__hand--m" x1="12" y1="12" x2="12" y2="4.9"/>
<circle class="dial__pin" cx="12" cy="12" r="1.35"/>`;

/**
 * @param {Intl.DateTimeFormat} format
 * @returns {{ h: number, m: number } | null}
 */
function readTime(format) {
    const parts = format.formatToParts(new Date());
    const h = Number(parts.find((part) => part.type === 'hour')?.value);
    const m = Number(parts.find((part) => part.type === 'minute')?.value);
    return Number.isFinite(h) && Number.isFinite(m) ? { h, m } : null;
}

/** @returns {SVGSVGElement} */
function buildDial() {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'dial');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = FACE;
    return svg;
}

export function initDial() {
    const time = document.querySelector('.menubar__time');
    const clock = getClock();
    if (!time || !clock) return;

    /** @type {Intl.DateTimeFormat} */
    let format;
    try {
        format = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: clock.ZONE });
    } catch {
        return; // fuseau indisponible : la barre garde ses chiffres seuls
    }

    const dial = buildDial();
    time.before(dial);

    const set = () => {
        const now = readTime(format);
        if (!now) return;
        dial.style.setProperty('--dial-h', `${(now.h % 12) * 30 + now.m * 0.5}deg`);
        dial.style.setProperty('--dial-m', `${now.m * 6}deg`);
    };

    set();
    // Calé sur le changement de minute, puis toutes les minutes.
    const msToNextMinute = 60000 - (Date.now() % 60000) + 50;
    window.setTimeout(() => {
        set();
        window.setInterval(set, 60000);
    }, msToNextMinute);
}
