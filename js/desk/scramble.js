// @ts-check
/**
 * WAB. — Le nom qui se brouille (premier écran de l'accueil)
 * Le nom est tapé en touches de clavier ([data-scramble] .key__face,
 * desk-keys.css). Au survol, la touche touchée affiche quelques
 * symboles de couleur puis reprend sa lettre ; au toucher, tout le
 * nom se brouille en vague. Les touches ont une taille fixe : rien ne
 * bouge autour. Le nom lisible pour les lecteurs d'écran est à part,
 * dans le H1. Le point (.key--dot) est dessiné, il ne change pas.
 *
 * Avec « mouvement réduit », les lettres restent telles quelles.
 */

const GLYPHS = Array.from('{}<>/\\#$%&*+=;:01_|~^?!@[]▓▒░█');
/** Les teintes que prend un symbole (os-tints.css) ; le jaune, trop
    pâle sur une touche blanche, n'en est pas. */
const TINTS = ['bleu', 'ciel', 'vert', 'rose', 'rouge'];
const STEPS = 5;
const STEP_MS = 55;
const WAVE_MS = 35;

/** @template T @param {T[]} list @returns {T} */
function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
}

export function initScramble() {
    const word = document.querySelector('[data-scramble]');
    if (!(word instanceof HTMLElement)) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /** @type {HTMLElement[]} */
    const faces = Array.from(word.querySelectorAll('.key:not(.key--dot) .key__face'));
    const letters = faces.map((face) => face.textContent ?? '');
    /** @type {WeakSet<HTMLElement>} */
    const busy = new WeakSet();

    /** @param {HTMLElement} face @param {string} letter */
    function scramble(face, letter) {
        if (busy.has(face) || reducedMotion.matches) return;
        busy.add(face);
        face.classList.add('is-glyph');
        // Sur une touche de couleur, le symbole garde l'encre de la touche.
        const tinted = face.closest('[data-tint]') !== null;
        if (!tinted) face.dataset.tint = pick(TINTS);
        let step = 0;
        face.textContent = pick(GLYPHS);
        const timer = window.setInterval(() => {
            step += 1;
            if (step <= STEPS) {
                face.textContent = pick(GLYPHS);
                return;
            }
            window.clearInterval(timer);
            face.textContent = letter;
            face.classList.remove('is-glyph');
            if (!tinted) delete face.dataset.tint;
            busy.delete(face);
        }, STEP_MS);
    }

    faces.forEach((face, i) => {
        face.parentElement?.addEventListener('pointerenter', (event) => {
            if (event.pointerType !== 'touch') scramble(face, letters[i]);
        });
    });

    word.addEventListener('touchstart', () => {
        faces.forEach((face, i) => window.setTimeout(() => scramble(face, letters[i]), i * WAVE_MS));
    }, { passive: true });
}
