/**
 * Le chat qui danse : une vidéo à fond transparent, créée au premier
 * appel seulement, posée d'un coup à un endroit libre, jouée 3 s puis
 * cachée et mise en pause. Safari lit la version HEVC (.mov), les
 * autres navigateurs la version VP9 (.webm).
 */

import { placeLibre, zoneJeu, tenirDansZone } from './zones.js';

const DUREE = 3000;
const DELAI_LECTURE = 1500;
const TROP_LENTE = 'Vidéo trop lente';
const SOURCES = [
    { src: '/instrument/assets/chat.mov', type: 'video/mp4; codecs="hvc1"' },
    { src: '/instrument/assets/chat.webm', type: 'video/webm' },
];

/** @returns {HTMLVideoElement} */
function creerVideo() {
    const video = document.createElement('video');
    video.className = 'surprise-chat';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-hidden', 'true');
    video.tabIndex = -1;
    for (const { src, type } of SOURCES) {
        const source = document.createElement('source');
        source.src = src;
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
 * @param {HTMLElement} calque
 * @returns {() => Promise<boolean>} montre le chat ; faux s'il n'a pas pu danser
 */
export function creerChat(calque) {
    /** @type {HTMLVideoElement | null} */
    let video = null;
    let enPanne = false;
    let fin = 0;

    const cacher = () => {
        if (!video) return;
        video.hidden = true;
        video.pause();
    };

    return async () => {
        if (enPanne) return false;
        if (!video) {
            video = creerVideo();
            video.hidden = true;
            calque.append(video);
        }
        const voulue = zoneJeu().hauteur * (0.35 + Math.random() * 0.15);
        const ratio = video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 1;
        const { largeur, hauteur } = tenirDansZone(voulue * ratio, voulue);
        const { x, y } = placeLibre(largeur, hauteur, video);
        video.style.width = `${Math.round(largeur)}px`;
        video.style.height = `${Math.round(hauteur)}px`;
        video.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
        try {
            await lire(video);
        } catch (erreur) {
            // Trop lente : on réessaiera la prochaine fois. Autre erreur
            // (format non lu, fichier absent) : on renonce au chat.
            enPanne = !(erreur instanceof Error && erreur.message === TROP_LENTE);
            cacher();
            return false;
        }
        video.hidden = false;
        window.clearTimeout(fin);
        fin = window.setTimeout(cacher, DUREE);
        return true;
    };
}
