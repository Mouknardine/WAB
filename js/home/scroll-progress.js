// @ts-check
/**
 * WAB. — Progression d'une section au défilement
 * Renvoie, à chaque image, où en est le visiteur dans une section
 * plus haute que l'écran : 0 quand son haut touche le haut de
 * l'écran, 1 quand son bas touche le bas. C'est ce nombre que les
 * scènes de l'accueil (ouverture, planche) traduisent en mouvement.
 *
 * Un seul calcul par image, quel que soit le nombre d'évènements de
 * défilement reçus entre-temps.
 */

/**
 * @param {number} value
 * @returns {number}
 */
export function clamp01(value) {
    return Math.min(1, Math.max(0, value));
}

/**
 * Suit la progression d'une section et appelle `onProgress` à chaque
 * image où elle a pu changer.
 * @param {HTMLElement} section
 * @param {(progress: number) => void} onProgress
 * @returns {() => void} une fonction qui redemande un calcul (après une
 *   nouvelle mesure, par exemple)
 */
export function trackProgress(section, onProgress) {
    let pending = false;

    const update = () => {
        pending = false;
        const rect = section.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        onProgress(travel > 0 ? clamp01(-rect.top / travel) : 0);
    };

    const request = () => {
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    request();
    return request;
}

/**
 * Exécute `callback` après un redimensionnement, une fois la fenêtre
 * stabilisée : on ne remesure pas cinquante fois pendant qu'on tire
 * le coin d'une fenêtre.
 * @param {() => void} callback
 */
export function onResizeSettled(callback) {
    let timer = 0;
    window.addEventListener('resize', () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(callback, 150);
    });
}
