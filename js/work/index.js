// @ts-check
/**
 * WAB. — Fiche projet
 * Un clic sur une tuile de Work ouvre la fiche du projet par-dessus
 * la page, au lieu d'envoyer directement sur le site du client. Dans
 * la fiche, la photo (avec son bouton « Voir le site ») et la capture
 * y mènent. Sans JavaScript, la tuile reste un simple lien vers le site.
 *
 * L'adresse suit la fiche (#zinema…) : on peut partager un projet,
 * et le bouton Retour du téléphone ferme la fiche au lieu de quitter
 * la page.
 */

import { requireElement } from '../contact/dom.js?v=8';
import { createCaseDialog } from './markup.js?v=3';
import { fillCase } from './fill.js?v=2';

const LOCK_CLASS = 'has-modal';
// Un peu plus que l'animation de sortie : filet de sécurité si
// l'événement de fin d'animation ne vient jamais.
const CLOSE_FALLBACK_MS = 360;

/** @type {HTMLElement[]} */
const pieces = Array.from(document.querySelectorAll('.piece[id]'))
    .filter((el) => el instanceof HTMLElement && el.querySelector('.piece__case'));

/** @type {HTMLDialogElement | null} */
let dialog = null;
/** Le projet affiché, et s'il a ajouté sa propre entrée à l'historique. */
let current = { id: '', pushed: false };
/** @type {(() => void) | null} */
let cancelPendingClose = null;

/** @param {string} id */
function findPiece(id) {
    return pieces.find((piece) => piece.id === id) ?? null;
}

/** @param {HTMLDialogElement} element */
function requestClose(element) {
    if (cancelPendingClose || !element.open) return;
    const layout = requireElement(element, '.case__layout', HTMLElement);

    element.classList.add('is-closing');
    const listeners = new AbortController();
    const finish = () => {
        cancelPendingClose?.();
        if (element.open) element.close();
    };
    const fallback = window.setTimeout(finish, CLOSE_FALLBACK_MS);

    cancelPendingClose = () => {
        listeners.abort();
        window.clearTimeout(fallback);
        cancelPendingClose = null;
    };
    layout.addEventListener('animationend', (event) => {
        if (event.target === layout) finish();
    }, { signal: listeners.signal });
}

/**
 * La fiche fermée, l'adresse perd son #projet. Si c'est la fiche qui
 * l'avait ajouté, on revient en arrière ; sinon (lien partagé), on
 * l'efface simplement.
 */
function clearHash() {
    if (window.location.hash !== `#${current.id}`) return;
    if (current.pushed) {
        history.back();
        return;
    }
    history.replaceState(history.state, '', window.location.pathname + window.location.search);
}

/** @param {HTMLDialogElement} element */
function wireClosing(element) {
    element.querySelectorAll('[data-case-close]').forEach((button) => {
        button.addEventListener('click', () => requestClose(element));
    });

    // Un clic hors des cartes (sur le voile) ferme la fiche.
    element.addEventListener('click', (event) => {
        if (event.target === element) requestClose(element);
    });

    element.addEventListener('cancel', (event) => {
        event.preventDefault();
        requestClose(element);
    });

    // Point de passage unique de toute fermeture, animée ou non.
    element.addEventListener('close', () => {
        cancelPendingClose?.();
        element.classList.remove('is-closing');
        document.documentElement.classList.remove(LOCK_CLASS);
        clearHash();
        current = { id: '', pushed: false };
    });
}

/** @returns {HTMLDialogElement} */
function getDialog() {
    if (dialog) return dialog;
    dialog = createCaseDialog();
    wireClosing(dialog);
    return dialog;
}

/**
 * Chaque ouverture repart du haut de la fiche.
 * @param {HTMLDialogElement} element
 */
function scrollToTop(element) {
    element.querySelectorAll('.case__layout, .case__panel').forEach((box) => {
        box.scrollTop = 0;
    });
}

/**
 * @param {HTMLElement} piece
 * @param {boolean} pushHistory
 */
function openCase(piece, pushHistory) {
    const element = getDialog();
    if (element.open) return;

    fillCase(element, piece, pieces.indexOf(piece) + 1);
    if (pushHistory) history.pushState({ case: piece.id }, '', `#${piece.id}`);
    current = { id: piece.id, pushed: pushHistory };

    document.documentElement.classList.add(LOCK_CLASS);
    element.showModal();
    scrollToTop(element);
    requireElement(element, '#caseTitle', HTMLElement).focus({ preventScroll: true });
}

/** @param {MouseEvent} event */
function onPieceClick(event) {
    // Cmd/Ctrl-clic, clic du milieu : le visiteur veut le site
    // lui-même, dans un nouvel onglet. On le laisse faire.
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target instanceof Element ? event.target.closest('a[data-case-open]') : null;
    const piece = link?.closest('.piece');
    if (!(piece instanceof HTMLElement) || !pieces.includes(piece)) return;

    event.preventDefault();
    openCase(piece, true);
}

/** Arrivée par un lien partagé, ou navigation Retour / Suivant. */
function syncWithHash() {
    const piece = findPiece(decodeURIComponent(window.location.hash.slice(1)));
    if (dialog?.open && piece?.id !== current.id) {
        current.pushed = false;
        requestClose(dialog);
        return;
    }
    if (piece && !dialog?.open) openCase(piece, false);
}

if (typeof HTMLDialogElement === 'function' && pieces.length) {
    document.addEventListener('click', onPieceClick);
    window.addEventListener('popstate', syncWithHash);
    syncWithHash();
}
