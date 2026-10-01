// @ts-check
/**
 * WAB. — La planche
 * Huit photos de projets sur une seule rangée. Sur ordinateur, la
 * section se fige et le défilement vertical fait glisser la rangée
 * de droite à gauche, comme une planche contact qu'on parcourt.
 * Sur téléphone, ou sous « réduire les animations », la rangée défile
 * simplement au doigt, aimantée photo par photo (le CSS s'en charge).
 *
 * Au clavier, une photo qui reçoit le focus hors de l'écran fait
 * défiler la page jusqu'à elle : la rangée ne cache jamais ce qu'on
 * est en train de sélectionner.
 */

import { onResizeSettled, trackProgress } from './scroll-progress.js?v=1';

const WIDE = '(min-width: 900px)';

export function initGallery() {
    const section = document.querySelector('[data-gallery]');
    if (!(section instanceof HTMLElement)) return;
    const stage = section.querySelector('[data-gallery-stage]');
    const track = section.querySelector('[data-gallery-track]');
    if (!(stage instanceof HTMLElement) || !(track instanceof HTMLElement)) return;

    const wide = window.matchMedia(WIDE);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let distance = 0;
    let pinned = false;

    const setup = () => {
        pinned = wide.matches && !reduce.matches;
        section.classList.toggle('is-pinned', pinned);
        track.style.transform = '';
        section.style.height = '';
        if (!pinned) return;
        distance = Math.max(0, track.scrollWidth - stage.clientWidth);
        section.style.height = `${distance + window.innerHeight}px`;
    };

    /** @param {number} p */
    const render = (p) => {
        if (!pinned) return;
        track.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
    };

    setup();
    const request = trackProgress(section, render);
    const refresh = () => {
        setup();
        request();
    };
    onResizeSettled(refresh);
    wide.addEventListener('change', refresh);
    reduce.addEventListener('change', refresh);
    document.fonts.ready.then(refresh).catch(refresh);

    track.addEventListener('focusin', (event) => {
        const item = event.target instanceof Element ? event.target.closest('a') : null;
        if (!pinned || !(item instanceof HTMLElement) || distance === 0) return;
        const target = Math.min(1, Math.max(0, (item.offsetLeft - track.offsetLeft) / distance));
        const top = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + target * distance, behavior: 'auto' });
    });
}
