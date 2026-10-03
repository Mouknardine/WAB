// @ts-check
/**
 * Services — le focus suit le défilement
 * Dans chaque famille, seul le bloc qui traverse le milieu de l'écran
 * est pleinement net ; les autres restent estompés
 * (page-services-feats.css) et la frappe ne s'anime que sur le bloc
 * courant. Une bande fine au centre de l'écran sert de repère : un seul
 * bloc la touche à la fois.
 *
 * Sans IntersectionObserver, ou sous « réduire les animations », rien
 * n'est estompé : la classe .is-tracking n'est jamais posée.
 */

const ROOT = '[data-svc-feats]';
const FEAT = '.svc-feat';

export function initFocus() {
    if (!('IntersectionObserver' in window)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const roots = Array.from(document.querySelectorAll(ROOT)).filter(
        /** @returns {el is HTMLElement} */ (el) => el instanceof HTMLElement,
    );
    if (!roots.length) return;

    const feats = roots.flatMap((root) => Array.from(root.querySelectorAll(FEAT)));
    const sync = () => roots.forEach((root) => root.classList.toggle('is-tracking', !reduced.matches));
    sync();
    reduced.addEventListener('change', sync);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            feats.forEach((feat) => feat.classList.toggle('is-current', feat === entry.target));
        });
    }, { rootMargin: '-48% 0px -48% 0px' });

    feats.forEach((feat) => observer.observe(feat));
}
