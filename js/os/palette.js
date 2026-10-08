// @ts-check
/**
 * WAB OS — la palette de commandes (⌘K, Ctrl+K)
 * Un champ, des résultats groupés (Actions, Pages, Projets) filtrés à
 * chaque frappe. Flèches pour choisir, Entrée pour lancer, Échap pour
 * fermer. Modèle combobox + listbox : le focus reste dans le champ,
 * l'option active est annoncée (aria-activedescendant).
 * <dialog> modal : le navigateur garde le focus dedans et le rend à
 * ce qui l'avait avant.
 */

import { el, symIcon } from './dom.js?v=3';
import { baseItems, projectItems, filterItems } from './palette-items.js?v=4';
import { report } from './lazy.js?v=1';

/** @typedef {import('./palette-items.js').PaletteItem} PaletteItem */

/**
 * @typedef {object} Palette
 * @property {HTMLDialogElement} dialog
 * @property {HTMLInputElement} input
 * @property {HTMLElement} list
 * @property {HTMLElement} empty
 * @property {HTMLElement} status
 */

/** @type {Palette | null} */
let palette = null;
/** @type {PaletteItem[]} */
let items = baseItems();
/** @type {PaletteItem[]} */
let shown = [];
let active = 0;
/** @type {HTMLElement | null} */
let opener = null;

/** @returns {Palette} */
function build() {
    const dialog = el('dialog', 'palette');
    dialog.setAttribute('aria-label', 'Palette de commandes');
    const box = el('div', 'palette__box');
    const field = el('div', 'palette__field');
    const input = el('input', 'palette__input');
    Object.assign(input, { type: 'text', placeholder: 'Aller à une page, ouvrir un projet, copier l’email…', autocomplete: 'off', spellcheck: false, maxLength: 60 });
    input.name = 'recherche';
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-controls', 'palette-list');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-label', 'Rechercher une commande');
    field.append(symIcon('search'), input, el('kbd', 'palette__esc', 'Échap'));

    const list = el('div', 'palette__list');
    list.id = 'palette-list';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', 'Résultats');
    const empty = el('p', 'palette__empty');
    empty.hidden = true;
    const status = el('p', 'sr-only');
    status.setAttribute('role', 'status');
    const foot = el('p', 'palette__foot', '↑ ↓ choisir · Entrée lancer · Échap fermer');
    foot.setAttribute('aria-hidden', 'true');
    box.append(field, list, empty, foot, status);
    dialog.append(box);
    document.body.append(dialog);

    input.addEventListener('input', render);
    input.addEventListener('keydown', onKey);
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });
    return { dialog, input, list, empty, status };
}

/** @param {number} index */
function setActive(index) {
    if (!palette || !shown.length) return;
    active = (index + shown.length) % shown.length;
    palette.list.querySelectorAll('[role="option"]').forEach((option, i) => {
        option.setAttribute('aria-selected', String(i === active));
        if (i === active) {
            palette?.input.setAttribute('aria-activedescendant', option.id);
            option.scrollIntoView({ block: 'nearest' });
        }
    });
}

/** @param {PaletteItem} item @param {number} index */
function option(item, index) {
    const row = el('div', 'palette__option');
    row.id = `palette-opt-${index}`;
    row.setAttribute('role', 'option');
    row.append(symIcon(item.icon), el('span', 'palette__label', item.label), el('span', 'palette__hint', item.hint));
    row.addEventListener('pointermove', () => { if (active !== index) setActive(index); });
    row.addEventListener('click', () => launch(item));
    return row;
}

function render() {
    if (!palette) return;
    const query = palette.input.value;
    const found = filterItems(items, query);
    const groups = [...new Set(found.map((item) => item.group))];
    // L'ordre affiché suit les groupes : les flèches suivent cet ordre.
    shown = groups.flatMap((name) => found.filter((item) => item.group === name));
    let index = 0;
    palette.list.replaceChildren(...groups.map((name, g) => {
        const group = el('div', 'palette__group');
        group.setAttribute('role', 'group');
        const title = el('p', 'palette__group-title', name);
        title.id = `palette-group-${g}`;
        group.setAttribute('aria-labelledby', title.id);
        group.append(title);
        shown.filter((item) => item.group === name).forEach((item) => {
            group.append(option(item, index));
            index += 1;
        });
        return group;
    }));
    palette.empty.hidden = shown.length > 0;
    palette.empty.textContent = shown.length ? '' : `Aucun résultat pour «\u00a0${query.trim()}\u00a0».`;
    palette.status.textContent = `${shown.length} résultat${shown.length > 1 ? 's' : ''}`;
    if (!shown.length) palette.input.removeAttribute('aria-activedescendant');
    setActive(0);
}

/** @param {PaletteItem} item */
function launch(item) {
    palette?.dialog.close();
    try {
        item.run(opener);
    } catch (error) {
        report('palette-run', error);
    }
}

/** @param {KeyboardEvent} event */
function onKey(event) {
    const moves = { ArrowDown: 1, ArrowUp: -1 };
    if (event.key in moves) {
        event.preventDefault();
        setActive(active + moves[/** @type {'ArrowDown' | 'ArrowUp'} */ (event.key)]);
    } else if (event.key === 'Home' && event.ctrlKey) {
        setActive(0);
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (shown[active]) launch(shown[active]);
    }
}

/** Les projets arrivent après l'ouverture : on les ajoute en place. */
function loadProjectsOnce() {
    if (items.some((item) => item.group === 'Projets')) return;
    projectItems().then((projects) => {
        items = [...baseItems(), ...projects];
        if (palette?.dialog.open) render();
    }).catch((error) => report('palette-projects', error));
}

/** @param {HTMLElement | null} from */
export function togglePalette(from) {
    palette ??= build();
    if (palette.dialog.open) {
        palette.dialog.close();
        return;
    }
    opener = from;
    palette.input.value = '';
    render();
    palette.dialog.showModal();
    palette.input.focus();
    loadProjectsOnce();
}
