/**
 * Passage d'une carte à l'autre dans un paquet. L'en-tête ne bouge pas,
 * seul son numéro change. Pendant ce temps :
 * - la carte prend sa nouvelle hauteur en douceur (le paquet dessous suit) ;
 * - l'ancien contenu glisse de 16 px dans le sens du geste et s'efface,
 *   le nouveau arrive de l'autre côté, ligne après ligne (30 ms d'écart) ;
 * - les deux cartes du dessous se resserrent puis reprennent leur place,
 *   comme si l'on venait de tirer une carte du paquet.
 * Tout est interruptible : un nouveau clic termine net le passage en cours.
 * En mouvement réduit, le contenu passe en fondu, sans glissement.
 */

import { mouvementReduit } from './jetons.js';

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_TIROIR = 'cubic-bezier(0.32, 0.72, 0, 1)';
const DUREE_HAUTEUR = 320;
const DUREE_SORTIE = 160;
const DUREE_ENTREE = 280;
const DELAI_ENTREE = 30;
const DECALAGE_LIGNE = 30;
const GLISSEMENT = 16;

/** @type {WeakMap<HTMLElement, () => void>} */
const enCours = new WeakMap();

/** Le contenu d'une carte, hors en-tête. @param {HTMLElement} carte @returns {HTMLElement[]} */
function contenu(carte) {
    return [...carte.children].filter((c) => c instanceof HTMLElement && !c.classList.contains('carte__tete'));
}

/** Les lignes du contenu qui arrivent l'une après l'autre. @param {HTMLElement} carte @returns {HTMLElement[]} */
function lignes(carte) {
    return contenu(carte).flatMap((bloc) => (bloc.classList.contains('carte__corps')
        ? [...bloc.children].filter((c) => c instanceof HTMLElement)
        : [bloc]));
}

/**
 * L'ancienne carte reste posée par-dessus, sans fond ni bord ni en-tête,
 * le temps que son contenu s'efface.
 * @param {HTMLElement} carte @returns {() => void} remet la carte en état
 */
function figerFantome(carte) {
    const largeur = carte.offsetWidth;
    const scroll = carte.scrollTop;
    carte.hidden = false;
    carte.setAttribute('data-fantome', '');
    carte.setAttribute('aria-hidden', 'true');
    carte.style.width = `${largeur}px`;
    carte.scrollTop = scroll;
    return () => {
        carte.hidden = true;
        carte.removeAttribute('data-fantome');
        carte.removeAttribute('aria-hidden');
        carte.style.width = '';
    };
}

/** Les cartes du dessous se resserrent un instant. @param {HTMLElement | null} pile @returns {Animation[]} */
function respirerPile(pile) {
    if (!pile) return [];
    const options = { duration: DUREE_HAUTEUR, easing: EASE_TIROIR };
    return [['::after', 6, 2], ['::before', 12, 5]].map(([pseudo, repos, serre]) => pile.animate(
        [{ translate: `${repos}px ${repos}px` }, { translate: `${serre}px ${serre}px` }, { translate: `${repos}px ${repos}px` }],
        { ...options, pseudoElement: String(pseudo) },
    ));
}

/**
 * @param {HTMLElement} ancienne  carte qui s'en va (déjà cachée)
 * @param {HTMLElement} nouvelle  carte qui arrive (déjà visible, à sa place)
 * @param {number} sens  1 suivante, -1 précédente
 * @param {number} hauteurAvant  hauteur de l'ancienne carte, mesurée avant le changement
 */
export function passerCarte(ancienne, nouvelle, sens, hauteurAvant) {
    const pile = nouvelle.parentElement;
    if (pile) enCours.get(pile)?.();
    const reduit = mouvementReduit();
    const dx = reduit ? 0 : GLISSEMENT * Math.sign(sens || 1);
    const remettre = figerFantome(ancienne);
    const hauteurApres = nouvelle.offsetHeight;

    /** @type {Animation[]} */
    const animations = contenu(ancienne).map((bloc) => bloc.animate(
        [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: `${-dx}px 0` }],
        { duration: DUREE_SORTIE, easing: EASE_OUT, fill: 'forwards' },
    ));
    lignes(nouvelle).forEach((ligne, i) => animations.push(ligne.animate(
        [{ opacity: 0, translate: `${dx}px 0` }, { opacity: 1, translate: '0 0' }],
        { duration: DUREE_ENTREE, delay: DELAI_ENTREE + i * DECALAGE_LIGNE, easing: EASE_OUT, fill: 'backwards' },
    )));
    if (!reduit && Math.abs(hauteurApres - hauteurAvant) > 1) {
        animations.push(nouvelle.animate(
            [{ height: `${hauteurAvant}px`, overflow: 'hidden' }, { height: `${hauteurApres}px`, overflow: 'hidden' }],
            { duration: DUREE_HAUTEUR, easing: EASE_TIROIR },
        ));
    }
    if (!reduit) animations.push(...respirerPile(pile));

    let fini = false;
    const terminer = () => {
        if (fini) return;
        fini = true;
        animations.forEach((a) => a.cancel());
        remettre();
        if (pile) enCours.delete(pile);
    };
    if (pile) enCours.set(pile, terminer);
    Promise.all(animations.map((a) => a.finished)).then(terminer, () => {});
    // Sortie finie : le fantôme s'en va sans attendre l'entrée
    window.setTimeout(() => { if (!fini) remettre(); }, DUREE_SORTIE);
}
