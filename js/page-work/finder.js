// @ts-check
/**
 * WAB. — page Work : la bascule Icônes / Liste du dossier Work
 * Deux boutons à état (aria-pressed) ; la liste porte data-view, le
 * CSS fait le reste. Le choix tient le temps de la visite.
 * Sans JavaScript, la bascule n'apparaît pas : la vue icônes reste.
 */

const STORE_KEY = 'wab-work-view';
const VIEWS = ['icons', 'list'];

/** @returns {string | null} */
function readStored() {
    try {
        return sessionStorage.getItem(STORE_KEY);
    } catch {
        return null;
    }
}

/** @param {string} view */
function store(view) {
    try {
        sessionStorage.setItem(STORE_KEY, view);
    } catch {
        // Stockage refusé (navigation privée stricte) : le choix vaut
        // pour cette page seulement, rien de plus à faire.
    }
}

export function initFinderViews() {
    const finder = document.querySelector('[data-finder]');
    const list = finder?.querySelector('.pw-finder__items');
    if (!(list instanceof HTMLElement)) return;
    const buttons = Array.from(finder?.querySelectorAll('button[data-view]') ?? [])
        .filter((node) => node instanceof HTMLButtonElement);

    /** @param {string} view */
    const show = (view) => {
        if (!VIEWS.includes(view)) return;
        list.dataset.view = view;
        buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
    };

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const view = button.dataset.view ?? 'icons';
            show(view);
            store(view);
        });
    });

    show(readStored() ?? 'icons');
}
