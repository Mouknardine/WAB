// @ts-check
/**
 * WAB OS — l'horloge de Lausanne
 * Accès typé aux fonctions de nav-clock.js (window.WABClock), seule
 * implémentation de l'heure et du statut du studio sur tout le site.
 */

/**
 * @typedef {object} LausanneMoment
 * @property {number} hour
 * @property {string | undefined} weekday
 */

/**
 * @typedef {object} WabClock
 * @property {string} ZONE
 * @property {(date: Date) => LausanneMoment} readLausanne
 * @property {(moment: LausanneMoment) => { text: string }} statusFor
 * @property {(moment: LausanneMoment) => 'matin' | 'jour' | 'soir' | 'nuit'} phaseFor
 */

/** @returns {WabClock | null} */
export function getClock() {
    const host = /** @type {{ WABClock?: WabClock }} */ (/** @type {unknown} */ (window));
    return host.WABClock ?? null;
}
