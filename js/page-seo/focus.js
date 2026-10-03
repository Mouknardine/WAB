// @ts-check
/**
 * Le focus suit le défilement (motif de l'accueil, ici pour les
 * formats) : seul le bloc qui traverse le milieu de l'écran garde sa
 * fenêtre et ses bulles nettes ; les autres s'estompent légèrement.
 * Le texte, lui, reste toujours pleinement lisible (page-seo-feats.css).
 *
 * Sans IntersectionObserver, ou sous « réduire les animations », rien
 * n'est estompé : .is-tracking n'est jamais posée.
 */

export function initFocus() {
    const root = document.querySelector('[data-sx-feats]');
    if (!(root instanceof HTMLElement) || !('IntersectionObserver' in window)) return;
    const feats = Array.from(root.querySelectorAll('.sx-feat'));
    if (!feats.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => root.classList.toggle('is-tracking', !reduced.matches);
    sync();
    reduced.addEventListener('change', sync);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            feats.forEach((feat) => feat.classList.toggle('is-current', feat === entry.target));
        });
    }, { rootMargin: '-45% 0px -45% 0px' });

    feats.forEach((feat) => observer.observe(feat));
}
