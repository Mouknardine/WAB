// @ts-check
/**
 * WAB OS — page Applications : les onglets de l'application
 * La grande fenêtre du premier écran se parcourt comme l'app : un
 * onglet par module (Aujourd'hui, Tâches, Finances). Motif ARIA
 * « tabs » à activation automatique : flèches gauche et droite,
 * Début et Fin au clavier ; le titre et le symbole de la fenêtre
 * suivent le module ouvert.
 *
 * Sans script, la barre d'onglets n'existe pas (data-js-only) et la
 * fenêtre montre le premier module ; les autres sont plus bas.
 */

const TITLE_PREFIX = 'Agenda — ';

/**
 * @param {HTMLElement} tab
 * @returns {HTMLElement | null}
 */
function panelOf(tab) {
    const id = tab.getAttribute('aria-controls');
    const panel = id ? document.getElementById(id) : null;
    return panel instanceof HTMLElement ? panel : null;
}

/**
 * @param {HTMLElement} root  la fenêtre qui porte les onglets
 * @param {HTMLElement[]} tabs
 * @param {HTMLElement} next
 */
function select(root, tabs, next) {
    tabs.forEach((tab) => {
        const on = tab === next;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        const panel = panelOf(tab);
        if (panel) panel.hidden = !on;
    });

    const title = root.querySelector('[data-app-title]');
    if (title) title.textContent = TITLE_PREFIX + (next.textContent || '').trim();

    const icon = root.querySelector('[data-app-icon]');
    const name = next.dataset.icon;
    if (icon && name) icon.className = `sym sym--${name}`;
}

/**
 * La touche pressée désigne-t-elle un autre onglet ?
 * @param {string} key
 * @param {number} index
 * @param {number} count
 * @returns {number | null}
 */
function targetIndex(key, index, count) {
    switch (key) {
        case 'ArrowRight': return (index + 1) % count;
        case 'ArrowLeft': return (index - 1 + count) % count;
        case 'Home': return 0;
        case 'End': return count - 1;
        default: return null;
    }
}

export function initTabs() {
    const list = document.querySelector('[data-app-tabs]');
    if (!(list instanceof HTMLElement)) return;
    const root = list.closest('.app-win');
    if (!(root instanceof HTMLElement)) return;
    const tabs = Array.from(list.querySelectorAll('[role="tab"]')).filter(
        /** @returns {tab is HTMLElement} */ (tab) => tab instanceof HTMLElement,
    );
    if (!tabs.length) return;

    list.addEventListener('click', (event) => {
        const tab = event.target instanceof Element ? event.target.closest('[role="tab"]') : null;
        if (tab instanceof HTMLElement && tabs.includes(tab)) select(root, tabs, tab);
    });

    list.addEventListener('keydown', (event) => {
        const current = tabs.indexOf(/** @type {HTMLElement} */ (document.activeElement));
        if (current < 0) return;
        const next = targetIndex(event.key, current, tabs.length);
        if (next === null) return;
        event.preventDefault();
        tabs[next].focus();
        select(root, tabs, tabs[next]);
    });
}
