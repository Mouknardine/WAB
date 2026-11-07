/**
 * Le pilote : quand personne ne joue, l'instrument joue seul. Dérive
 * lente des pixels à chaque battement, et un geste toutes les 2 à 3 s.
 * Il se tait dès que le visiteur joue, reprend 4 s plus tard en
 * douceur, s'arrête quand l'onglet est caché.
 * Une seule boucle requestAnimationFrame, réglée sur l'horloge réelle.
 */

import { deriver } from './derive.js';
import { choisirGestes } from './choix.js';

const BATTEMENT = 140;
const ATTENTE_REPRISE = 4000;
const RAMPE = 2000;
const PREMIER_GESTE = 1500;
const INTERVALLE_MIN = 2000;
const INTERVALLE_VARIATION = 1000;
const PART_DERIVE = 0.0016;

/**
 * @typedef {import('./instrument.js').Instrument} Instrument
 * @typedef {Object} Pilote
 * @property {() => void} interrompre  le visiteur vient de jouer
 */

/**
 * @param {Instrument} instrument
 * @param {() => void} [battement]  à chaque battement (les écritures vivent aussi)
 * @returns {Pilote}
 */
export function creerPilote(instrument, battement = () => {}) {
    let image = 0;
    let reprise = 0;
    let prochainGeste = 0;
    let dernierBattement = 0;

    /** @param {number} maintenant */
    function relancerHorloge(maintenant) {
        reprise = maintenant;
        prochainGeste = maintenant + PREMIER_GESTE;
        dernierBattement = maintenant;
    }

    /** @param {number} maintenant */
    function battre(maintenant) {
        const rampe = Math.min(1, (maintenant - reprise) / RAMPE);
        const { cols, rows } = instrument.dimensions();
        const nombre = Math.round(Math.max(3, cols * rows * PART_DERIVE) * rampe);
        if (nombre > 0) instrument.deriver((g) => deriver(g, nombre));
        battement();
        dernierBattement = maintenant;
    }

    /** @param {number} maintenant */
    function tourner(maintenant) {
        image = requestAnimationFrame(tourner);
        if (maintenant < reprise) return;
        if (maintenant - dernierBattement >= BATTEMENT) battre(maintenant);
        if (maintenant >= prochainGeste) {
            instrument.jouer(choisirGestes(instrument.densite(), instrument.dimensions(), performance.now()));
            prochainGeste = maintenant + INTERVALLE_MIN + Math.random() * INTERVALLE_VARIATION;
        }
    }

    function demarrer() {
        if (image || document.hidden) return;
        relancerHorloge(performance.now());
        image = requestAnimationFrame(tourner);
    }

    function arreter() {
        cancelAnimationFrame(image);
        image = 0;
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) arreter();
        else demarrer();
    });

    demarrer();

    return {
        interrompre() {
            const maintenant = performance.now();
            reprise = maintenant + ATTENTE_REPRISE;
            prochainGeste = reprise + PREMIER_GESTE;
        },
    };
}
