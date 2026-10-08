// @ts-check
/**
 * WAB OS — les commandes du terminal
 * Des réponses vraies, tirées du site (Services, About, Work, l'heure
 * de nav-clock.js), sur un ton sobre. Aucune réponse
 * n'invente un chiffre, un client ou une promesse.
 */

import { loadProjects } from './projects.js?v=1';
import { getClock } from './clock.js?v=2';

/**
 * @typedef {object} TermIO
 * @property {(lines: string | string[], tone?: 'muted' | 'accent' | 'error') => void} print
 * @property {() => void} clear
 * @property {() => void} contact
 * @property {(id: string, title: string) => void} openCase
 */

const HELP = [
    'Commandes disponibles\u00a0:',
    '  projets    les projets du studio',
    '  ouvrir N   la fiche du projet numéro N',
    '  services   ce que fait le studio',
    '  equipe     l’équipe du studio',
    '  contact    écrire au studio',
    '  heure      l’heure à Lausanne',
    '  effacer    vider l’écran',
];

const SERVICES = [
    'Technologie',
    '  Sites internet            conçus et développés sur mesure, optimisés pour le référencement',
    '  Applications métier       conçues autour de vos processus, déployées par étapes',
    '  Automatisation et IA      tâches récurrentes automatisées, IA là où elle crée de la valeur',
    '  Intégrations, newsletters, intelligence artificielle',
    'Image de marque',
    '  Branding, print, vêtements',
    'Le détail\u00a0: /services',
];

const TEAM = [
    'Eliott Pina   Lead designer',
    'Matt Pina     Lead développeur',
    'Studio indépendant de design et de développement, fondé à Lausanne.',
    'Nous accompagnons marques, institutions et entreprises, de la stratégie à la mise en ligne.',
];

/** Quelques réponses cachées, hors de « aide ». */
/** @type {Record<string, string>} */
const EASTER = {
    sudo: 'Aucun accès administrateur requis. Tapez aide pour la liste des commandes.',
    wordpress: 'Introuvable. Chaque site est développé sur mesure, sans WordPress ni Wix.',
    cafe: 'Pour démarrer un projet, tapez contact.',
    bonjour: 'Bonjour. Tapez aide pour afficher les commandes disponibles.',
};

/** @param {TermIO} io */
async function listProjects(io) {
    io.print('Lecture de la page Work…', 'muted');
    try {
        const projects = await loadProjects();
        io.print(projects.map((p, i) => `  ${String(i + 1).padStart(2, ' ')}  ${p.name.padEnd(22, ' ')} ${p.context}`));
        io.print('Tapez ouvrir 1 pour lire la première fiche.', 'muted');
    } catch {
        io.print('La page Work ne répond pas. Elle reste lisible sur /realisations.', 'error');
    }
}

/** @param {TermIO} io @param {string} arg */
async function openProject(io, arg) {
    const index = Number.parseInt(arg, 10);
    try {
        const projects = await loadProjects();
        const project = Number.isInteger(index) ? projects[index - 1] : undefined;
        if (!project) {
            io.print(`Il faut un numéro entre 1 et ${projects.length}. Tapez projets pour la liste.`, 'error');
            return;
        }
        io.print(`Ouverture de ${project.name}.`, 'accent');
        io.openCase(project.id, project.domain || project.name);
    } catch {
        io.print('La page Work ne répond pas. Elle reste lisible sur /realisations.', 'error');
    }
}

/** @param {TermIO} io */
function printTime(io) {
    const clock = getClock();
    if (!clock) {
        io.print('L’horloge de Lausanne est indisponible.', 'error');
        return;
    }
    const now = new Date();
    const time = new Intl.DateTimeFormat('fr-CH', { hour: '2-digit', minute: '2-digit', timeZone: clock.ZONE }).format(now);
    io.print(`Lausanne, ${time}. ${clock.statusFor(clock.readLausanne(now)).text}.`);
}

/**
 * @param {string} name  la commande, déjà nettoyée
 * @param {string} arg
 * @param {TermIO} io
 * @returns {Promise<void>}
 */
export async function run(name, arg, io) {
    switch (name) {
        case 'aide': case 'help': io.print(HELP); return;
        case 'projets': await listProjects(io); return;
        case 'ouvrir': await openProject(io, arg); return;
        case 'services': io.print(SERVICES); return;
        case 'equipe': io.print(TEAM); return;
        case 'heure': printTime(io); return;
        case 'effacer': case 'clear': io.clear(); return;
        case 'contact':
            io.print('Ouverture de la fenêtre de contact. Réponse sous 24\u00a0h ouvrées.', 'accent');
            io.contact();
            return;
        default:
            if (Object.hasOwn(EASTER, name)) io.print(EASTER[name]);
            else io.print(`«\u00a0${name}\u00a0»\u00a0: commande inconnue. Tapez aide.`, 'error');
    }
}
