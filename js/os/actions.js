// @ts-check
/**
 * WAB OS — les actions communes
 * Écrire au studio, copier l'email : partagées par la palette, le
 * menu du clic droit et le terminal.
 */

import { toast } from './toast.js?v=1';

export const CONTACT_EMAIL = 'contact@wearebrothers.ch';

/** Le raccourci de la palette, tel qu'il s'écrit sur ce clavier. */
export const SHORTCUT = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Ctrl K';

/**
 * Ouvre la fenêtre de contact en passant par un vrai lien
 * data-contact de la page : js/contact s'en charge, et sans lui le
 * lien mène à la messagerie.
 */
export function openContact() {
    const link = document.querySelector('a[data-contact]');
    if (link instanceof HTMLAnchorElement) {
        link.click();
        return;
    }
    window.location.href = `mailto:${CONTACT_EMAIL}`;
}

/** Copie l'email ; en cas de refus du navigateur, l'affiche. */
export async function copyEmail() {
    try {
        if (!navigator.clipboard) throw new Error('Presse-papiers indisponible');
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        toast(`Email copié\u00a0: ${CONTACT_EMAIL}`);
    } catch {
        toast(`Copie impossible. L\u2019adresse\u00a0: ${CONTACT_EMAIL}`);
    }
}

/** @param {string} href  adresse interne du site */
export function goTo(href) {
    window.location.assign(href);
}
