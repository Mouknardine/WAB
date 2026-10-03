// @ts-check
/**
 * WAB OS — le focus suit le défilement
 * Dans les services, seul le bloc qui traverse le milieu de l'écran
 * est pleinement net ; les autres restent estompés (desk-chat.css)
 * et se révèlent en douceur quand on y arrive. Une bande fine au
 * centre de l'écran sert de repère : un seul bloc la touche à la fois.
 *
 * Sans IntersectionObserver, ou sous « réduire les animations »,
 * rien n'est estompé : la classe .is-tracking n'est jamais posée.
 */

export function initFocusScroll() {
    const root = document.querySelector('[data-feats]');
    if (!(root instanceof HTMLElement) || !('IntersectionObserver' in window)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const feats = Array.from(root.querySelectorAll('.feat'));
    if (!feats.length) return;

    const sync = () => root.classList.toggle('is-tracking', !reduced.matches);
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
