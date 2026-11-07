/**
 * Les messages : gros texte à plat sur un aplat blanc ou noir, posé
 * d'un coup, effacé 1,2 s plus tard. Trois au plus en même temps : le
 * quatrième remplace le plus ancien. Jamais deux fois le même d'affilée.
 */

import { MESSAGES } from './messages.js';
import { placeLibre } from './zones.js';

const DUREE = 1200;
const MAX_ECRAN = 3;
/** Largeur maximale d'un message, en part de la zone de jeu. */
const LARGEUR_MAX = 0.86;

/**
 * Réduit la police d'un message qui dépasserait la zone, pour qu'il
 * reste sur une seule ligne.
 * @param {HTMLElement} el
 * @param {HTMLElement} calque
 */
function ajuster(el, calque) {
    const permis = calque.getBoundingClientRect().width * LARGEUR_MAX;
    const largeur = el.getBoundingClientRect().width;
    if (largeur <= permis || largeur === 0) return;
    const taille = parseFloat(getComputedStyle(el).fontSize);
    el.style.fontSize = `${Math.floor(taille * (permis / largeur))}px`;
}

/**
 * @param {HTMLElement} calque  conteneur décoratif (aria-hidden)
 * @returns {(texte?: string) => void} affiche un message (au hasard, ou celui donné)
 */
export function creerMessages(calque) {
    /** @type {HTMLElement[]} */
    const visibles = [];
    let dernier = '';

    const retirer = (/** @type {HTMLElement} */ el) => {
        const i = visibles.indexOf(el);
        if (i !== -1) visibles.splice(i, 1);
        el.remove();
    };

    const choisir = () => {
        // Ni le précédent, ni un message encore à l'écran.
        const affiches = visibles.map((el) => el.textContent);
        const possibles = MESSAGES.filter((m) => m !== dernier && !affiches.includes(m));
        dernier = possibles[Math.floor(Math.random() * possibles.length)] ?? MESSAGES[0] ?? '';
        return dernier;
    };

    return (impose) => {
        const texte = impose ?? choisir();
        if (!texte) return;
        if (visibles.length >= MAX_ECRAN) retirer(visibles[0]);

        const el = document.createElement('p');
        el.className = 'surprise-message';
        el.textContent = texte;
        el.dataset.fond = Math.random() < 0.5 ? 'blanc' : 'noir';
        el.style.setProperty('--taille', String(Math.random()));
        el.style.visibility = 'hidden';
        calque.append(el);
        ajuster(el, calque);

        const { width, height } = el.getBoundingClientRect();
        const { x, y } = placeLibre(width, height, el);
        el.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
        el.style.visibility = '';
        visibles.push(el);
        window.setTimeout(() => retirer(el), DUREE);
    };
}
