// @ts-check
/**
 * WAB. — Onglets des métiers
 * Le motif des onglets ARIA : un seul panneau visible, les flèches
 * gauche et droite (et Début / Fin) passent d'un onglet à l'autre,
 * seul l'onglet actif est dans l'ordre de tabulation.
 *
 * Sans script, rien n'est masqué : les trois panneaux se lisent à la
 * suite. Le script ne masque que lorsqu'il a pu tout relier.
 *
 * Balisage attendu (index.html) :
 *   [data-tabs] > [role=tablist] > button[role=tab][aria-controls] × n
 *   [data-tabs] > [role=tabpanel][id] × n
 */

/**
 * @param {HTMLElement} root
 */
function setupTabs(root) {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'))
        .filter((el) => el instanceof HTMLButtonElement);
    /** @type {HTMLElement[]} */
    const panels = [];
    for (const tab of tabs) {
        const panel = document.getElementById(tab.getAttribute('aria-controls') || '');
        if (!(panel instanceof HTMLElement)) return;
        panels.push(panel);
    }
    if (tabs.length < 2) return;

    /** @param {number} index @param {boolean} focus */
    const select = (index, focus) => {
        tabs.forEach((tab, i) => {
            const active = i === index;
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
            panels[i].hidden = !active;
        });
        if (focus) tabs[index].focus();
    };

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => select(i, false));
        tab.addEventListener('keydown', (event) => {
            const last = tabs.length - 1;
            const moves = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last };
            const next = moves[/** @type {keyof typeof moves} */ (event.key)];
            if (next === undefined) return;
            event.preventDefault();
            select(next, true);
        });
    });

    select(0, false);
    root.classList.add('is-ready');
}

export function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach((root) => {
        if (root instanceof HTMLElement) setupTabs(root);
    });
}
