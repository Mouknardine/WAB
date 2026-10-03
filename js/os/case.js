// @ts-check
/**
 * WAB OS — la fiche projet
 * Une grande fenêtre : la photo du projet à gauche, le texte à
 * droite (contexte, nom, disciplines, description, démarche) et le
 * bouton « Voir le site ». Contenu lu sur la page Work (projects.js).
 * En feuille au téléphone : la photo en haut, le texte dessous.
 */

import { openWindow } from './wm.js?v=1';
import { loadProjects, imageFrom } from './projects.js?v=1';
import { el, showState, keyLink } from './dom.js?v=1';
import { report } from './lazy.js?v=1';

/** @param {import('./projects.js').Project} project */
function renderText(project) {
    const text = el('div', 'case-os__text');
    const name = el('h2', 'case-os__name', project.name);
    name.tabIndex = -1;
    const tags = el('ul', 'case-os__tags');
    tags.setAttribute('aria-label', 'Disciplines');
    project.tags.forEach((tag) => tags.append(el('li', '', tag)));

    const summary = el('div', 'case-os__summary');
    project.summary.forEach((line) => summary.append(el('p', '', line)));

    const approach = el('dl', 'case-os__approach');
    project.approach.forEach(({ term, text: line }) => {
        const row = el('div');
        row.append(el('dt', '', term), el('dd', '', line));
        approach.append(row);
    });

    const actions = el('div', 'case-os__actions');
    if (project.href) {
        const visit = keyLink('Voir le site', project.href, 'glass-btn--pink');
        visit.target = '_blank';
        visit.rel = 'noopener noreferrer';
        visit.setAttribute('aria-label', `Voir le site ${project.name} (nouvel onglet)`);
        actions.append(visit);
    }
    actions.append(keyLink('Sur la page Work', `/realisations#${encodeURIComponent(project.id)}`));

    text.append(el('p', 'case-os__context', project.context), name, tags, summary, approach, actions);
    return text;
}

/**
 * @param {HTMLElement} body
 * @param {import('./projects.js').Project} project
 */
function renderCase(body, project) {
    const layout = el('article', 'case-os');
    const media = el('figure', 'case-os__media');
    media.append(imageFrom(project.photo, '(min-width: 760px) 420px, 100vw', 'case-os__photo', [1440, 1800]));
    layout.append(media, renderText(project));
    body.replaceChildren(layout);
}

/**
 * @param {import('./wm.js').OsWindow} win
 * @param {string} id
 */
async function fill(win, id) {
    showState(win.body, 'Ouverture de la fiche…');
    try {
        const project = (await loadProjects()).find((item) => item.id === id);
        if (!project) throw new Error(`Projet inconnu : ${id}`);
        renderCase(win.body, project);
        if (win.el.classList.contains('is-active')) win.focusTarget()?.focus({ preventScroll: true });
    } catch (error) {
        report('case', error);
        const retry = el('button', 'glass-btn glass-btn--sm', 'Réessayer');
        retry.type = 'button';
        retry.addEventListener('click', () => fill(win, id));
        showState(win.body, 'La fiche n’a pas pu être chargée.', [retry, keyLink('Voir sur la page Work', `/realisations#${encodeURIComponent(id)}`)]);
    }
}

/**
 * @param {string} id  l'ancre du projet sur la page Work
 * @param {string} title  le titre de la fenêtre (l'adresse du site)
 * @param {HTMLElement | null} opener
 */
export function openCase(id, title, opener) {
    openWindow({
        id: `case-${id}`,
        title,
        icon: 'file',
        app: 'work',
        size: 'lg',
        opener,
        build: (win) => { fill(win, id); },
        focus: (win) => win.body.querySelector('.case-os__name'),
    });
}
