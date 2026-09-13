// @ts-check
/**
 * WAB. — Fenêtre de contact : le gabarit
 * Un seul exemplaire pour tout le site, ajouté à la page au premier
 * clic sur « Contact ». Les noms de champs (Nom, Email, Entreprise,
 * Message, _honey) sont lus tels quels par send-message.php.
 *
 * Le contenu est entièrement écrit ici, aucune donnée du visiteur
 * n'y entre : l'injection du gabarit en une fois est sans risque.
 */

export const CONTACT_EMAIL = 'contact@wearebrothers.ch';

const ARROW = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>';

const TEMPLATE = `
<div class="contact-modal__card" tabindex="-1">
    <div class="contact-modal__bar">
        <button type="button" class="contact-modal__close" data-contact-close>Fermer</button>
    </div>

    <div data-view="form">
        <h2 class="contact-modal__title" id="contactModalTitle">Travaillons ensemble&nbsp;?</h2>
        <p class="contact-modal__lede">Quelques lignes suffisent. Réponse sous 24&nbsp;h ouvrées, sans engagement.</p>

        <form class="contact-form" action="/send-message.php" method="POST" novalidate>
            <!-- Piège anti-spam : hors du champ visuel, jamais atteint au clavier -->
            <div class="hp-field" aria-hidden="true">
                <label for="contactHoney">Ne pas remplir</label>
                <input type="text" name="_honey" id="contactHoney" tabindex="-1" autocomplete="off">
            </div>

            <div class="contact-field">
                <label class="contact-field__label" for="contactName">Nom</label>
                <input class="contact-field__input" type="text" id="contactName" name="Nom" maxlength="120" autocomplete="name" autocapitalize="words" enterkeyhint="next" placeholder="Votre nom" required aria-describedby="contactNameError">
                <p class="contact-field__error" id="contactNameError">Dites-nous au moins comment vous appeler.</p>
            </div>

            <div class="contact-field">
                <label class="contact-field__label" for="contactEmail">Email</label>
                <input class="contact-field__input" type="email" id="contactEmail" name="Email" maxlength="200" autocomplete="email" inputmode="email" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="next" placeholder="Votre email" required aria-describedby="contactEmailError">
                <p class="contact-field__error" id="contactEmailError">Il nous faut un email valide pour vous répondre.</p>
            </div>

            <div class="contact-field">
                <label class="contact-field__label" for="contactCompany">
                    Entreprise <span class="contact-field__hint">facultatif</span>
                </label>
                <input class="contact-field__input" type="text" id="contactCompany" name="Entreprise" maxlength="160" autocomplete="organization" enterkeyhint="next" placeholder="Votre entreprise">
            </div>

            <div class="contact-field">
                <label class="contact-field__label" for="contactMessage">Message</label>
                <textarea class="contact-field__input contact-field__input--area" id="contactMessage" name="Message" rows="4" maxlength="5000" placeholder="Votre projet, vos envies, vos délais…" required aria-describedby="contactMessageError"></textarea>
                <p class="contact-field__error" id="contactMessageError">Quelques mots sur votre projet nous aideront à bien vous répondre.</p>
            </div>

            <button type="submit" class="btn btn--solid btn--lg contact-form__submit">
                <span data-label>Envoyer le message</span>
                ${ARROW}
            </button>
            <p class="contact-form__status" role="status" aria-live="polite"></p>
            <p class="contact-form__alt">
                Ou écrivez-nous à <a class="text-link" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
            </p>
        </form>
    </div>

    <div data-view="sent" hidden>
        <h2 class="contact-modal__title" tabindex="-1">Message envoyé.</h2>
        <p class="contact-modal__lede">
            Merci&nbsp;! Nous vous répondons sous 24&nbsp;h ouvrées — idéalement pour convenir
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
