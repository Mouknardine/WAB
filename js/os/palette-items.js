// @ts-check
/**
 * WAB OS — ce que la palette sait faire
 * Aller à une page, ouvrir un projet, démarrer un projet, copier
 * l'email, ouvrir le dossier Work ou le terminal. Les projets
 * viennent de la page Work (projects.js) ; tant qu'ils arrivent, le
 * reste est déjà utilisable.
 */

import { openContact, copyEmail, goTo } from './actions.js?v=1';
import { loadProjects } from './projects.js?v=1';
import { launchFinder, launchTerminal, launchCase } from './apps.js?v=4';

/**
 * @typedef {object} PaletteItem
 * @property {string} id
 * @property {string} group
 * @property {string} label
 * @property {string} hint
 * @property {string} icon
 * @property {string} keywords  mots de recherche supplémentaires
 * @property {(opener: HTMLElement | null) => void} run
 */

/** @param {string} value */
export function normalize(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/** @type {PaletteItem[]} */
const BASE = [
    { id: 'contact', group: 'Actions', label: 'Démarrer un projet', hint: 'Contact', icon: 'mail', keywords: 'contact ecrire email message devis', run: () => openContact() },
    { id: 'copy', group: 'Actions', label: 'Copier l’email', hint: 'contact@wearebrothers.ch', icon: 'mail', keywords: 'adresse mail copier', run: () => { copyEmail(); } },
    { id: 'finder', group: 'Actions', label: 'Ouvrir le dossier Work', hint: 'Fenêtre', icon: 'folder', keywords: 'projets realisations finder dossier', run: launchFinder },
    { id: 'terminal', group: 'Actions', label: 'Ouvrir le terminal', hint: 'Fenêtre', icon: 'terminal', keywords: 'console commande shell', run: launchTerminal },
    { id: 'p-work', group: 'Pages', label: 'Work', hint: '/realisations', icon: 'folder', keywords: 'realisations projets travail', run: () => goTo('/realisations') },
    { id: 'p-services', group: 'Pages', label: 'Services', hint: '/services', icon: 'grid', keywords: 'offre prestations', run: () => goTo('/services') },
    { id: 'p-about', group: 'Pages', label: 'About', hint: '/studio', icon: 'team', keywords: 'studio equipe freres eliott matt', run: () => goTo('/studio') },
    { id: 'p-apps', group: 'Pages', label: 'Applications sur mesure', hint: '/applications', icon: 'chart', keywords: 'logiciel gestion metier', run: () => goTo('/applications') },
    { id: 'p-site', group: 'Pages', label: 'Création de site internet à Lausanne', hint: '/creation-site-internet-lausanne', icon: 'site', keywords: 'site vitrine web', run: () => goTo('/creation-site-internet-lausanne') },
];

/** @returns {PaletteItem[]} */
export function baseItems() {
    return BASE;
}

/** @returns {Promise<PaletteItem[]>} */
export async function projectItems() {
    const projects = await loadProjects();
    return projects.map((project) => ({
        id: `case-${project.id}`,
        group: 'Projets',
        label: project.name,
        hint: project.domain,
        icon: 'file',
        keywords: `${project.context} ${project.tags.join(' ')}`,
        run: (opener) => launchCase(project.id, project.domain || project.name, opener),
    }));
}

/**
 * Filtre par mots : chaque mot tapé doit se retrouver dans le libellé
 * ou les mots-clés, accents et majuscules ignorés.
 * @param {PaletteItem[]} items
 * @param {string} query
 * @returns {PaletteItem[]}
 */
export function filterItems(items, query) {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    if (!words.length) return items;
    return items.filter((item) => {
        const haystack = normalize(`${item.label} ${item.hint} ${item.keywords} ${item.group}`);
        return words.every((word) => haystack.includes(word));
    });
}
