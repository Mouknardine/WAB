/**
 * WAB. — Page CONTACT : logique du formulaire
 * Validation côté client, envoi vers notre propre serveur
 * (send-message.php sur l'hébergement Infomaniak) avec repli
 * sur l'email direct en cas d'échec, bouton « Copier » de
 * l'adresse. Sans JavaScript, le formulaire s'envoie quand
 * même via l'attribut action classique.
 */

document.addEventListener('DOMContentLoaded', () => {

    const CONTACT_EMAIL = 'contact@wearebrothers.ch';
    const ENDPOINT      = 'send-message.php';

    /* ── Bouton « Copier » l'adresse email ── */
    (function initCopyEmail() {
        const btn = document.getElementById('copyEmailBtn');
        if (!btn) return;

        const email = btn.dataset.email || CONTACT_EMAIL;
        let resetTimer = null;

        btn.addEventListener('click', async () => {
            let copied = false;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(email);
                    copied = true;
                } catch (e) { /* refus navigateur : repli ci-dessous */ }
            }

            if (!copied) {
                // Repli pour anciens navigateurs / contextes non sécurisés
                const tmp = document.createElement('textarea');
                tmp.value = email;
                tmp.setAttribute('readonly', '');
                tmp.style.position = 'absolute';
                tmp.style.left = '-9999px';
                document.body.appendChild(tmp);
                tmp.select();
                try {
                    copied = document.execCommand('copy');
                } catch (e) { copied = false; }
                document.body.removeChild(tmp);
            }

            btn.textContent = copied ? 'Copié !' : 'Impossible';
            btn.classList.toggle('copied', copied);
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                btn.textContent = 'Copier';
                btn.classList.remove('copied');
            }, 2000);
        });
    })();

    /* ── Formulaire ── */
    (function initForm() {
        const form      = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const label     = document.getElementById('submitLabel');
        const status    = document.getElementById('formStatus');
        const success   = document.getElementById('formSuccess');
        if (!form || !submitBtn || !label || !status || !success) return;

        // Retour d'un envoi sans JavaScript : le serveur redirige
        // vers contact.html?sent=1 → on affiche la confirmation.
        if (new URLSearchParams(window.location.search).get('sent') === '1') {
            form.classList.add('is-sent');
            success.hidden = false;
            history.replaceState(null, '', window.location.pathname);
        }

        const fields = {
            name:    { input: document.getElementById('fieldName'),    error: document.getElementById('errorName') },
            email:   { input: document.getElementById('fieldEmail'),   error: document.getElementById('errorEmail') },
            message: { input: document.getElementById('fieldMessage'), error: document.getElementById('errorMessage') },
        };

        const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let sending = false;

        function setError(field, hasError) {
            const wrapper = field.input.closest('.form-field');
            if (wrapper) wrapper.classList.toggle('has-error', hasError);
            field.input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
        }

        function validate() {
            let firstInvalid = null;

            const checks = [
                { field: fields.name,    ok: fields.name.input.value.trim().length > 0 },
                { field: fields.email,   ok: EMAIL_RE.test(fields.email.input.value.trim()) },
                { field: fields.message, ok: fields.message.input.value.trim().length > 0 },
            ];

            checks.forEach(({ field, ok }) => {
                setError(field, !ok);
                if (!ok && !firstInvalid) firstInvalid = field.input;
            });

            if (firstInvalid) firstInvalid.focus();
            return !firstInvalid;
        }

        // L'erreur disparaît dès que le champ est corrigé
        Object.values(fields).forEach((field) => {
            field.input.addEventListener('input', () => setError(field, false));
        });

        function setSending(isSending) {
            sending = isSending;
            submitBtn.disabled = isSending;
            label.textContent = isSending ? 'Envoi en cours…' : 'Envoyer le message';
        }

        function buildMailtoFallback() {
            const name    = fields.name.input.value.trim();
            const message = fields.message.input.value.trim();
            const mailSubject = encodeURIComponent('Projet — ' + name);
            const mailBody    = encodeURIComponent(message + '\n\n— ' + name);
            return 'mailto:' + CONTACT_EMAIL + '?subject=' + mailSubject + '&body=' + mailBody;
        }

        function showSuccess() {
            form.classList.add('is-sent');
            success.hidden = false;
            status.textContent = '';
            status.classList.remove('error');
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function showError() {
            status.classList.add('error');
            status.innerHTML =
                'L’envoi n’a pas fonctionné. Écrivez-nous directement : ' +
                '<a href="' + buildMailtoFallback() + '">' + CONTACT_EMAIL + '</a>';
        }

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (sending) return;

            // Piège anti-spam : un robot a rempli le champ caché →
            // on affiche la confirmation sans rien envoyer.
            const honeypot = form.querySelector('input[name="_honey"]');
            if (honeypot && honeypot.value) {
                showSuccess();
                return;
            }

            if (!validate()) return;

            setSending(true);
            status.classList.remove('error');
            status.textContent = '';

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);

            try {
                const response = await fetch(ENDPOINT, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(form),
                    signal: controller.signal,
                });

                const data = await response.json().catch(() => null);
                const ok = response.ok && data && data.success === true;

                if (ok) {
                    showSuccess();
                } else {
                    showError();
                }
            } catch (e) {
                showError();
            } finally {
                clearTimeout(timeout);
                setSending(false);
            }
        });
    })();

});
