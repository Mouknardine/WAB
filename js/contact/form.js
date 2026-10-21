// @ts-check
/**
 * WAB. — Fenêtre de contact : le formulaire
 * Vérifie les trois champs obligatoires, envoie le message à
 * send-message.php (SMTP authentifié Infomaniak) et, si l'envoi
 * échoue, propose d'écrire directement avec le message déjà rédigé.
 * Rien n'est perdu : les champs restent remplis tant que le message
 * n'est pas parti.
 */

import { CONTACT_EMAIL } from './markup.js?v=12';
import { requireElement } from './dom.js?v=9';
import { fieldNamed, rulesFor, validate } from './validation.js?v=1';

const ENDPOINT = '/send-message.php';
const TIMEOUT_MS = 15000;
const LABEL_IDLE = 'Envoyer le message';
const LABEL_SENDING = 'Envoi en cours…';

/**
 * @param {HTMLFormElement} form
 * @returns {Promise<boolean>}
 */
async function postForm(form) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form),
            signal: controller.signal,
        });
        const data = await response.json().catch(() => null);
        return response.ok && data !== null && data.success === true;
    } catch {
        // Réseau coupé ou délai dépassé : l'échec est montré au
        // visiteur par l'appelant, avec l'email en solution de repli.
        return false;
    } finally {
        window.clearTimeout(timer);
    }
}

/**
 * Les choix cochés, une ligne par groupe : ils suivent le message
 * jusque dans l'email de secours.
 * @param {HTMLFormElement} form
 * @returns {string}
 */
function choicesSummary(form) {
    const data = new FormData(form);
    /** @type {Array<[string, string]>} */
    const groups = [['Projet', 'Projet[]'], ['Budget', 'Budget'], ['Délai', 'Delai']];
    return groups
        .map(([label, name]) => ({ label, values: data.getAll(name).map(String) }))
        .filter(({ values }) => values.length > 0)
        .map(({ label, values }) => `${label} : ${values.join(', ')}`)
        .join('\n');
}

/**
 * @param {HTMLFormElement} form
 * @returns {string}
 */
function mailtoDraft(form) {
    const name = fieldNamed(form, 'Nom').value.trim();
    const message = fieldNamed(form, 'Message').value.trim();
    const summary = choicesSummary(form);
    const subject = encodeURIComponent(`Projet — ${name}`);
    const body = encodeURIComponent(`${message}${summary ? `\n\n${summary}` : ''}\n\n— ${name}`);
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

/** @param {HTMLElement} status */
function clearStatus(status) {
    status.replaceChildren();
    status.classList.remove('is-error');
}

/**
 * @param {HTMLElement} status
 * @param {string} href
 */
function showFailure(status, href) {
    const link = document.createElement('a');
    link.className = 'text-link';
    link.href = href;
    link.textContent = CONTACT_EMAIL;
    status.replaceChildren('L’envoi n’a pas abouti. Vous pouvez nous écrire à l’adresse : ', link);
    status.classList.add('is-error');
}

/**
 * @param {HTMLFormElement} form
 * @param {() => void} onSent
 */
export function bindContactForm(form, onSent) {
    const rules = rulesFor(form);
    const honeypot = fieldNamed(form, '_honey');
    const submit = requireElement(form, 'button[type="submit"]', HTMLButtonElement);
    const label = requireElement(submit, '[data-label]', HTMLElement);
    const status = requireElement(form, '[role="status"]', HTMLElement);
    let sending = false;

    // L'erreur disparaît dès que le champ est corrigé.
    rules.forEach(({ field }) => field.addEventListener('input', () => markField(field, false)));

    /** @param {boolean} next */
    const setSending = (next) => {
        sending = next;
        submit.disabled = next;
        label.textContent = next ? LABEL_SENDING : LABEL_IDLE;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (sending) return;

        // Piège anti-spam : un robot a rempli le champ caché →
        // on confirme sans rien envoyer.
        if (honeypot.value) {
            onSent();
            return;
        }
        if (!validate(rules)) return;

        clearStatus(status);
        setSending(true);
        const sent = await postForm(form);
        setSending(false);

        if (sent) onSent();
        else showFailure(status, mailtoDraft(form));
    });
}

/** @param {HTMLFormElement} form */
export function resetContactForm(form) {
    form.reset();
    rulesFor(form).forEach(({ field }) => markField(field, false));
    clearStatus(requireElement(form, '[role="status"]', HTMLElement));
}
