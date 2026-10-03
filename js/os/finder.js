// @ts-check
/**
 * WAB OS — le dossier Work
 * Une fenêtre qui liste les projets du studio, en vue icônes (la
 * capture et le nom) ou en vue liste (nom, contexte, disciplines).
 * Un clic sélectionne, un double-clic ou Entrée ouvre la fiche ; au
 * doigt, un toucher suffit. Les flèches passent d'un projet à l'autre.
 * La vue choisie est retenue d'une visite à l'autre.
 */

import { openWindow } from './wm.js?v=2';
import { loadProjects, imageFrom } from './projects.js?v=1';
import { el, showState, keyLink } from './dom.js?v=3';
import { report } from './lazy.js?v=1';
import { isOpenGesture, select } from './gesture.js?v=1';
import { launchCase } from './apps.js?v=3';

const VIEW_KEY = 'wabos-finder-view';

/** @returns {'icons' | 'list'} */
function savedView() {
    try {
        return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'icons';
    } catch {
        return 'icons';
    }
}

/** @param {'icons' | 'list'} view */
function saveView(view) {
    try {
        localStorage.setItem(VIEW_KEY, view);
    } catch {
        // Stockage refusé (navigation privée) : la vue vaut pour la visite.
    }
}

/**
 * @param {import('./projects.js').Project} project
 * @param {(project: import('./projects.js').Project, opener: HTMLElement) => void} open
 */
function item(project, open) {
    const li = el('li');
    const button = el('button', 'finder__item');
    button.type = 'button';
    const thumb = el('span', 'finder__thumb');
    thumb.append(imageFrom(project.shot, '(min-width: 760px) 240px, 45vw', 'finder__img', [1600, 1000]));
    const name = el('span', 'finder__name', project.name);
    const context = el('span', 'finder__context', project.context);
    const tags = el('span', 'finder__tags', project.tags.join(' · '));
    button.append(thumb, name, context, tags);
    button.addEventListener('click', (event) => {
        if (isOpenGesture(event)) open(project, button);
        else select(button, '.finder__item');
    });
    button.addEventListener('dblclick', () => open(project, button));
    li.append(button);
    return li;
}

/** Les flèches déplacent le focus, ligne par ligne ou case par case. */
/** @param {HTMLElement} list */
function wireArrows(list) {
    list.addEventListener('keydown', (event) => {
        const items = Array.from(list.querySelectorAll('.finder__item'));
        const index = items.indexOf(/** @type {Element} */ (document.activeElement));
        if (index === -1) return;
        const first = /** @type {HTMLElement} */ (items[0]);
        const perRow = items.filter((node) => /** @type {HTMLElement} */ (node).offsetTop === first.offsetTop).length || 1;
        const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: perRow, ArrowUp: -perRow, Home: -index, End: items.length - 1 - index };
        const step = moves[/** @type {keyof typeof moves} */ (event.key)];
        if (step === undefined) return;
        const next = items[Math.min(items.length - 1, Math.max(0, index + step))];
        event.preventDefault();
        if (next instanceof HTMLElement) {
            next.focus();
            select(next, '.finder__item');
        }
    });
}

/**
 * @param {HTMLElement} toolbar
 * @param {HTMLElement} list
 */
function viewSwitch(toolbar, list) {
    const group = el('div', 'finder__views');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Affichage');
    /** @param {'icons' | 'list'} view @param {string} label */
    const button = (view, label) => {
        const b = el('button', `finder__view finder__view--${view}`, label);
        b.type = 'button';
        b.addEventListener('click', () => apply(view));
        return b;
    };
    const icons = button('icons', 'Icônes');
    const rows = button('list', 'Liste');
    /** @param {'icons' | 'list'} view */
    const apply = (view) => {
        list.dataset.view = view;
        icons.setAttribute('aria-pressed', String(view === 'icons'));
        rows.setAttribute('aria-pressed', String(view === 'list'));
        saveView(view);
    };
    group.append(icons, rows);
    toolbar.append(group);
    apply(savedView());
}

/**
 * @param {import('./wm.js').OsWindow} win
 * @param {import('./projects.js').Project[]} projects
 */
function render(win, projects) {
    const open = (/** @type {import('./projects.js').Project} */ project, /** @type {HTMLElement} */ opener) => {
        launchCase(project.id, project.domain || project.name, opener);
    };
    const toolbar = el('div', 'finder__bar');
    const count = el('p', 'finder__count', `${projects.length} projets`);
    const list = el('ul', 'finder__items');
    list.setAttribute('aria-label', 'Projets');
    projects.forEach((project) => list.append(item(project, open)));
    toolbar.append(count);
    viewSwitch(toolbar, list);
    wireArrows(list);

    const foot = el('div', 'finder__foot');
    const hint = window.matchMedia('(pointer: fine)').matches ? 'Double-cliquez ou appuyez sur Entrée pour ouvrir.' : 'Touchez un projet pour l’ouvrir.';
    foot.append(el('p', 'finder__hint', hint), keyLink('Ouvrir la page Work', '/realisations'));
    win.body.replaceChildren(toolbar, list, foot);
}

/** @param {import('./wm.js').OsWindow} win */
async function fill(win) {
    showState(win.body, 'Lecture du dossier…');
    try {
        render(win, await loadProjects());
        if (win.el.classList.contains('is-active')) win.focusTarget()?.focus({ preventScroll: true });
    } catch (error) {
        report('finder', error);
        const retry = el('button', 'key-btn key-btn--sm', 'Réessayer');
        retry.type = 'button';
        retry.addEventListener('click', () => fill(win));
        showState(win.body, 'Le dossier n’a pas pu être lu.', [retry, keyLink('Ouvrir la page Work', '/realisations')]);
    }
}

/** @param {HTMLElement | null} opener */
export function openFinder(opener) {
    openWindow({
        id: 'finder',
        title: 'Work',
        icon: 'folder',
        app: 'work',
        size: 'md',
        opener,
        build: (win) => { fill(win); },
        focus: (win) => win.body.querySelector('.finder__item'),
    });
}
