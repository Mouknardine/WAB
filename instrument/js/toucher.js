/**
 * Le retour au doigt : une vibration brève (Android ; Safari iOS ne vibre
 * pas, il garde l'appui visuel).
 */

const DUREE_VIBRATION = 10;

/** Vibre brièvement si l'appareil le permet ; ne fait rien sinon. */
export function vibrer() {
    if (typeof navigator.vibrate !== 'function') return;
    try {
        navigator.vibrate(DUREE_VIBRATION);
    } catch {
        // Vibration refusée (réglage, iframe) : l'appui visuel suffit.
    }
}

/**
 * Safari iOS n'applique :active (l'état « appuyé » des boutons) que si la
 * page écoute touchstart. Un écouteur passif, qui ne fait rien d'autre,
 * suffit à rendre l'appui visible sous le doigt.
 */
export function activerAppuiTactile() {
    document.addEventListener('touchstart', () => undefined, { passive: true });
}

/** Tout ce qui s'enfonce à l'appui (css/mouvement.css). */
const TOUCHES = '.paquet__pas, .jeu__rubrique, .paquet__point, .jeu__lien, .carte__fermer, .carte__nav, .choix__touche, .formulaire__envoyer';
/** Un clic éclair dure ~60 ms : la touche reste enfoncée au moins ce temps-là. */
const APPUI_MIN = 140;

/**
 * Pose data-appui sur la touche pressée et ne l'enlève qu'après
 * APPUI_MIN, pour que l'enfoncement se voie même sur un clic très bref.
 */
export function relierAppuis() {
    /** @type {{ el: Element, t: number } | null} */
    let appui = null;
    const relacher = () => {
        if (!appui) return;
        const { el, t } = appui;
        appui = null;
        window.setTimeout(() => el.removeAttribute('data-appui'), Math.max(0, APPUI_MIN - (performance.now() - t)));
    };
    document.addEventListener('pointerdown', (e) => {
        const el = e.target instanceof Element ? e.target.closest(TOUCHES) : null;
        if (!el || e.button !== 0) return;
        el.setAttribute('data-appui', '');
        appui = { el, t: performance.now() };
    });
    for (const type of ['pointerup', 'pointercancel']) document.addEventListener(type, relacher);
}
