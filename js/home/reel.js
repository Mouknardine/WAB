// @ts-check
/**
 * WAB. — La fenêtre de l'accueil
 * Fait passer de vrais sites du studio dans le cadre de navigateur
 * de l'ouverture, en fondu enchaîné. La barre d'adresse et le lien
 * suivent le site affiché.
 *
 * Le défilement s'arrête de lui-même quand la fenêtre sort de
 * l'écran, quand l'onglet est caché, au survol et au clavier ; il ne
 * démarre pas si le visiteur a demandé moins d'animations. Le bouton
 * de la barre le met en pause pour de bon (WCAG 2.2.2).
 *
 * Balisage attendu (index.html) :
 *   [data-reel]
 *     [data-reel-address]  [data-reel-pause]
 *     img[data-reel-slide][data-domain][data-href][data-name] × n
 *     a[data-reel-link] > [data-reel-label]
 */

const INTERVAL_MS = 4200;

/**
 * @typedef {Object} ReelParts
 * @property {HTMLElement} root
 * @property {HTMLImageElement[]} slides
 * @property {HTMLElement} address
 * @property {HTMLAnchorElement} link
 * @property {HTMLElement} label
 * @property {HTMLButtonElement} pause
 */

/**
 * Rassemble les pièces de la fenêtre ; null si l'une manque, pour ne
 * jamais animer un balisage incomplet.
 * @param {HTMLElement} root
 * @returns {ReelParts | null}
 */
function readParts(root) {
    const slides = Array.from(root.querySelectorAll('img[data-reel-slide]'))
        .filter((el) => el instanceof HTMLImageElement);
    const address = root.querySelector('[data-reel-address]');
    const link = root.querySelector('a[data-reel-link]');
    const label = root.querySelector('[data-reel-label]');
    const pause = root.querySelector('button[data-reel-pause]');

    if (slides.length < 2 || !(address instanceof HTMLElement) || !(link instanceof HTMLAnchorElement)
        || !(label instanceof HTMLElement) || !(pause instanceof HTMLButtonElement)) {
        return null;
    }
    return { root, slides, address, link, label, pause };
}

/**
 * Affiche le site d'indice donné : capture, adresse, lien.
 * @param {ReelParts} parts
 * @param {number} index
 */
function show(parts, index) {
    const slide = parts.slides[index];
    parts.slides.forEach((el) => el.classList.toggle('is-current', el === slide));
    parts.address.textContent = slide.dataset.domain || '';
    parts.link.href = slide.dataset.href || '/realisations';
    parts.label.textContent = `Voir le projet ${slide.dataset.name || ''}`.trim();
}

/** @param {ReelParts} parts */
function startReel(parts) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let timer = 0;
    let onScreen = true;
    let held = false;
    let pausedByUser = false;

    const canRun = () => onScreen && !held && !pausedByUser && !document.hidden && !reduceMotion.matches;

    function schedule() {
        window.clearTimeout(timer);
        if (!canRun()) return;
        timer = window.setTimeout(() => {
            index = (index + 1) % parts.slides.length;
            show(parts, index);
            schedule();
        }, INTERVAL_MS);
    }

    /** @param {boolean} next */
    const hold = (next) => {
        held = next;
        schedule();
    };

    // Au doigt, « pointerleave » ne vient pas toujours après un toucher :
    // seul le survol à la souris retient la fenêtre.
    parts.root.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'mouse') hold(true);
    });
    parts.root.addEventListener('pointerleave', (event) => {
        if (event.pointerType === 'mouse') hold(false);
    });
    parts.root.addEventListener('focusin', () => hold(true));
    parts.root.addEventListener('focusout', () => hold(false));
    document.addEventListener('visibilitychange', schedule);

    // Sans défilement possible, le bouton ne contrôle rien : il s'efface.
    const syncMotion = () => {
        parts.pause.hidden = reduceMotion.matches;
        schedule();
    };
    reduceMotion.addEventListener('change', syncMotion);

    parts.pause.addEventListener('click', () => {
        pausedByUser = !pausedByUser;
        parts.pause.setAttribute('aria-pressed', String(pausedByUser));
        parts.pause.setAttribute('aria-label', pausedByUser ? 'Reprendre le défilement' : 'Mettre le défilement en pause');
        schedule();
    });

    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            onScreen = entries.some((entry) => entry.isIntersecting);
            schedule();
        }).observe(parts.root);
    }

    show(parts, index);
    syncMotion();
}

function initReel() {
    const root = document.querySelector('[data-reel]');
    if (!(root instanceof HTMLElement)) return;

    const parts = readParts(root);
    if (!parts) return;
    startReel(parts);
}

initReel();
