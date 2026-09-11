/**
 * WAB. — La timidité des oiseaux
 *
 * Deux questions, posées à chaque image :
 *
 *  — l'oiseau peut-il se montrer ici ? Non s'il recouvre un texte
 *    posé sur le papier : il s'efface alors en entier, doucement, car
 *    le découper serait pire — on verrait un demi-oiseau. Non plus
 *    s'il est presque entièrement caché derrière des cartes :
 *    passer derrière une carte est joli, n'en montrer qu'une tranche
 *    dans une fente ne l'est pas.
 *
 *  — l'endroit est-il dégagé ? Un oiseau resté longtemps effacé
 *    cherche un couloir sans texte ni carte, où il pourra voler
 *    entièrement à découvert.
 */

import { collectZones } from './zones.js';

/** Dégagement exigé autour d'une ligne de texte, en px. */
const KEEP_AWAY_X = 30;
const KEEP_AWAY_Y = 18;

/** Part de l'oiseau qui doit rester à l'air libre pour qu'il compte. */
const MIN_VISIBLE = 0.45;

/* Une page qui bouge — texte qui apparaît au défilement, carte qui se
   déplie, image qui arrive — déplace ses lignes pendant près d'une
   seconde. Plutôt que d'attendre la fin et de laisser un oiseau
   survoler un texte entre-temps, on remesure par petits coups tant
   que quelque chose remue. Un relevé coûte à peine plus d'une
   milliseconde. */
const PULSE_MS = 150;
const QUIET_MS = 900;

function overlaps(zones, x, y, w, h) {
    const right = x + w;
    const bottom = y + h;
    for (const zone of zones) {
        if (x < zone.right && right > zone.left && y < zone.bottom && bottom > zone.top) {
            return true;
        }
    }
    return false;
}

/**
 * Part du rectangle laissée à découvert par les zones données. Les
 * blocs relevés ne s'emboîtent pas, leurs recouvrements s'additionnent
 * donc sans double compte notable ; la somme est bornée par sécurité.
 */
function exposure(zones, x, y, w, h) {
    const area = w * h;
    if (area <= 0) return 0;

    const right = x + w;
    const bottom = y + h;
    let hidden = 0;

    for (const zone of zones) {
        const overlapW = Math.min(right, zone.right) - Math.max(x, zone.left);
        const overlapH = Math.min(bottom, zone.bottom) - Math.max(y, zone.top);
        if (overlapW > 0 && overlapH > 0) hidden += overlapW * overlapH;
    }

    return Math.max(0, 1 - hidden / area);
}

export function createShyness() {
    let zones = { texts: [], blocks: [] };
    let texts = [];
    let blocks = [];
    let lastScroll = null;
    let lastHeight = 0;

    /** Convertit une zone document en zone écran, marges comprises. */
    function onScreen(zone, scrollY, height, padX, padY) {
        const top = zone.y - scrollY - padY;
        const bottom = top + zone.h + padY * 2;
        if (bottom < 0 || top > height) return null;
        return { left: zone.x - padX, right: zone.x + zone.w + padX, top: top, bottom: bottom };
    }

    function project(list, scrollY, height, padX, padY) {
        const out = [];
        for (const zone of list) {
            const placed = onScreen(zone, scrollY, height, padX, padY);
            if (placed) out.push(placed);
        }
        return out;
    }

    /** Prépare les tests pour l'image en cours. */
    function frame(scrollY, height) {
        if (scrollY === lastScroll && height === lastHeight) return;
        lastScroll = scrollY;
        lastHeight = height;
        texts = project(zones.texts, scrollY, height, KEEP_AWAY_X, KEEP_AWAY_Y);
        blocks = project(zones.blocks, scrollY, height, 0, 0);
    }

    /**
     * Vrai si un oiseau posé là ne gêne aucun texte et reste assez
     * découvert pour être reconnaissable.
     */
    function canShow(x, y, w, h) {
        return !overlaps(texts, x, y, w, h)
            && exposure(blocks, x, y, w, h) >= MIN_VISIBLE;
    }

    /** Vrai si le rectangle ne recouvre ni texte ni bloc à fond plein. */
    function isOpen(x, y, w, h) {
        return !overlaps(texts, x, y, w, h) && !overlaps(blocks, x, y, w, h);
    }

    function measure() {
        zones = collectZones();
        lastScroll = null; // force la reprojection à l'écran
    }

    let pulse = null;
    let quietAt = 0;

    /** Remesure en boucle courte tant que la mise en page remue. */
    function measureWhileMoving() {
        quietAt = performance.now() + QUIET_MS;
        if (pulse !== null) return;

        pulse = setInterval(() => {
            measure();
            if (performance.now() >= quietAt) {
                clearInterval(pulse);
                pulse = null;
            }
        }, PULSE_MS);
    }

    return { frame, canShow, isOpen, measure, measureWhileMoving };
}
