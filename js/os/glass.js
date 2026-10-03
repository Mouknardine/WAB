// @ts-check
/**
 * WAB OS — le reflet qui suit la souris sur les boutons de verre
 * Pose --gb-x et --gb-y (en pixels) sur le .glass-btn survolé : le
 * reflet de sa coque (glass-btn.css) se déplace sous le pointeur.
 * Une seule écoute pour toute la page, une écriture par image.
 * Souris seulement, jamais sous « réduire les animations ».
 */

export function initGlass() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    /** @type {{ el: HTMLElement, x: number, y: number } | null} */
    let pending = null;
    let frame = 0;

    const paint = () => {
        frame = 0;
        if (!pending) return;
        pending.el.style.setProperty('--gb-x', `${pending.x}px`);
        pending.el.style.setProperty('--gb-y', `${pending.y}px`);
        pending = null;
    };

    document.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse' || reduced.matches || !(event.target instanceof Element)) return;
        const button = event.target.closest('.glass-btn');
        if (!(button instanceof HTMLElement)) return;
        const rect = button.getBoundingClientRect();
        pending = { el: button, x: Math.round(event.clientX - rect.left), y: Math.round(event.clientY - rect.top) };
        if (!frame) frame = requestAnimationFrame(paint);
    }, { passive: true });

    // Le pointeur s'en va : le reflet revient en haut, au centre.
    document.addEventListener('pointerout', (event) => {
        if (!(event.target instanceof Element)) return;
        const button = event.target.closest('.glass-btn');
        if (!(button instanceof HTMLElement) || button.contains(/** @type {Node | null} */ (event.relatedTarget))) return;
        button.style.removeProperty('--gb-x');
        button.style.removeProperty('--gb-y');
    });
}
