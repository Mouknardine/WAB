// @ts-check
/**
 * WAB OS — le dock se range pendant la lecture
 * On descend : il glisse sous le bord de l'écran, rien n'est caché
 * derrière lui. On remonte, on approche la souris du bas, on arrive en
 * fin de page (la place y est réservée) ou on y entre au clavier : il
 * revient.
 */

const DELTA = 6;
const NEAR_BOTTOM = 90;
const TOP_ZONE = 240;

export function initDockHide() {
    const dock = document.querySelector('[data-dock]');
    if (!(dock instanceof HTMLElement)) return;

    let last = window.scrollY;
    let ticking = false;
    /** @param {boolean} tucked */
    const set = (tucked) => dock.classList.toggle('is-tucked', tucked && !dock.matches(':focus-within'));

    const onScroll = () => {
        ticking = false;
        const y = window.scrollY;
        const atEnd = window.innerHeight + y >= document.documentElement.scrollHeight - 4;
        if (atEnd || y < TOP_ZONE || y < last - DELTA) set(false);
        else if (y > last + DELTA) set(true);
        last = y;
    };

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(onScroll);
    }, { passive: true });

    window.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'mouse' && event.clientY > window.innerHeight - NEAR_BOTTOM) set(false);
    }, { passive: true });

    dock.addEventListener('focusin', () => set(false));
}
