/**
 * Glisser horizontal au doigt sur un paquet de cartes : vers la gauche,
 * carte suivante ; vers la droite, carte précédente. La carte suit le
 * doigt pendant le geste ; une distance suffisante OU un geste vif
 * (vitesse) change de carte, sinon elle revient en place (200 ms,
 * css/mouvement.css). Seul le premier doigt compte. Le défilement
 * vertical dans la carte reste libre (touch-action: pan-y en CSS).
 */

const SEUIL = 48;
/** Un geste vif suffit, même court (px par ms). */
const VITESSE = 0.11;
const DISTANCE_MIN_VIF = 16;
/** Sous ce déplacement, on ne sait pas encore si le geste est horizontal. */
const AMORCE = 8;
const DUREE_RETOUR = 200;

/**
 * @typedef {{ x: number, y: number, t: number, id: number, horizontal: boolean | null }} Depart
 */

/** @param {HTMLElement} paquet @returns {HTMLElement | null} */
const carteVisible = (paquet) => paquet.querySelector('.carte:not([hidden])');

/** @param {HTMLElement | null} carte @param {number} dx */
function decaler(carte, dx) {
    if (carte) carte.style.translate = dx ? `${Math.round(dx)}px 0` : '';
}

/** @param {HTMLElement | null} carte */
function ramener(carte) {
    if (!carte) return;
    carte.setAttribute('data-retour', '');
    decaler(carte, 0);
    window.setTimeout(() => carte.removeAttribute('data-retour'), DUREE_RETOUR);
}

/**
 * @param {HTMLElement} paquet
 * @param {(sens: number) => void} changer  -1 précédente, 1 suivante
 */
export function relierGlisser(paquet, changer) {
    /** @type {Depart | null} */
    let depart = null;

    paquet.addEventListener('pointerdown', (e) => {
        // Un deuxième doigt pendant le geste est ignoré
        if (depart || e.pointerType !== 'touch' || !e.isPrimary) return;
        if (!(e.target instanceof Element) || e.target.closest('.carte__tete')) return;
        depart = { x: e.clientX, y: e.clientY, t: e.timeStamp, id: e.pointerId, horizontal: null };
    });

    paquet.addEventListener('pointermove', (e) => {
        if (!depart || e.pointerId !== depart.id) return;
        const dx = e.clientX - depart.x;
        const dy = e.clientY - depart.y;
        if (depart.horizontal === null && Math.hypot(dx, dy) >= AMORCE) {
            depart.horizontal = Math.abs(dx) > Math.abs(dy);
        }
        if (depart.horizontal) decaler(carteVisible(paquet), dx);
    });

    paquet.addEventListener('pointerup', (e) => {
        if (!depart || e.pointerId !== depart.id) return;
        const dx = e.clientX - depart.x;
        const vitesse = Math.abs(dx) / Math.max(1, e.timeStamp - depart.t);
        const horizontal = depart.horizontal;
        depart = null;
        const carte = carteVisible(paquet);
        const assez = Math.abs(dx) >= SEUIL || (vitesse > VITESSE && Math.abs(dx) >= DISTANCE_MIN_VIF);
        if (!horizontal || !assez) {
            ramener(carte);
            return;
        }
        // La nouvelle carte se pose d'un coup, à sa place
        decaler(carte, 0);
        changer(dx < 0 ? 1 : -1);
    });

    paquet.addEventListener('pointercancel', () => {
        depart = null;
        ramener(carteVisible(paquet));
    });
}
