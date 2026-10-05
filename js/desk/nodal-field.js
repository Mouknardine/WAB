// @ts-check
/**
 * WAB. — Le fond des cartes : les lignes nodales
 * Quatre sources d'ondes invisibles se superposent ; on ne dessine,
 * en caractères mono, que les lignes où elles s'annulent. Le reste
 * du bleu reste vide : de fines courbes qui glissent lentement.
 * Le pointeur devient une cinquième source, en opposition de phase,
 * qui réorganise les courbes autour de lui puis s'efface au départ.
 *
 * Calcul seul ici, sans DOM : le dessin et le cycle de vie sont dans
 * nodal-lines.js.
 */

export const RAMP = ' .:-=+*#%@';
export const ALPHA_BUCKETS = 6;

/** Positions relatives des quatre sources, sur un quadrilatère irrégulier. */
export const SOURCES = [
    { nx: 0.24, ny: 0.3, amp: 1.0, phi: 0.0, drift: 0.05 },
    { nx: 0.76, ny: 0.26, amp: 0.88, phi: 0.6, drift: -0.037 },
    { nx: 0.3, ny: 0.74, amp: 1.12, phi: 1.9, drift: 0.061 },
    { nx: 0.72, ny: 0.78, amp: 0.95, phi: 3.1, drift: -0.044 },
];

const K = 0.042; // nombre d'onde, rad/px
const OMEGA = 1.15; // pulsation, rad/s
const R_MIN = 8; // px : la décroissance en 1/√r ne s'emballe pas
const BAND_PX = 4; // demi-largeur du trait autour de la ligne nodale
const NODE_POW = 1.3;
const FLAT_GUARD = 0.4; // une case trop « forte » n'est jamais encrée

/**
 * Les sources vivantes, en px. La case `count` sert au pointeur.
 * @typedef {{ x: Float64Array, y: Float64Array, amp: Float64Array, phase: Float64Array, count: number }} Emitters
 */

/** @param {number} capacity @returns {Emitters} */
export function createEmitters(capacity) {
    return {
        x: new Float64Array(capacity),
        y: new Float64Array(capacity),
        amp: new Float64Array(capacity),
        phase: new Float64Array(capacity),
        count: 0,
    };
}

/**
 * Intensité du trait en (x, y), entre 0 (rien) et 1 (sur la ligne).
 * A = Σ aᵢ·cos(k·rᵢ − ω·t + φᵢ)/√rᵢ ; la distance à la ligne nodale
 * vaut |A| / |∇A|, calculée plutôt qu'échantillonnée : un trait net
 * au lieu d'un semis de points.
 * @param {Emitters} e
 * @param {number} x
 * @param {number} y
 * @param {number} t secondes
 * @returns {number}
 */
export function nodeStrength(e, x, y, t) {
    let a = 0;
    let aMax = 0;
    let gradX = 0;
    let gradY = 0;

    for (let s = 0; s < e.count; s++) {
        const amp = e.amp[s] ?? 0;
        if (amp <= 0.001) continue;
        const dx = x - (e.x[s] ?? 0);
        const dy = y - (e.y[s] ?? 0);
        const r = Math.max(Math.sqrt(dx * dx + dy * dy), R_MIN);
        const inv = amp / Math.sqrt(r);
        const theta = K * r - OMEGA * t + (e.phase[s] ?? 0);
        const c = Math.cos(theta);
        a += inv * c;
        aMax += inv;
        const dAdr = -inv * Math.sin(theta) * K - (0.5 * inv * c) / r;
        gradX += (dAdr * dx) / r;
        gradY += (dAdr * dy) / r;
    }

    if (aMax <= 1e-9) return 0;
    const abs = Math.abs(a);
    if (abs / aMax > FLAT_GUARD) return 0;
    const grad = Math.sqrt(gradX * gradX + gradY * gradY);
    if (grad < 1e-9) return 0;
    const distance = abs / grad;
    if (distance >= BAND_PX) return 0;
    return Math.pow(1 - distance / BAND_PX, NODE_POW);
}
