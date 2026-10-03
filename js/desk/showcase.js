// @ts-check
/**
 * WAB. — La vitrine des projets
 * La grande fenêtre sous le titre fait défiler les sites du studio,
 * un toutes les cinq secondes, en fondu. Le nom du projet passe dans
 * la barre de titre, son adresse sous la fenêtre.
 *
 * Un bouton met en pause (exigence WCAG 2.2.2 pour tout ce qui bouge
 * seul plus de cinq secondes). Le défilement s'arrête aussi quand la
 * fenêtre sort de l'écran ou que l'onglet passe en arrière-plan.
 * Sous « réduire les animations », la vitrine démarre en pause.
 */

const INTERVAL_MS = 5000;

const LABELS = {
    playing: { text: 'Pause', aria: 'Mettre le défilement des projets en pause' },
    paused: { text: 'Lecture', aria: 'Relancer le défilement des projets' },
};

export function initShowcase() {
    const root = document.querySelector('[data-showcase]');
    if (!(root instanceof HTMLElement)) return;

    const slides = Array.from(root.querySelectorAll('[data-slide]')).filter(
        /** @returns {el is HTMLElement} */ (el) => el instanceof HTMLElement,
    );
    const toggle = root.querySelector('[data-showcase-toggle]');
    const label = root.querySelector('[data-showcase-label]');
    const title = root.querySelector('[data-showcase-title]');
    const name = root.querySelector('[data-showcase-name]');
    if (slides.length < 2 || !(toggle instanceof HTMLButtonElement)) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let wanted = !reduced.matches; // le choix du visiteur
    let inView = true;
    let timer = 0;

    /** @param {number} next */
    const show = (next) => {
        slides[index].classList.remove('is-current');
        slides[index].setAttribute('aria-hidden', 'true');
        index = (next + slides.length) % slides.length;
        const slide = slides[index];
        slide.classList.add('is-current');
        slide.removeAttribute('aria-hidden');
        if (title) title.textContent = slide.dataset.name || '';
        if (name) name.textContent = slide.dataset.domain || '';
        preload(slides[(index + 1) % slides.length]);
    };

    const sync = () => {
        window.clearInterval(timer);
        timer = 0;
        if (wanted && inView && !document.hidden) {
            timer = window.setInterval(() => show(index + 1), INTERVAL_MS);
        }
        const state = wanted ? 'playing' : 'paused';
        toggle.dataset.state = state;
        toggle.setAttribute('aria-label', LABELS[state].aria);
        if (label) label.textContent = LABELS[state].text;
    };

    toggle.addEventListener('click', () => {
        wanted = !wanted;
        // Relancer, c'est aussi montrer tout de suite le projet suivant.
        if (wanted) show(index + 1);
        sync();
    });

    document.addEventListener('visibilitychange', sync);

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            sync();
        }, { threshold: 0.25 }).observe(root);
    }

    toggle.hidden = false;
    preload(slides[1]);
    sync();
}

/**
 * La capture suivante se charge pendant que la courante est à
 * l'écran : le fondu ne tombe jamais sur une fenêtre vide.
 * @param {HTMLElement} slide
 */
function preload(slide) {
    const img = slide.querySelector('img');
    if (img && img.loading === 'lazy') img.loading = 'eager';
}
