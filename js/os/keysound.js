// @ts-check
/**
 * WAB OS — le bruit des touches
 * Quand on appuie sur une touche du site (les boutons-touches, les
 * lettres du nom, le logo, le sommaire, les onglets…), un petit
 * « clac » de vieux clavier mécanique : le choc du capuchon puis le
 * ressort qui remonte, synthétisés à la volée (Web Audio, aucun
 * fichier à charger). Chaque frappe varie un peu, comme une vraie
 * touche.
 *
 * Le son ne part que sur un geste du visiteur (le navigateur l'exige),
 * jamais au défilement ni au clavier en navigation, et se coupe avec
 * « réduire les animations ».
 */

const KEYS = [
    '.key-btn',
    '.key',
    '.menubar__link',
    '.dock__chip',
    '.dock__item',
    '.topbar__menu',
    '.pw-finder__view',
    '.app-tab',
].join(', ');

/** Volume général, discret : un clavier dans la pièce d'à côté. */
const VOLUME = 0.32;

/** @type {AudioContext | null} */
let audio = null;
/** @type {AudioBuffer | null} */
let noise = null;

function context() {
    if (audio) return audio;
    const Ctor = window.AudioContext ?? /** @type {typeof AudioContext | undefined} */ (/** @type {any} */ (window).webkitAudioContext);
    if (!Ctor) return null;
    audio = new Ctor();
    // Un bruit blanc court, réutilisé à chaque frappe.
    noise = audio.createBuffer(1, Math.round(audio.sampleRate * 0.08), audio.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    return audio;
}

/**
 * Un éclat de bruit filtré : la matière du « clac ».
 * @param {AudioContext} ctx @param {number} at @param {number} freq
 * @param {number} gain @param {number} length en secondes
 */
function burst(ctx, at, freq, gain, length) {
    if (!noise) return;
    const source = ctx.createBufferSource();
    source.buffer = noise;
    source.playbackRate.value = 0.9 + Math.random() * 0.2;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = freq;
    band.Q.value = 1.4;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(gain, at + 0.002);
    env.gain.exponentialRampToValueAtTime(0.0001, at + length);
    source.connect(band).connect(env).connect(ctx.destination);
    source.start(at, Math.random() * 0.03, length + 0.01);
}

/** Le corps de la touche qui résonne, grave et très court. */
function thump(ctx, at, gain) {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190 + Math.random() * 40, at);
    osc.frequency.exponentialRampToValueAtTime(80, at + 0.05);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(gain, at + 0.003);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 0.06);
    osc.connect(env).connect(ctx.destination);
    osc.start(at);
    osc.stop(at + 0.07);
}

/** La frappe : le choc à l'appui. */
function down() {
    const ctx = context();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => undefined);
    const at = ctx.currentTime + 0.001;
    const v = VOLUME * (0.85 + Math.random() * 0.3);
    burst(ctx, at, 2600 + Math.random() * 900, v, 0.035);
    burst(ctx, at, 900 + Math.random() * 300, v * 0.6, 0.05);
    thump(ctx, at, v * 0.5);
}

/** Le ressort qui remonte : un clic plus léger au relâchement. */
function up() {
    if (!audio || audio.state !== 'running') return;
    const at = audio.currentTime + 0.001;
    burst(audio, at, 3400 + Math.random() * 800, VOLUME * 0.35, 0.025);
}

export function initKeySound() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let pressed = false;

    document.addEventListener('pointerdown', (event) => {
        if (reducedMotion.matches || event.button !== 0) return;
        const target = event.target instanceof Element ? event.target.closest(KEYS) : null;
        if (!target || target.matches(':disabled, [aria-disabled="true"]')) return;
        pressed = true;
        down();
    }, { passive: true });

    const release = () => {
        if (!pressed) return;
        pressed = false;
        up();
    };
    document.addEventListener('pointerup', release, { passive: true });
    document.addEventListener('pointercancel', () => { pressed = false; }, { passive: true });
}
