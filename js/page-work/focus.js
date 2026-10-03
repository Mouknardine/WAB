// @ts-check
/**
 * WAB. — page Work : le focus suit le défilement
 * Sur un écran large avec souris, seul le projet qui traverse le
 * milieu de l'écran est pleinement net ; les autres restent estompés
 * (page-work-pieces.css). Une bande fine au centre de l'écran sert de
 * repère : un seul bloc la touche à la fois.
 *
 * Au téléphone, sans IntersectionObserver ou sous « réduire les
 * animations », rien n'est estompé : .is-tracking n'est jamais posée.
 */

export function initFocus() {
    const root = document.querySelector('[data-pieces]');
    if (!(root instanceof HTMLElement) || !('IntersectionObserver' in window)) return;
    const pieces = Array.from(root.querySelectorAll('.piece'));
    if (!pieces.length) return;

    const wide = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => root.classList.toggle('is-tracking', wide.matches && !reduced.matches);
    sync();
    wide.addEventListener('change', sync);
    reduced.addEventListener('change', sync);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            pieces.forEach((piece) => piece.classList.toggle('is-current', piece === entry.target));
        });
    }, { rootMargin: '-48% 0px -48% 0px' });

    pieces.forEach((piece) => observer.observe(piece));
}
