// @ts-check
/**
 * WAB. — Fenêtre de contact : le gabarit
 * Un seul exemplaire pour tout le site, ajouté à la page au premier
 * clic sur « Contact ». Les noms de champs (Nom, Email, Entreprise,
 * Projet[], Budget, Delai, Message, _honey) sont lus tels quels par
 * send-message.php, qui n'accepte que les choix listés ici : toute
 * modification d'une liste se reporte dans le fichier PHP.
 *
 * Aucune mention en petit texte : les champs obligatoires portent un
 * astérisque, tout le reste est facultatif.
 *
 * Le contenu est entièrement écrit ici, aucune donnée du visiteur
 * n'y entre : l'injection du gabarit en une fois est sans risque.
 */

export const CONTACT_EMAIL = 'contact@wearebrothers.ch';

const PROJECT_TYPES = ['Site internet', 'Refonte', 'Branding', 'E-commerce', 'Application métier'];
const BUDGETS = ['Moins de 2k', '2k à 4k', '4k à 6k', '6k à 8k', '8k à 10k', 'À définir'];
const TIMINGS = ['Maintenant', "D'ici 3 mois", 'Plus tard'];

const ARROW = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>';

// Signe visuel seulement : l'attribut required du champ dit déjà
// « obligatoire » aux lecteurs d'écran.
const REQUIRED = '<span class="contact-field__req" aria-hidden="true">*</span>';

/**
 * Un groupe de choix en un clic : de vraies cases (ou boutons radio)
 * pour le clavier et les lecteurs d'écran, dessinées en pastilles.
 * @param {{ legend: string, name: string, type: 'checkbox' | 'radio', options: string[] }} group
 * @returns {string}
 */
function choiceGroup({ legend, name, type, options }) {
    const idBase = `contact${name.replace(/\W/g, '')}`;
    const choices = options.map((option, index) => `
            <input class="contact-choice__input" type="${type}" id="${idBase}${index}" name="${name}" value="${option}">
            <label class="contact-choice" for="${idBase}${index}">${option}</label>`).join('');

    return `
        <fieldset class="contact-field contact-choices">
            <legend class="contact-field__label">${legend}</legend>
            <div class="contact-choices__list">${choices}
            </div>
        </fieldset>`;
}

const TEMPLATE = `
<div class="contact-modal__card" tabindex="-1">
    <div class="contact-modal__bar">
        <button type="button" class="contact-modal__close" data-contact-close>Fermer</button>
    </div>

    <div data-view="form">
        <h2 class="contact-modal__title" id="contactModalTitle">Travaillons ensemble&nbsp;?</h2>
        <p class="contact-modal__lede">Nous vous répondons sous 24&nbsp;h ouvrées, sans engagement.</p>

        <form class="contact-form" action="/send-message.php" method="POST" novalidate>
            <!-- Piège anti-spam : hors du champ visuel, jamais atteint au clavier -->
            <div class="hp-field" aria-hidden="true">
                <label for="contactHoney">Ne pas remplir</label>
                <input type="text" name="_honey" id="contactHoney" tabindex="-1" autocomplete="off">
            </div>

            <div class="contact-form__row">
                <div class="contact-field">
                    <label class="contact-field__label" for="contactName">Nom${REQUIRED}</label>
                    <input class="contact-field__input" type="text" id="contactName" name="Nom" maxlength="120" autocomplete="name" autocapitalize="words" enterkeyhint="next" placeholder="Votre nom" required aria-describedby="contactNameError">
                    <p class="contact-field__error" id="contactNameError">Dites-nous au moins comment vous appeler.</p>
                </div>

                <div class="contact-field">
                    <label class="contact-field__label" for="contactEmail">Email${REQUIRED}</label>
                    <input class="contact-field__input" type="email" id="contactEmail" name="Email" maxlength="200" autocomplete="email" inputmode="email" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="next" placeholder="Votre email" required aria-describedby="contactEmailError">
                    <p class="contact-field__error" id="contactEmailError">Il nous faut un email valide pour vous répondre.</p>
                </div>
            </div>

            <div class="contact-field">
                <label class="contact-field__label" for="contactCompany">Entreprise</label>
                <input class="contact-field__input" type="text" id="contactCompany" name="Entreprise" maxlength="160" autocomplete="organization" enterkeyhint="next" placeholder="Votre entreprise">
            </div>
            ${choiceGroup({ legend: 'Votre projet', name: 'Projet[]', type: 'checkbox', options: PROJECT_TYPES })}
            ${choiceGroup({ legend: 'Budget en CHF', name: 'Budget', type: 'radio', options: BUDGETS })}
            ${choiceGroup({ legend: 'Pour quand', name: 'Delai', type: 'radio', options: TIMINGS })}

            <div class="contact-field">
                <label class="contact-field__label" for="contactMessage">Message${REQUIRED}</label>
                <textarea class="contact-field__input contact-field__input--area" id="contactMessage" name="Message" rows="3" maxlength="5000" placeholder="Vos objectifs, votre site actuel, vos contraintes…" required aria-describedby="contactMessageError"></textarea>
                <p class="contact-field__error" id="contactMessageError">Quelques mots sur votre projet nous aideront à bien vous répondre.</p>
            </div>

            <button type="submit" class="btn btn--solid btn--lg contact-form__submit">
                <span data-label>Envoyer le message</span>
                ${ARROW}
            </button>
            <p class="contact-form__status" role="status" aria-live="polite"></p>
        </form>
    </div>

    <div data-view="sent" hidden>
        <h2 class="contact-modal__title" tabindex="-1">Message envoyé.</h2>
        <p class="contact-modal__lede">
            Merci&nbsp;! Nous vous répondons sous 24&nbsp;h ouvrées, idéalement pour convenir
            d'un café ou d'un appel.
        </p>
        <button type="button" class="btn btn--ghost btn--lg contact-modal__done" data-contact-close>Fermer</button>
    </div>
</div>`;

/** @returns {HTMLDialogElement} */
export function createContactDialog() {
    const dialog = document.createElement('dialog');
    dialog.className = 'contact-modal';
    dialog.setAttribute('aria-labelledby', 'contactModalTitle');
    dialog.innerHTML = TEMPLATE;
    document.body.append(dialog);
    return dialog;
}
