/**
 * Les apparitions : une petite animation détourée (Hello Kitty, les
 * Super Nanas, les cœurs) posée d'un coup à un endroit libre, à plat,
 * jouée 2,5 s puis cachée et mise en pause. Jamais la même deux fois de
 * suite. Chaque vidéo n'est créée qu'à sa première apparition. Safari
 * lit la version HEVC (.mov), les autres navigateurs la version VP9 (.webm).
 */

import { placeLibre, zoneJeu, tenirDansZone } from './zones.js';

const DUREE = 2500;
const DELAI_LECTURE = 1500;
const TROP_LENTE = 'Vidéo trop lente';

/**
 * @typedef {Object} Apparition
 * @property {string} nom  fichiers assets/anim/<nom>.mov et .webm
 * @property {number} hauteur  part de la hauteur d'écran (0–1)
 * @property {number} ratio  largeur / hauteur de la vidéo (connu avant son chargement)
 */

/** @type {Apparition[]} */
const APPARITIONS = [
    { nom: 'kitty', hauteur: 0.4, ratio: 500 / 460 },
    { nom: 'nanas', hauteur: 0.24, ratio: 510 / 240 },
    { nom: 'coeurs', hauteur: 0.28, ratio: 240 / 250 },
];

/** @param {Apparition} apparition @returns {HTMLVideoElement} */
function creerVideo(apparition) {
    const video = document.createElement('video');
    video.className = 'surprise-image';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.hidden = true;
    video.tabIndex = -1;
    video.setAttribute('aria-hidden', 'true');
    for (const [ext, type] of [['mov', 'video/mp4; codecs="hvc1"'], ['webm', 'video/webm']]) {
        const source = document.createElement('source');
        source.src = `/instrument/assets/anim/${apparition.nom}.${ext}`;
        source.type = type;
        video.append(source);
    }
    return video;
}

/**
 * Lance la lecture ; rejette si elle n'a pas démarré à temps.
 * @param {HTMLVideoElement} video
 * @returns {Promise<void>}
 */
function lire(video) {
    return new Promise((resoudre, rejeter) => {
        const attente = window.setTimeout(() => rejeter(new Error(TROP_LENTE)), DELAI_LECTURE);
        video.play().then(() => {
            window.clearTimeout(attente);
            resoudre();
        }, (erreur) => {
            window.clearTimeout(attente);
            rejeter(erreur);
        });
    });
}

/**
 * @param {HTMLElement} calque  conteneur décoratif (aria-hidden)
 * @returns {() => Promise<boolean>} montre une apparition ; faux si elle n'a pas pu jouer
 */
export function creerApparitions(calque) {
    /** @type {Map<string, HTMLVideoElement>} */
    const videos = new Map();
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
        let video = videos.get(apparition.nom);
        if (!video) {
            video = creerVideo(apparition);
            videos.set(apparition.nom, video);
            calque.append(video);
        }
        const voulue = zoneJeu().hauteur * apparition.hauteur;
        const { largeur, hauteur } = tenirDansZone(voulue * apparition.ratio, voulue);
        const { x, y } = placeLibre(largeur, hauteur, video);
        video.style.width = `${Math.round(largeur)}px`;
        video.style.height = `${Math.round(hauteur)}px`;
        video.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
        try {
            await lire(video);
        } catch (erreur) {
            // Trop lente : on réessaiera. Autre erreur (format, fichier) : on y renonce.
            if (!(erreur instanceof Error && erreur.message === TROP_LENTE)) enPanne.add(apparition.nom);
            video.hidden = true;
            video.pause();
            return false;
        }
        const affichee = video;
        affichee.hidden = false;
        window.clearTimeout(Number(affichee.dataset.fin ?? 0));
        affichee.dataset.fin = String(window.setTimeout(() => {
            affichee.hidden = true;
            affichee.pause();
        }, DUREE));
        return true;
    };
}
