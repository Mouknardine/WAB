/**
 * Compositions toutes faites : l'ouverture (la vague qui se forme à
 * l'arrivée), l'image d'accueil posée d'un coup en mouvement réduit, et
 * la composition au hasard de la touche Entrée.
 */

import { fabriquer } from './gestes.js';
import { noteDeLettre } from './clavier.js';
import { hasard, NB_TEINTES } from './grille.js';
import { petitEcran } from './jetons.js';
import { largeurDessin } from './glyphes.js';

const GRAINE_ACCUEIL = 20261106;
const ECART_CASCADE = 45;
// Téléphone : WAB d'un seul tenant, centré ; une colonne de trame entre les lettres
const ECART_WAB = 1;
// Ouverture : six couches de vague parallèles, une par teinte, lancées
// l'une après l'autre ; WAB se pose quand la vague a traversé.
const OUVERTURE = { attente: 250, couche: 1300, ecart: 140, pas: 0.075, lettres: 1500, ecartLettres: 120 };
// Téléphone : des bandes plus épaisses qui couvrent l'écran, une onde
// et demie, et une vague plus rapide (l'écran est étroit).
const VAGUE_TELEPHONE = { amplitude: 0.1, periodes: 1.4, pas: 0.1 };
const RYTHME_TELEPHONE = { couche: 750, ecart: 80, lettres: 950 };

/**
 * @typedef {import('./gestes-dessin.js').Geste} Geste
 * @typedef {{ cols: number, rows: number }} Dimensions
 */

/**
 * Sur téléphone, les lettres à leur place sur le clavier sont trop
 * petites : WAB se pose en un mot, au milieu, dans les teintes opposées
 * à celles qu'il recouvre (sans contour blanc, demande d'Eliott, 07.11).
 * @param {Dimensions} dim @param {() => number} rnd @param {number} t @param {number} ecart
 * @returns {Geste[]}
 */
function wabCentre(dim, rnd, t, ecart) {
    const cote = Math.min(dim.cols, dim.rows);
    // Le plus grand agrandissement entier qui tient dans la largeur
    const largeur1 = Array.from('WAB').reduce((s, l) => s + largeurDessin(l, 1), 0) + ECART_WAB * 2;
    const f = Math.max(1, Math.floor(Math.min((dim.cols * 0.9) / largeur1, (dim.rows * 0.3) / 9)));
    const ecartCol = ECART_WAB * f;
    const largeurs = Array.from('WAB', (l) => largeurDessin(l, f));
    let gauche = (dim.cols - (largeurs.reduce((a, b) => a + b, 0) + ecartCol * 2)) / 2;
    const y = 0.35 + rnd() * 0.3;
    const teinte = 1 + Math.floor(rnd() * NB_TEINTES);
    return Array.from('WAB', (lettre, i) => {
        const x = (gauche + largeurs[i] / 2) / dim.cols;
        gauche += largeurs[i] + ecartCol;
        return fabriquer('lettre', { lettre, teinte, y, contraste: true, x, taille: (9 * f) / cote }, rnd, t + i * ecart);
    });
}

/**
 * @param {string} lettre
 * @param {() => number} rnd
 * @param {number} t0
 * @returns {Geste[]}
 */
function jouerLettre(lettre, rnd, t0) {
    const note = noteDeLettre(lettre);
    return note ? [fabriquer(note.type, note.reglages, rnd, t0)] : [];
}

/**
 * Une suite de gestes variés, WAB joué à la fin.
 * @param {() => number} rnd
 * @param {number} maintenant
 * @param {number} ecart  délai entre deux gestes (0 = tout d'un coup)
 * @param {Dimensions} dim
 * @returns {Geste[]}
 */
function suite(rnd, maintenant, ecart, dim) {
    const types = [
        ['aplat', {}], ['pluie', {}], ['vague', {}], ['aplat', {}],
        ['forme', { forme: 'cercle' }], ['forme', { forme: 'carre' }],
        ['forme', { forme: 'croix' }], ['forme', { forme: 'cercle' }],
    ];
    /** @type {Geste[]} */
    const gestes = [];
    let t = maintenant;
    for (const [type, reglages] of types) {
        gestes.push(fabriquer(String(type), Object(reglages), rnd, t));
        t += ecart;
    }
    // WAB se joue en dernier : ses lettres restent au-dessus du reste.
    if (petitEcran()) return [...gestes, ...wabCentre(dim, rnd, t, ecart)];
    for (const lettre of 'wab') {
        gestes.push(...jouerLettre(lettre, rnd, t));
        t += ecart;
    }
    return gestes;
}

/**
 * L'image d'accueil, posée sans mouvement.
 * @param {Dimensions} dim
 * @returns {Geste[]}
 */
export function compositionAccueil(dim) {
    return suite(hasard(GRAINE_ACCUEIL), 0, 0, dim);
}

/**
 * Composition au hasard, jouée en cascade après la touche Entrée.
 * @param {number} maintenant
 * @param {Dimensions} dim
 * @returns {Geste[]}
 */
export function compositionHasard(maintenant, dim) {
    return suite(hasard(Math.floor(Math.random() * 1e9)), maintenant, ECART_CASCADE, dim);
}

/**
 * L'ouverture : une vague aux six teintes traverse l'écran de gauche à
 * droite, couche après couche, puis WAB se pose par-dessus, en teintes
 * opposées à la vague.
 * @param {number} maintenant
 * @param {Dimensions} dim
 * @returns {{ gestes: Geste[], duree: number }}
 */
export function compositionOuverture(maintenant, dim) {
    const rnd = hasard(GRAINE_ACCUEIL);
    const graine = Math.floor(rnd() * 1e9);
    const debut = maintenant + OUVERTURE.attente;
    const milieu = (NB_TEINTES - 1) / 2;
    const telephone = petitEcran();
    const forme = telephone ? VAGUE_TELEPHONE : { pas: OUVERTURE.pas };
    const rythme = telephone ? { ...OUVERTURE, ...RYTHME_TELEPHONE } : OUVERTURE;
    /** @type {Geste[]} */
    const gestes = Array.from({ length: NB_TEINTES }, (_, i) => fabriquer('vague', {
        ...forme,
        graine,
        teinte: i + 1,
        y: 0.5 + (i - milieu) * forme.pas,
        duree: rythme.couche,
    }, rnd, debut + i * rythme.ecart));
    const t = debut + rythme.lettres;
    if (telephone) gestes.push(...wabCentre(dim, rnd, t, OUVERTURE.ecartLettres));
    else {
        Array.from('wab').forEach((lettre, i) => {
            const note = noteDeLettre(lettre);
            if (note) gestes.push(fabriquer(note.type, { ...note.reglages, contraste: true }, rnd, t + i * OUVERTURE.ecartLettres));
        });
    }
    const fin = Math.max(...gestes.map((g) => g.t0 + g.duree));
    return { gestes, duree: fin - maintenant };
}

