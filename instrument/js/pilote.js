/**
 * Le pilote : quand personne ne joue, l'instrument joue seul. Dérive
 * des pixels à chaque battement, et un geste à intervalles réguliers.
 * Vif à l'arrivée (un geste toutes les 0,85 à 1,4 s), il ralentit en
 * 25 s jusqu'à un rythme posé (2 à 3,2 s), la dérive aussi.
 * Il se tait dès que le visiteur joue, reprend 4 s plus tard en
 * douceur, s'arrête quand l'onglet est caché.
 * Une seule boucle requestAnimationFrame, réglée sur l'horloge réelle.
 */

import { deriver } from './derive.js';
import { choisirGestes } from './choix.js';

const BATTEMENT = 110;
const ATTENTE_REPRISE = 4000;
const RAMPE = 2000;
const PREMIER_GESTE = 600;
const RALENTI = 25000;
const VIF = { intervalle: 850, variation: 550, derive: 0.0045 };
const POSE = { intervalle: 2000, variation: 1200, derive: 0.0018 };

/** @param {number} a @param {number} b @param {number} k */
const entre = (a, b, k) => a + (b - a) * k;

/**
 * @typedef {import('./instrument.js').Instrument} Instrument
 * @typedef {Object} Pilote
 * @property {() => void} interrompre  le visiteur vient de jouer
 */

/**
 * @param {Instrument} instrument
 * @param {() => void} [battement]  à chaque battement (les écritures vivent aussi)
 * @param {() => void} [apresGeste]  après chaque geste joué seul (un message, parfois)
 * @returns {Pilote}
 */
export function creerPilote(instrument, battement = () => {}, apresGeste = () => {}) {
    let image = 0;
    let reprise = 0;
    let prochainGeste = 0;
    let dernierBattement = 0;
    const naissance = performance.now();

    /** De 0 (arrivée) à 1 (rythme posé). @param {number} maintenant */
    const calme = (maintenant) => Math.min(1, (maintenant - naissance) / RALENTI);

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
        const part = entre(VIF.derive, POSE.derive, calme(maintenant));
        const nombre = Math.round(Math.max(3, cols * rows * part) * rampe);
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
            instrument.jouer(choisirGestes(instrument.densite(), performance.now()));
            apresGeste();
            const k = calme(maintenant);
            prochainGeste = maintenant + entre(VIF.intervalle, POSE.intervalle, k)
                + Math.random() * entre(VIF.variation, POSE.variation, k);
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
