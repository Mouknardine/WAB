// @ts-check
/**
 * WAB. — Fiche projet : le remplissage
 * Tout le contenu d'une fiche est déjà dans la page, dans la tuile
 * du projet : le nom, le contexte, les disciplines, la capture, et
 * le bloc caché .piece__case (photo, description, démarche). On le
 * recopie dans la fenêtre ; rien n'est écrit deux fois.
 */

import { requireElement } from '../contact/dom.js?v=8';

/**
 * @param {Element} root
 * @param {string} selector
 * @returns {string}
 */
function textOf(root, selector) {
    return requireElement(root, selector, HTMLElement).textContent?.trim() ?? '';
}

/**
 * Remplace le contenu d'un emplacement par des copies des enfants
 * de la source.
 * @param {Element} slot
 * @param {Element} source
 */
function copyChildren(slot, source) {
    slot.replaceChildren(...Array.from(source.children, (child) => child.cloneNode(true)));
}

/**
 * @param {Element} slot
 * @param {HTMLImageElement} source
 * @param {string} className
 * @param {string} sizes  largeur affichée dans la fenêtre, pas dans la grille
 */
function copyImage(slot, source, className, sizes) {
    const image = /** @type {HTMLImageElement} */ (source.cloneNode(true));
    image.className = className;
    image.removeAttribute('data-case-photo');
    // Dans la fenêtre, l'image est visible tout de suite : on ne la
    // fait plus attendre derrière le chargement différé.
    image.loading = 'eager';
    image.sizes = sizes;
    slot.replaceChildren(image);
}

/**
 * @param {HTMLDialogElement} dialog
 * @param {HTMLElement} piece  l'article du projet dans la grille
 * @param {number} rank  sa place dans la grille, à partir de 1
 */
export function fillCase(dialog, piece, rank) {
    const story = requireElement(piece, '.piece__case', HTMLElement);
    const link = requireElement(piece, '.piece__link', HTMLAnchorElement);
    const name = textOf(piece, '.piece__name');
    const context = textOf(piece, '.piece__context');

    requireElement(dialog, '[data-case-num]', HTMLElement).textContent = `${String(rank).padStart(2, '0')}.`;
    requireElement(dialog, '[data-case-name]', HTMLElement).textContent = name;
    requireElement(dialog, '[data-case-foot-name]', HTMLElement).textContent = name;
    requireElement(dialog, '[data-case-context]', HTMLElement).textContent = context;
    requireElement(dialog, '[data-case-foot-context]', HTMLElement).textContent = context;

    copyChildren(requireElement(dialog, '[data-case-tags]', HTMLElement), requireElement(piece, '.piece__tags', HTMLElement));
    copyChildren(requireElement(dialog, '[data-case-summary]', HTMLElement), requireElement(story, '[data-case-summary]', HTMLElement));
    copyChildren(requireElement(dialog, '[data-case-steps]', HTMLElement), requireElement(story, '[data-case-approach]', HTMLElement));

    copyImage(requireElement(dialog, '[data-case-photo]', HTMLElement), requireElement(story, 'img[data-case-photo]', HTMLImageElement), 'case__photo', '(min-width: 1000px) 40vw, 100vw');
    copyImage(requireElement(dialog, '[data-case-shot]', HTMLElement), requireElement(piece, '.window__img', HTMLImageElement), 'window__img', '(min-width: 1000px) 55vw, 100vw');

    // La photo et la capture mènent toutes deux au site.
    dialog.querySelectorAll('[data-case-visit]').forEach((visit) => {
        visit.setAttribute('href', link.href);
        visit.setAttribute('aria-label', `Voir le site ${name} (nouvel onglet)`);
    });
}
