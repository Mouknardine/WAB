/**
 * Fabrique les cartes d'une rubrique à partir de js/cartes-donnees.js :
 * un <article> par carte, avec un en-tête en aplat (nom de la rubrique,
 * numéro, bouton de fermeture) qui sert aussi de poignée au bureau.
 */

/**
 * @typedef {import('./cartes-donnees.js').Rubrique} Rubrique
 * @typedef {import('./cartes-donnees.js').Carte} Carte
 * @typedef {import('./cartes-donnees.js').Lien} Lien
 */

import { fabriquerFormulaire } from './formulaire-rendu.js';
import { relierFormulaire } from './formulaire.js';

const IMAGES = '/assets/images';

/**
 * @param {string} balise @param {string} classe @param {string} [texte]
 * @returns {HTMLElement}
 */
function el(balise, classe, texte) {
    const noeud = document.createElement(balise);
    noeud.className = classe;
    if (texte !== undefined) noeud.textContent = texte;
    return noeud;
}

/**
 * @param {string} src @param {string} classe @param {number} largeur @param {number} hauteur @param {string} alt
 * @returns {HTMLImageElement}
 */
function image(src, classe, largeur, hauteur, alt) {
    const img = document.createElement('img');
    Object.assign(img, { src, className: classe, width: largeur, height: hauteur, alt, loading: 'lazy', decoding: 'async' });
    return img;
}

/**
 * Bouton d'en-tête : un signe visible, un libellé pour les lecteurs d'écran.
 * @param {string} classe @param {string} libelle @param {string} signe @param {string} [sens]
 * @returns {HTMLButtonElement}
 */
function bouton(classe, libelle, signe, sens) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = classe;
    b.setAttribute('aria-label', libelle);
    if (sens) b.dataset.sens = sens;
    const visible = el('span', classe === 'carte__fermer' ? 'carte__croix' : '', signe);
    visible.setAttribute('aria-hidden', 'true');
    b.append(visible);
    return b;
}

/** @param {Lien} lien @returns {HTMLAnchorElement} */
function ancre(lien) {
    const a = document.createElement('a');
    a.href = lien.href;
    a.textContent = lien.texte;
    if (lien.externe) {
        a.target = '_blank';
        a.rel = 'noopener';
        const fleche = el('span', 'carte__fleche', ' ↗');
        fleche.setAttribute('aria-hidden', 'true');
        a.append(fleche, el('span', 'visuellement-cache', ' (nouvel onglet)'));
    }
    return a;
}

/**
 * @param {Rubrique} rubrique @param {Carte} carte @param {number} i
 * @returns {HTMLElement}
 */
function fabriquerCarte(rubrique, carte, i) {
    const article = el('article', 'carte');
    const idTitre = `carte-${rubrique.id}-${i + 1}`;
    article.tabIndex = -1;
    article.hidden = true;
    article.setAttribute('aria-labelledby', idTitre);

    const tete = el('div', 'carte__tete');
    const nom = el('span', 'carte__rubrique', rubrique.nom);
    if (rubrique.cartes.length > 1) nom.append(el('span', 'carte__numero', ` ${i + 1}/${rubrique.cartes.length}`));
    const actions = el('div', 'carte__actions');
    if (rubrique.cartes.length > 1) {
        actions.append(bouton('carte__nav', 'Carte précédente', '←', '-1'), bouton('carte__nav', 'Carte suivante', '→', '1'));
    }
    const fermer = bouton('carte__fermer', `Fermer la rubrique ${rubrique.nom}`, '×');
    fermer.append(el('span', 'carte__fermer-mot', 'Fermer'));
    actions.append(fermer);
    tete.append(nom, actions);
    article.append(tete);

    if (carte.mockup) {
        article.append(image(`${IMAGES}/work-${carte.mockup}-720.webp`, 'carte__image carte__image--mockup', 720, 900, `Le site ${carte.titre} sur un appareil`));
    } else if (carte.image) {
        article.append(image(`${IMAGES}/shot-${carte.image}-800.webp`, 'carte__image', 800, 500, `Le site ${carte.titre}, page d’accueil`));
    }
    const corps = el('div', 'carte__corps');
    const titre = el('h2', 'carte__titre', carte.titre);
    titre.id = idTitre;
    if (carte.avatar) {
        const ligne = el('div', 'carte__personne');
        ligne.append(image(`${IMAGES}/avatar-${carte.avatar}.webp`, 'carte__avatar', 144, 144, ''), titre);
        corps.append(ligne);
    } else {
        corps.append(titre);
    }
    if (carte.prix) corps.append(el('p', 'carte__prix', carte.prix));
    corps.append(el('p', 'carte__texte', carte.texte));
    if (carte.formulaire) {
        const { formulaire, bloc } = fabriquerFormulaire();
        relierFormulaire(formulaire, bloc);
        corps.append(bloc);
    }
    if (carte.liens?.length) {
        const liens = el('p', 'carte__liens');
        liens.append(...carte.liens.map(ancre));
        corps.append(liens);
    }
    if (carte.lieu) corps.append(el('p', 'carte__lieu', carte.lieu));
    article.append(corps);
    return article;
}

/**
 * Remplit la région d'une rubrique (déjà dans la page) avec ses cartes.
 * @param {HTMLElement} region @param {Rubrique} rubrique
 * @returns {HTMLElement[]} les cartes, dans l'ordre
 */
export function remplirRubrique(region, rubrique) {
    const liste = el('div', 'rubrique__cartes');
    const cartes = rubrique.cartes.map((carte, i) => fabriquerCarte(rubrique, carte, i));
    liste.append(...cartes);
    region.replaceChildren(liste);
    return cartes;
}
