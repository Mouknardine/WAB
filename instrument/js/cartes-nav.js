/**
 * La navigation au pouce d'un paquet, sur téléphone : en bas de la zone,
 * une rangée de carrés de progression (un par carte, cliquables) ou, s'ils
 * ne tiennent pas à 44 px chacun, le compte « 4/10 » ; puis deux grands
 * boutons « ← Précédent » et « Suivant → » (bouclés, comme au bureau).
 * Au bureau, ce bloc est caché : l'en-tête de la carte porte ← →.
 */

const CIBLE = 44;

/**
 * @typedef {{ maj: (courante: number) => void, ajuster: () => void }} Nav
 */

/**
 * @param {string} classe @param {string} [texte] @param {string} [balise]
 * @returns {HTMLElement}
 */
function el(classe, texte, balise = 'div') {
    const noeud = document.createElement(balise);
    noeud.className = classe;
    if (texte !== undefined) noeud.textContent = texte;
    return noeud;
}

/**
 * @param {string} texte @param {string} fleche @param {boolean} avant  flèche avant le texte
 * @param {string} sens
 * @returns {HTMLButtonElement}
 */
function grandBouton(texte, fleche, avant, sens) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'paquet__pas';
    b.dataset.sens = sens;
    const signe = el('paquet__signe', fleche, 'span');
    signe.setAttribute('aria-hidden', 'true');
    const mot = el('', texte, 'span');
    b.append(...(avant ? [signe, mot] : [mot, signe]));
    return b;
}

/**
 * Ajoute la navigation à la région d'une rubrique de plusieurs cartes.
 * @param {HTMLElement} region
 * @param {number} nombre  cartes dans le paquet
 * @param {(indice: number) => void} aller  montre la carte d'indice donné
 * @param {(sens: number) => void} pas  carte précédente (-1) ou suivante (1)
 * @returns {Nav}
 */
export function creerNav(region, nombre, aller, pas) {
    const nav = el('paquet__nav');
    nav.setAttribute('role', 'group');
    nav.setAttribute('aria-label', 'Parcourir les cartes');
    const points = el('paquet__points');
    const carres = Array.from({ length: nombre }, (_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'paquet__point';
        b.setAttribute('aria-label', `Carte ${i + 1} sur ${nombre}`);
        b.addEventListener('click', () => aller(i));
        return b;
    });
    points.append(...carres);
    const compte = el('paquet__compte', '', 'p');
    const pas2 = el('paquet__pas2');
    pas2.append(grandBouton('Précédent', '←', true, '-1'), grandBouton('Suivant', '→', false, '1'));
    pas2.addEventListener('click', (e) => {
        const b = e.target instanceof Element ? e.target.closest('.paquet__pas') : null;
        if (b instanceof HTMLElement) pas(Number(b.dataset.sens));
    });
    nav.append(points, compte, pas2);
    region.append(nav);

    return {
        maj(courante) {
            carres.forEach((b, i) => {
                if (i === courante) b.setAttribute('aria-current', 'step');
                else b.removeAttribute('aria-current');
            });
            compte.textContent = `${courante + 1}/${nombre}`;
        },
        // Les carrés ne s'affichent que s'ils gardent chacun 44 px de large
        ajuster() {
            const largeur = nav.getBoundingClientRect().width;
            nav.dataset.mode = largeur && nombre * CIBLE > largeur ? 'compte' : 'points';
        },
    };
}

/**
 * Le petit mot « Glissez pour la suite », montré une seule fois par visite.
 * @param {HTMLElement} region
 * @returns {() => void} à appeler à chaque ouverture
 */
export function creerIndice(region) {
    const indice = el('paquet__indice', 'Glissez pour la suite', 'p');
    indice.hidden = true;
    region.querySelector('.rubrique__cartes')?.after(indice);
    return () => {
        let deja = true;
        try {
            deja = window.sessionStorage.getItem('wab-glisser-vu') === '1';
            window.sessionStorage.setItem('wab-glisser-vu', '1');
        } catch {
            // Stockage refusé (navigation privée stricte) : l'indice ne s'affiche pas.
        }
        document.querySelectorAll('.paquet__indice').forEach((i) => { i.hidden = true; });
        indice.hidden = deja;
    };
}
