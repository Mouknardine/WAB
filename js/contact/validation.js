// @ts-check
/**
 * WAB. — Fenêtre de contact : la vérification des champs
 * Les trois champs obligatoires (nom, email, message) et la façon
 * de signaler celui qui ne va pas.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @typedef {HTMLInputElement | HTMLTextAreaElement} TextField
 * @typedef {{ field: TextField, isValid: (value: string) => boolean }} Rule
 */

/**
 * @param {HTMLFormElement} form
 * @param {string} name
 * @returns {TextField}
 */
export function fieldNamed(form, name) {
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) return field;
    throw new Error(`Fenêtre de contact : champ « ${name} » introuvable.`);
}

/**
 * @param {HTMLFormElement} form
 * @returns {Rule[]}
 */
export function rulesFor(form) {
    /** @param {string} value */
    const filled = (value) => value.length > 0;

    return [
        { field: fieldNamed(form, 'Nom'), isValid: filled },
        { field: fieldNamed(form, 'Email'), isValid: (value) => EMAIL_PATTERN.test(value) },
        { field: fieldNamed(form, 'Message'), isValid: filled },
    ];
}

/**
 * Le champ fautif est signalé par un trait ET par un message : la
 * couleur seule ne dit rien à qui ne la distingue pas.
 * @param {TextField} field
 * @param {boolean} invalid
 */
function markField(field, invalid) {
    field.closest('.contact-field')?.classList.toggle('has-error', invalid);
    field.setAttribute('aria-invalid', String(invalid));
}

/**
 * Signale chaque champ fautif et place le curseur sur le premier.
 * @param {Rule[]} rules
 * @returns {boolean}
 */
export function validate(rules) {
    const invalid = rules.filter(({ field, isValid }) => {
        const ok = isValid(field.value.trim());
        markField(field, !ok);
        return !ok;
    });
    invalid[0]?.field.focus();
    return invalid.length === 0;
}
