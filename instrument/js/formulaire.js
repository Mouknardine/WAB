/**
 * Le formulaire de contact en marche : vérification des trois champs
 * obligatoires (au premier envoi, puis en direct sur les champs fautifs),
 * envoi à /send-message.php (SMTP authentifié Infomaniak), puis
 * remerciement. Si l'envoi échoue, rien n'est perdu : les champs restent
 * remplis et un lien ouvre la messagerie avec le message déjà rédigé.
 */

import { EMAIL } from './formulaire-rendu.js';

const DELAI_MAX = 15000;
const MAILTO_MAX = 1500;
const FORME_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** @typedef {HTMLInputElement | HTMLTextAreaElement} Saisie */

/** @type {Record<string, (valeur: string) => string>} règle par champ : '' si bon */
const REGLES = {
    Nom: (v) => (v ? '' : 'Indiquez votre nom.'),
    Email: (v) => {
        if (!v) return 'Indiquez votre e-mail, pour qu’on puisse vous répondre.';
        return FORME_EMAIL.test(v) ? '' : 'Cette adresse semble incomplète (exemple : nom@domaine.ch).';
    },
    Message: (v) => (v ? '' : 'Dites-nous en quelques mots ce que vous cherchez.'),
};

/** @param {Saisie} saisie @param {string} texte */
function signaler(saisie, texte) {
    const erreur = document.getElementById(`${saisie.id}-erreur`);
    if (!erreur) return;
    erreur.textContent = texte;
    erreur.hidden = !texte;
    if (texte) {
        saisie.setAttribute('aria-invalid', 'true');
        saisie.setAttribute('aria-describedby', erreur.id);
    } else {
        saisie.removeAttribute('aria-invalid');
        saisie.removeAttribute('aria-describedby');
    }
}

/** @param {Saisie} saisie @returns {boolean} vrai si le champ est bon */
function verifier(saisie) {
    const regle = REGLES[saisie.name];
    if (!regle) return true;
    const texte = regle(saisie.value.trim());
    signaler(saisie, texte);
    return !texte;
}

/** @param {HTMLFormElement} formulaire @returns {Saisie[]} */
function saisies(formulaire) {
    return [...formulaire.querySelectorAll('.champ__saisie')].filter(
        (s) => s instanceof HTMLInputElement || s instanceof HTMLTextAreaElement,
    );
}

/** @param {HTMLFormElement} formulaire @returns {Promise<boolean>} vrai si le serveur a envoyé l'e-mail */
async function poster(formulaire) {
    const arret = new AbortController();
    const minuterie = window.setTimeout(() => arret.abort(), DELAI_MAX);
    try {
        const reponse = await fetch(formulaire.action, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(formulaire),
            signal: arret.signal,
        });
        const donnees = await reponse.json().catch(() => null);
        return reponse.ok && donnees?.success === true;
    } catch {
        // Réseau coupé ou délai dépassé : l'appelant propose l'e-mail.
        return false;
    } finally {
        window.clearTimeout(minuterie);
    }
}

/** Le message déjà rédigé, prêt dans la messagerie du visiteur. @param {HTMLFormElement} formulaire @returns {string} */
function lienSecours(formulaire) {
    const d = new FormData(formulaire);
    const lignes = [
        String(d.get('Message') ?? '').trim().slice(0, MAILTO_MAX),
        '',
        `${d.get('Nom') ?? ''}${d.get('Entreprise') ? `, ${d.get('Entreprise')}` : ''}`,
        d.getAll('Projet[]').length ? `Projet : ${d.getAll('Projet[]').join(', ')}` : '',
        d.get('Budget') ? `Budget : ${d.get('Budget')} CHF` : '',
    ].filter((l, i) => i < 2 || l);
    const sujet = `Message de ${d.get('Nom') ?? ''} — wearebrothers.ch`;
    return `mailto:${EMAIL}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(lignes.join('\n'))}`;
}

/** @param {HTMLElement} alerte @param {HTMLFormElement} formulaire */
function montrerEchec(alerte, formulaire) {
    const lien = document.createElement('a');
    lien.href = lienSecours(formulaire);
    lien.textContent = 'l’envoyer depuis votre messagerie';
    alerte.replaceChildren('Le message n’est pas parti. Rien n’est perdu : réessayez, ou ', lien, '.');
    alerte.hidden = false;
}

/** @param {HTMLElement} fait @param {HTMLFormElement} formulaire @param {() => void} recommencer */
function montrerReussite(fait, formulaire, recommencer) {
    const d = new FormData(formulaire);
    const prenom = String(d.get('Nom') ?? '').trim().split(/\s+/)[0];
    const titre = document.createElement('p');
    titre.className = 'formulaire__merci';
    titre.textContent = `Merci ${prenom}, c’est envoyé.`;
    const texte = document.createElement('p');
    texte.textContent = `On vous répond sous 24 h ouvrées, à ${String(d.get('Email') ?? '').trim()}.`;
    const encore = document.createElement('button');
    encore.type = 'button';
    encore.className = 'formulaire__encore';
    encore.textContent = 'Écrire un autre message';
    encore.addEventListener('click', recommencer);
    fait.replaceChildren(titre, texte, encore);
    fait.hidden = false;
    formulaire.hidden = true;
    fait.tabIndex = -1;
    fait.focus({ preventScroll: true });
}

/**
 * @param {HTMLFormElement} formulaire
 * @param {HTMLElement} bloc  le formulaire, ses messages et le contact direct
 */
export function relierFormulaire(formulaire, bloc) {
    const alerte = formulaire.querySelector('.formulaire__alerte');
    const envoyer = formulaire.querySelector('.formulaire__envoyer');
    const fait = bloc.querySelector('.formulaire__fait');
    if (!(alerte instanceof HTMLElement) || !(envoyer instanceof HTMLButtonElement) || !(fait instanceof HTMLElement)) return;
    let enCours = false;

    // Un champ signalé se corrige en direct ; l'e-mail se vérifie aussi en le quittant.
    formulaire.addEventListener('input', (e) => {
        const s = e.target;
        if ((s instanceof HTMLInputElement || s instanceof HTMLTextAreaElement) && s.hasAttribute('aria-invalid')) verifier(s);
    });
    formulaire.addEventListener('focusout', (e) => {
        const s = e.target;
        if (s instanceof HTMLInputElement && s.name === 'Email' && s.value.trim()) verifier(s);
    });

    const recommencer = () => {
        formulaire.reset();
        saisies(formulaire).forEach((s) => signaler(s, ''));
        fait.hidden = true;
        formulaire.hidden = false;
        saisies(formulaire)[0]?.focus();
    };

    formulaire.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (enCours) return;
        const fautifs = saisies(formulaire).filter((s) => !verifier(s));
        if (fautifs.length) {
            fautifs[0].focus();
            return;
        }
        enCours = true;
        alerte.hidden = true;
        envoyer.textContent = 'Envoi…';
        envoyer.setAttribute('aria-disabled', 'true');
        const parti = await poster(formulaire);
        enCours = false;
        envoyer.textContent = 'Envoyer';
        envoyer.removeAttribute('aria-disabled');
        if (parti) montrerReussite(fait, formulaire, recommencer);
        else montrerEchec(alerte, formulaire);
    });
}
