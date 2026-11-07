/**
 * Les touches de clavier dessinées sous les rubriques, au bureau (A–Z,
 * 0–9, Espace, Entrée), s'enfoncent 140 ms quand on tape vraiment la
 * touche : elles reprennent la note déjà lue par js/controles.js, sans
 * relire le clavier elles-mêmes.
 */

const DUREE = 140;

/**
 * @typedef {import('./clavier.js').Note | 'effacer' | 'composer'} NoteJouee
 */

/** @param {NoteJouee} note @returns {string} */
function touchePour(note) {
    if (note === 'effacer') return 'espace';
    if (note === 'composer') return 'entree';
    return note.type === 'lettre' ? 'lettres' : 'chiffres';
}

/**
 * @returns {(note: NoteJouee) => void} enfonce la touche dessinée de cette note
 */
export function creerTouchesDessinees() {
    /** @type {Map<Element, number>} */
    const minuteries = new Map();
    return (note) => {
        const kbd = document.querySelector(`.jeu__touches kbd[data-touche="${touchePour(note)}"]`);
        if (!kbd) return;
        window.clearTimeout(minuteries.get(kbd));
        kbd.setAttribute('data-appui', '');
        minuteries.set(kbd, window.setTimeout(() => kbd.removeAttribute('data-appui'), DUREE));
    };
}
