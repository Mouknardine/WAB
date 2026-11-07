/**
 * Clavier : traduit une touche en gestes.
 * La frappe n'est jamais captée quand le focus est sur un lien ou un
 * bouton, ni avec une touche de raccourci (Ctrl, Cmd, Alt).
 */

import { fabriquer } from './gestes.js';
import { noteDeTouche, noteGrande } from './clavier.js';
import { petitEcran } from './jetons.js';

// Le focus sur une carte (ou dans une carte) ne joue pas l'instrument
const ELEMENTS_ACTIFS = 'a, button, input, textarea, select, [contenteditable], .carte, .rubrique';

/**
 * @typedef {import('./gestes-dessin.js').Geste} Geste
 * @typedef {{
 *   jouer: (gestes: Geste[]) => void,
 *   effacer: () => void,
 *   composer: () => void,
 *   signaler: (geste: Geste) => void,
 *   surprendre: (options?: { billets?: boolean }) => void,
 *   dimensions: () => { cols: number, rows: number },
 *   enfoncer?: (note: import('./touches-dessinees.js').NoteJouee) => void,
 * }} Actions
 * @typedef {import('./clavier.js').Note} Note
 */

/**
 * @param {string} type @param {Partial<Geste>} reglages
 * @returns {Geste}
 */
const nouveau = (type, reglages) => fabriquer(type, reglages, Math.random, performance.now());

/**
 * Sur téléphone, une lettre se pose en grand au hasard plutôt qu'à sa
 * place sur le clavier (trop petite sur un écran étroit).
 * @param {Note} note @param {Actions} actions
 * @returns {Note}
 */
function adapterLettre(note, actions) {
    if (note.type !== 'lettre' || !petitEcran()) return note;
    const lettre = (note.reglages.lettre ?? '').toLowerCase();
    return noteGrande(lettre, actions.dimensions(), note.reglages.teinte ?? 1) ?? note;
}

/**
 * @param {Actions} actions
 */
export function relierClavier(actions) {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
        const actif = document.activeElement;
        if (actif instanceof Element && actif.closest(ELEMENTS_ACTIFS)) return;
        const note = noteDeTouche(e.key);
        if (!note) return;
        e.preventDefault();
        actions.enfoncer?.(note);
        actions.surprendre({ billets: note === 'composer' });
        if (note === 'effacer') return actions.effacer();
        if (note === 'composer') return actions.composer();
        const jouee = adapterLettre(note, actions);
        const geste = nouveau(jouee.type, jouee.reglages);
        actions.jouer([geste]);
        actions.signaler(geste);
    });
}
