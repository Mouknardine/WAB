// @ts-check
/**
 * WAB. — Accueil : le halo du premier écran suit la souris
 *
 * Le halo rejoint le curseur avec un léger retard (il glisse, il ne
 * colle pas) ; il est déplacé par --glow-x / --glow-y, lus par un
 * `translate` en CSS : aucun repeint, seulement la composition.
 * L'animation s'arrête dès que le halo est arrivé, et ne tourne que
 * lorsque le premier écran est visible.
 *
 * Sans souris fine (téléphone, tablette), le CSS le fait dériver
 * seul ; sous « réduire les animations », il reste immobile.
 */

/** Part du chemin restant parcourue à chaque image (60 i/s). */
const FOLLOW = 0.08;
/** En deçà de cet écart, en px, le halo est arrivé. */
const SETTLED = 0.5;

export function initHeroGlow() {
    const hero = document.querySelector('.hero');
    const glow = hero?.querySelector('.hero__glow');
    if (!(hero instanceof HTMLElement) || !(glow instanceof HTMLElement)) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let started = false;
    let rafId = 0;

    function paint() {
        glow.style.setProperty('--glow-x', `${current.x.toFixed(1)}px`);
        glow.style.setProperty('--glow-y', `${current.y.toFixed(1)}px`);
    }

    function step() {
        current.x += (target.x - current.x) * FOLLOW;
        current.y += (target.y - current.y) * FOLLOW;
        paint();
        const settled = Math.abs(target.x - current.x) < SETTLED && Math.abs(target.y - current.y) < SETTLED;
        rafId = settled ? 0 : requestAnimationFrame(step);
    }

    /** @param {PointerEvent} event */
    function onMove(event) {
        if (event.pointerType === 'touch' || reducedMotion.matches) return;
        const rect = hero.getBoundingClientRect();
        target.x = event.clientX - rect.left;
        target.y = event.clientY - rect.top;
        // Premier mouvement : le halo part de sa place de repos (CSS).
        if (!started) {
            const rest = glow.getBoundingClientRect();
            current.x = rest.left + rest.width / 2 - rect.left;
            current.y = rest.top + rest.height / 2 - rect.top;
            started = true;
        }
        if (!rafId) rafId = requestAnimationFrame(step);
    }

    hero.addEventListener('pointermove', onMove, { passive: true });
}
