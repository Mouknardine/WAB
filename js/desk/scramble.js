// @ts-check
/**
 * WAB. — Le nom qui se brouille (premier écran de l'accueil)
 * Découpe le mot [data-scramble] en lettres de largeur fixe : au
 * survol, chaque lettre touchée passe par quelques symboles bleus
 * puis revient ; au toucher, tout le mot se brouille en vague. Le
 * mot ne bouge jamais (largeurs relevées, desk-hero.css). Le nom
 * lisible pour les lecteurs d'écran est à part, dans le H1.
 *
 * Avec « mouvement réduit », les lettres restent telles quelles.
 */

const GLYPHS = Array.from('{}<>/\\#$%&*+=;:01_|~^?!@[]▓▒░█');
const STEPS = 5;
const STEP_MS = 55;
const WAVE_MS = 35;

export function initScramble() {
    const word = document.querySelector('[data-scramble]');
    if (!(word instanceof HTMLElement)) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const letters = Array.from(word.textContent ?? '');
    word.textContent = '';
    const chars = letters.map((letter) => {
        const span = document.createElement('span');
        span.className = 'hero__char';
        span.textContent = letter;
        word.append(span);
        return span;
    });

    /** @type {WeakSet<HTMLElement>} */
    const busy = new WeakSet();

    function freezeWidths() {
        chars.forEach((span) => { span.style.width = ''; });
        const widths = chars.map((span) => span.getBoundingClientRect().width);
        chars.forEach((span, i) => { span.style.width = `${widths[i]}px`; });
    }

    /** @param {HTMLElement} span @param {string} letter */
    function scramble(span, letter) {
        if (busy.has(span) || reducedMotion.matches) return;
        busy.add(span);
        span.classList.add('is-glyph');
        let step = 0;
        const timer = window.setInterval(() => {
            step += 1;
            if (step > STEPS) {
                window.clearInterval(timer);
                span.textContent = letter;
                span.classList.remove('is-glyph');
                busy.delete(span);
                return;
            }
            span.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }, STEP_MS);
        span.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }

    chars.forEach((span, i) => {
        span.addEventListener('pointerenter', (event) => {
            if (event.pointerType !== 'touch') scramble(span, letters[i]);
        });
    });

    word.addEventListener('touchstart', () => {
        chars.forEach((span, i) => window.setTimeout(() => scramble(span, letters[i]), i * WAVE_MS));
    }, { passive: true });

    // La taille du nom suit la largeur de l'écran : on relève à nouveau.
    new ResizeObserver(freezeWidths).observe(word.parentElement ?? word);
    document.fonts?.ready.then(freezeWidths).catch(() => undefined);
}
