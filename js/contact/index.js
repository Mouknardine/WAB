// @ts-check
/**
 * WAB. — Fenêtre de contact
 * Le site n'a pas de page Contact : tout lien marqué data-contact
 * ouvre cette fenêtre par-dessus la page en cours. Sans JavaScript,
 * ces liens restent des liens mailto et ouvrent la messagerie.
 * L'ancienne adresse /contact redirige vers l'accueil suivi de
 * #ecrire, qui ouvre la fenêtre dès l'arrivée (voir .htaccess).
 *
 * <dialog> natif : le navigateur garde le focus dans la fenêtre,
 * rend la page derrière inerte, ferme sur Échap et rend le focus au
 * lien d'origine à la fermeture.
 */

// Même numéro partout où un fichier est importé : voir js/birds/index.js.
import { CONTACT_EMAIL, createContactDialog } from './markup.js?v=5';
import { bindContactForm, resetContactForm } from './form.js?v=5';
import { requireElement } from './dom.js?v=5';

const OPEN_HASH = '#ecrire';
const LOCK_CLASS = 'has-modal';
// Un peu plus que l'animation de sortie : filet de sécurité si
// l'événement de fin d'animation ne vient jamais.
const CLOSE_FALLBACK_MS = 320;

/**
 * @typedef {object} ContactModal
 * @property {HTMLDialogElement} dialog
 * @property {HTMLElement} card
 * @property {HTMLFormElement} form
 * @property {HTMLElement} formView
 * @property {HTMLElement} sentView
 */

/** @type {ContactModal | null} */
let modal = null;
/** @type {(() => void) | null} */
let cancelPendingClose = null;

/** @returns {ContactModal} */
function buildModal() {
    const dialog = createContactDialog();
    /** @type {ContactModal} */
    const parts = {
        dialog,
        card: requireElement(dialog, '.contact-modal__card', HTMLElement),
        form: requireElement(dialog, 'form', HTMLFormElement),
        formView: requireElement(dialog, '[data-view="form"]', HTMLElement),
        sentView: requireElement(dialog, '[data-view="sent"]', HTMLElement),
    };
    bindContactForm(parts.form, () => showSent(parts));
    wireClosing(parts);
    return parts;
}

/** @param {ContactModal} parts */
function showSent(parts) {
    parts.formView.hidden = true;
    parts.sentView.hidden = false;
    requireElement(parts.sentView, '.contact-modal__title', HTMLElement).focus();
}

/**
 * Une fois le message parti, la fenêtre suivante repart d'un
 * formulaire vide. Tant qu'il ne l'est pas, on garde ce qui a été écrit.
 * @param {ContactModal} parts
 */
function restoreForm(parts) {
    if (parts.sentView.hidden) return;
    resetContactForm(parts.form);
    parts.sentView.hidden = true;
    parts.formView.hidden = false;
}

/**
 * Joue la sortie, puis ferme vraiment.
 * @param {ContactModal} parts
 */
function requestClose(parts) {
    const { dialog, card } = parts;
    if (cancelPendingClose || !dialog.open) return;

    dialog.classList.add('is-closing');
    const listeners = new AbortController();
    const finish = () => {
        cancelPendingClose?.();
        if (dialog.open) dialog.close();
    };
    const fallback = window.setTimeout(finish, CLOSE_FALLBACK_MS);

    cancelPendingClose = () => {
        listeners.abort();
        window.clearTimeout(fallback);
        cancelPendingClose = null;
    };
    card.addEventListener('animationend', (event) => {
        if (event.target === card) finish();
    }, { signal: listeners.signal });
}

/** @param {ContactModal} parts */
function wireClosing(parts) {
    const { dialog } = parts;

    dialog.querySelectorAll('[data-contact-close]').forEach((button) => {
        button.addEventListener('click', () => requestClose(parts));
    });

    // Un clic sur le voile ferme la fenêtre, à condition d'y avoir
    // commencé : une sélection de texte qui déborde du champ ne doit
    // pas faire disparaître ce qu'on était en train d'écrire.
    let pressedOnBackdrop = false;
    dialog.addEventListener('pointerdown', (event) => {
        pressedOnBackdrop = event.target === dialog;
    });
    dialog.addEventListener('click', (event) => {
        if (pressedOnBackdrop && event.target === dialog) requestClose(parts);
        pressedOnBackdrop = false;
    });

    dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        requestClose(parts);
    });

    // Point de passage unique de toute fermeture, animée ou non.
    dialog.addEventListener('close', () => {
        cancelPendingClose?.();
        dialog.classList.remove('is-closing');
        document.documentElement.classList.remove(LOCK_CLASS);
        restoreForm(parts);
    });
}

/**
 * Sur ordinateur, le curseur attend dans le premier champ. Sur écran
 * tactile, on n'ouvre pas le clavier d'office : il masquerait la
 * moitié de la fenêtre avant même qu'on l'ait lue.
 * @param {ContactModal} parts
 */
function placeFocus(parts) {
    const target = window.matchMedia('(pointer: fine)').matches
        ? requireElement(parts.form, 'input[name="Nom"]', HTMLInputElement)
        : parts.card;
    target.focus({ preventScroll: true });
}

function openContact() {
    if (typeof HTMLDialogElement !== 'function') {
        window.location.href = `mailto:${CONTACT_EMAIL}`;
        return;
    }

    modal ??= buildModal();
    if (modal.dialog.open) return;

    document.documentElement.classList.add(LOCK_CLASS);
    modal.dialog.showModal();
    placeFocus(modal);
}

/** @param {MouseEvent} event */
function onLinkClick(event) {
    // Cmd/Ctrl-clic, clic du milieu : le visiteur veut le lien
    // lui-même (ici, sa messagerie), on le laisse faire.
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target instanceof Element ? event.target.closest('a[data-contact]') : null;
    if (!link) return;

    event.preventDefault();
    openContact();
}

function openFromHash() {
    if (window.location.hash !== OPEN_HASH) return;
    history.replaceState(history.state, '', window.location.pathname + window.location.search);
    openContact();
}

document.addEventListener('click', onLinkClick);
window.addEventListener('hashchange', openFromHash);
openFromHash();
