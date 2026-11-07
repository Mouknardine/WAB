/**
 * Trouve une place libre à l'écran pour une surprise : hors des bords
 * (marque, contact, phrases, consignes, rubriques), pour que le contact et
 * le texte de présentation restent toujours lisibles, et hors des
 * surprises déjà affichées. La place est cherchée dans la zone de
 * l'instrument (#surprises, calé sur la grille : tout l'écran au bureau,
 * la bande du milieu sur téléphone) et rendue relative à cette zone.
 */

const BORDS = '.bord';
const SURPRISES = '.surprise-message, .surprise-chat:not([hidden]), .surprise-image:not([hidden])';
const MARGE = 12;
const ESSAIS = 60;
// Recouvrir un bord (contact, phrases, consignes) coûte bien plus cher que
// recouvrir une autre surprise : le texte du studio reste lisible d'abord.
const POIDS_BORD = 20;
// Les cartes ouvertes sont lues avant tout : une surprise ne s'y pose pas.
const CARTES = '.rubrique:not([hidden]):not([data-placement]) .carte:not([hidden])';
const POIDS_CARTE = 40;
const ZONE = '#surprises';

/**
 * Cadre de la zone de jeu, en px de la fenêtre ; la fenêtre entière à défaut.
 * @returns {{ x: number, y: number, largeur: number, hauteur: number }}
 */
export function zoneJeu() {
    const zone = document.querySelector(ZONE);
    const r = zone?.getBoundingClientRect();
    if (!r || r.width === 0 || r.height === 0) {
        return { x: 0, y: 0, largeur: window.innerWidth, hauteur: window.innerHeight };
    }
    return { x: r.left, y: r.top, largeur: r.width, hauteur: r.height };
}

/**
 * @typedef {{ x: number, y: number, l: number, h: number, poids: number }} Cadre
 */

const MARGE_ZONE = 16;

/**
 * Réduit une taille (en gardant ses proportions) pour qu'elle tienne dans
 * la zone de jeu, marge comprise : une surprise n'est jamais coupée.
 * @param {number} largeur @param {number} hauteur
 * @returns {{ largeur: number, hauteur: number }}
 */
export function tenirDansZone(largeur, hauteur) {
    const zone = zoneJeu();
    const echelle = Math.min(1, (zone.largeur - MARGE_ZONE * 2) / largeur, (zone.hauteur - MARGE_ZONE * 2) / hauteur);
    return { largeur: largeur * Math.max(0, echelle), hauteur: hauteur * Math.max(0, echelle) };
}

/**
 * @param {string} selecteur
 * @param {number} poids
 * @param {Element | null} exclu  l'élément qu'on est en train de placer
 * @returns {Cadre[]}
 */
function cadres(selecteur, poids, exclu) {
    return [...document.querySelectorAll(selecteur)]
        .filter((el) => el !== exclu)
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width > 0 && r.height > 0)
        .map((r) => ({ x: r.left - MARGE, y: r.top - MARGE, l: r.width + MARGE * 2, h: r.height + MARGE * 2, poids }));
}

/**
 * @typedef {{ bord: number, carte: number }} Poids
 * @param {Element | null} exclu
 * @param {Poids} poids
 * @returns {Cadre[]}
 */
function zonesInterdites(exclu, poids) {
    return [...cadres(BORDS, poids.bord, exclu), ...cadres(CARTES, poids.carte, exclu), ...cadres(SURPRISES, 1, exclu)];
}

/**
 * @param {Cadre} a @param {Cadre} b
 * @returns {number} surface commune
 */
function recouvrement(a, b) {
    const l = Math.min(a.x + a.l, b.x + b.l) - Math.max(a.x, b.x);
    const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    return l > 0 && h > 0 ? l * h : 0;
}

/**
 * Vrai si ce cadre (relatif à la zone de jeu) recouvre le contact ou les textes.
 * @param {number} x @param {number} y @param {number} largeur @param {number} hauteur
 */
export function toucheUnBord(x, y, largeur, hauteur) {
    const zone = zoneJeu();
    const essai = { x: zone.x + x, y: zone.y + y, l: largeur, h: hauteur, poids: 1 };
    return cadres(BORDS, 1, null).some((z) => recouvrement(essai, z) > 0);
}

/**
 * Places essayées avant le hasard : les coins de la zone et les positions
 * collées à chaque obstacle (dessous, dessus, à gauche, à droite). Quand la
 * seule place libre est une bande étroite, le hasard la rate ; elles non.
 * @param {Cadre[]} interdites @param {{ x: number, y: number }} zone
 * @param {number} largeur @param {number} hauteur @param {number} maxX @param {number} maxY
 * @returns {Generator<{ x: number, y: number }>}
 */
function* placesCalculees(interdites, zone, largeur, hauteur, maxX, maxY) {
    const borne = (v, max) => Math.max(0, Math.min(v, max));
    const xs = [0, maxX];
    const ys = [0, maxY];
    for (const z of interdites) {
        xs.push(borne(z.x - zone.x - largeur, maxX), borne(z.x - zone.x + z.l, maxX));
        ys.push(borne(z.y - zone.y - hauteur, maxY), borne(z.y - zone.y + z.h, maxY));
    }
    for (const x of xs) for (const y of ys) yield { x, y };
}

/**
 * Position (coin haut gauche, relative à la zone de jeu) pour un objet de
 * taille donnée. Si aucune place n'est entièrement libre, garde celle qui
 * recouvre le moins.
 * @param {number} largeur
 * @param {number} hauteur
 * @param {Element | null} [exclu]  l'élément à placer, s'il est déjà dans la page
 * @param {Poids} [poids]  coût d'un recouvrement (les cartes, elles, évitent
 *   d'abord le contact et les textes, puis les autres cartes)
 * @returns {{ x: number, y: number }}
 */
export function placeLibre(largeur, hauteur, exclu = null, poids = { bord: POIDS_BORD, carte: POIDS_CARTE }) {
    const interdites = zonesInterdites(exclu, poids);
    const zone = zoneJeu();
    const maxX = Math.max(0, zone.largeur - largeur);
    const maxY = Math.max(0, zone.hauteur - hauteur);
    const essais = [...placesCalculees(interdites, zone, largeur, hauteur, maxX, maxY)];
    for (let i = 0; i < ESSAIS; i += 1) essais.push({ x: Math.random() * maxX, y: Math.random() * maxY });
    let meilleure = { x: maxX / 2, y: maxY / 2 };
    let moindre = Infinity;
    for (const { x, y } of essais) {
        const essai = { x: zone.x + x, y: zone.y + y, l: largeur, h: hauteur, poids: 1 };
        const gene = interdites.reduce((somme, z) => somme + recouvrement(essai, z) * z.poids, 0);
        if (gene < moindre) {
            moindre = gene;
            meilleure = { x, y };
        }
        if (gene === 0) break;
    }
    return meilleure;
}
