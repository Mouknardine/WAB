/**
 * Les petites écritures de l'accueil en ligne (js/desk/pixels-ink.js du
 * site), reprises pour l'instrument : les signes, les mots, et la façon
 * dont ils apparaissent. Un signe se brouille 260 ms avant de se fixer ;
 * un mot se tape à 34 ms par lettre.
 */

export const SIGNES = Array.from('{}<>/\\#$%&*+=;:01_|~^?!@[]()▓▒░█⌘⌥⇧↵');
export const LETTRES = Array.from('abcdefghijklmnopqrstuvwxyz');
export const MOTS = ['hello', 'wab', 'lausanne', '<div>', 'git push', 'design', 'code', 'ok', ':)', 'brothers', 'build', 'v1.0', 'npm i', '</>', 'hi!', '404', 'print', 'run'];

const BROUILLAGE = 260;
const FRAPPE = 34;

/**
 * @typedef {Object} Signe
 * @property {number[]} cellules  indices des cases occupées (une rangée)
 * @property {string} texte
 * @property {number} teinte  1 à 6 : la teinte de l'aplat (ou de l'isolé)
 * @property {boolean} isole  lettre posée sur le papier, dans la teinte
 * @property {number} ne  instant d'apparition (performance.now)
 */

/** @template T @param {readonly T[]} liste @returns {T} */
export const auHasard = (liste) => liste[Math.floor(Math.random() * liste.length)];

/**
 * Vrai tant que le signe se brouille ou que le mot se tape.
 * @param {Signe} signe @param {number} maintenant
 */
export function enMouvement(signe, maintenant) {
    const age = maintenant - signe.ne;
    return signe.texte.length > 1 ? age < signe.texte.length * FRAPPE : age < BROUILLAGE;
}

/**
 * Le texte affiché à cet instant.
 * @param {Signe} signe @param {number} maintenant @param {boolean} fige  mouvement réduit
 * @returns {string}
 */
export function texteAffiche(signe, maintenant, fige) {
    if (fige || !enMouvement(signe, maintenant)) return signe.texte;
    if (signe.texte.length > 1) {
        return signe.texte.slice(0, Math.max(1, Math.floor((maintenant - signe.ne) / FRAPPE)));
    }
    return auHasard(SIGNES);
}

/**
 * Les mots qui tiennent dans `cases` cellules.
 * @param {number} cases @param {(mot: string) => number} casesPour
 * @returns {string[]}
 */
export const motsPour = (cases, casesPour) => MOTS.filter((mot) => casesPour(mot) <= cases);
