/**
 * Les apparitions : une petite animation détourée (Hello Kitty, les
 * Super Nanas, les cœurs) posée d'un coup à un endroit libre, à plat,
 * montrée 2,5 s puis cachée. Jamais la même deux fois de suite. Ce sont
 * des images animées (APNG) et non des vidéos : leur transparence est
 * gérée partout, y compris sur iPhone où une vidéo à fond transparent
 * laissait un carré vert autour du personnage. Chaque image n'est
 * chargée qu'à sa première apparition.
 */

import { placeLibre, zoneJeu, tenirDansZone } from './zones.js';

const DUREE = 2500;
const DELAI_CHARGEMENT = 3000;
const TROP_LENTE = 'Image trop lente';

/**
 * @typedef {Object} Apparition
 * @property {string} nom  fichier assets/anim/<nom>.png
 * @property {number} hauteur  part de la hauteur d'écran (0–1)
 * @property {number} ratio  largeur / hauteur de l'image (connu avant son chargement)
 */

/** @type {Apparition[]} */
const APPARITIONS = [
    { nom: 'kitty', hauteur: 0.4, ratio: 500 / 460 },
    { nom: 'nanas', hauteur: 0.24, ratio: 510 / 240 },
    { nom: 'coeurs', hauteur: 0.28, ratio: 240 / 250 },
];

/** @param {Apparition} apparition @returns {HTMLImageElement} */
function creerImage(apparition) {
    const image = document.createElement('img');
    image.className = 'surprise-image';
    image.alt = '';
    image.hidden = true;
    image.decoding = 'async';
    image.setAttribute('aria-hidden', 'true');
    image.src = `/instrument/assets/anim/${apparition.nom}.png`;
    return image;
}

/**
 * Attend que l'image soit chargée ; rejette si elle tarde trop ou si le
 * fichier est introuvable.
 * @param {HTMLImageElement} image
 * @returns {Promise<void>}
 */
function charger(image) {
    if (image.complete && image.naturalWidth > 0) return Promise.resolve();
    return new Promise((resoudre, rejeter) => {
        const attente = window.setTimeout(() => rejeter(new Error(TROP_LENTE)), DELAI_CHARGEMENT);
        image.addEventListener('load', () => {
            window.clearTimeout(attente);
            resoudre();
        }, { once: true });
        image.addEventListener('error', () => {
            window.clearTimeout(attente);
            rejeter(new Error('Image introuvable'));
        }, { once: true });
    });
}

/**
 * @param {HTMLElement} calque  conteneur décoratif (aria-hidden)
 * @returns {() => Promise<boolean>} montre une apparition ; faux si elle n'a pas pu s'afficher
 */
export function creerApparitions(calque) {
    /** @type {Map<string, HTMLImageElement>} */
    const images = new Map();
    /** @type {Set<string>} */
    const enPanne = new Set();
    let derniere = '';

    const choisir = () => {
        const possibles = APPARITIONS.filter((a) => a.nom !== derniere && !enPanne.has(a.nom));
        const choix = possibles[Math.floor(Math.random() * possibles.length)];
        if (choix) derniere = choix.nom;
        return choix;
    };

    return async () => {
        const apparition = choisir();
        if (!apparition) return false;
        let image = images.get(apparition.nom);
        if (!image) {
            image = creerImage(apparition);
            images.set(apparition.nom, image);
            calque.append(image);
        }
        const voulue = zoneJeu().hauteur * apparition.hauteur;
        const { largeur, hauteur } = tenirDansZone(voulue * apparition.ratio, voulue);
        const { x, y } = placeLibre(largeur, hauteur, image);
        image.style.width = `${Math.round(largeur)}px`;
        image.style.height = `${Math.round(hauteur)}px`;
        image.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
        try {
            await charger(image);
        } catch (erreur) {
            // Trop lente : on réessaiera. Autre erreur (fichier absent) : on y renonce.
            if (!(erreur instanceof Error && erreur.message === TROP_LENTE)) enPanne.add(apparition.nom);
            return false;
        }
        const affichee = image;
        affichee.hidden = false;
        window.clearTimeout(Number(affichee.dataset.fin ?? 0));
        affichee.dataset.fin = String(window.setTimeout(() => {
            affichee.hidden = true;
        }, DUREE));
        return true;
    };
}
