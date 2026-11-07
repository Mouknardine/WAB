/**
 * Le formulaire de la carte Contact : nom, e-mail, deux choix en
 * touches (le projet, le budget), le message, puis « Envoyer ». Les noms
 * des champs et les valeurs des choix sont ceux qu'attend
 * /send-message.php (listes PROJETS et BUDGETS) : ne pas les renommer
 * d'un côté sans l'autre.
 */

export const EMAIL = 'contact@wearebrothers.ch';
export const TELEPHONE = { href: 'tel:+41793115840', texte: '079 311 58 40' };

/** @type {{ valeur: string, texte: string }[]} */
const PROJETS = [
    { valeur: 'Site internet', texte: 'Site' },
    { valeur: 'Refonte', texte: 'Refonte' },
    { valeur: 'Application métier', texte: 'Application' },
    { valeur: 'E-commerce', texte: 'Boutique' },
    { valeur: 'Branding', texte: 'Identité' },
];

/** @type {{ valeur: string, texte: string }[]} */
const BUDGETS = [
    { valeur: 'Moins de 2k', texte: '< 2’000' },
    { valeur: '2k à 4k', texte: '2 – 4’000' },
    { valeur: '4k à 6k', texte: '4 – 6’000' },
    { valeur: '6k à 8k', texte: '6 – 8’000' },
    { valeur: '8k à 10k', texte: '8 – 10’000' },
    { valeur: 'À définir', texte: 'À voir' },
];

/**
 * @param {string} balise @param {string} classe @param {string} [texte]
 * @returns {HTMLElement}
 */
function el(balise, classe, texte) {
    const noeud = document.createElement(balise);
    noeud.className = classe;
    if (texte !== undefined) noeud.textContent = texte;
    return noeud;
}

/**
 * Un champ texte avec son libellé et la place de son message d'erreur.
 * @param {{ nom: string, libelle: string, type?: string, auto?: string, requis?: boolean, multiligne?: boolean }} c
 * @returns {HTMLElement}
 */
function champ({ nom, libelle, type = 'text', auto = 'off', requis = false, multiligne = false }) {
    const id = `contact-${nom.toLowerCase()}`;
    const bloc = el('div', 'champ');
    const label = el('label', 'champ__libelle', libelle);
    label.setAttribute('for', id);
    if (!requis) label.append(el('span', 'champ__facultatif', ' (facultatif)'));
    const saisie = multiligne ? document.createElement('textarea') : document.createElement('input');
    Object.assign(saisie, { id, name: nom, className: 'champ__saisie', autocomplete: auto, required: requis });
    if (saisie instanceof HTMLInputElement) saisie.type = type;
    else saisie.rows = 4;
    const erreur = el('p', 'champ__erreur');
    erreur.id = `${id}-erreur`;
    erreur.hidden = true;
    bloc.append(label, saisie, erreur);
    return bloc;
}

/**
 * Un groupe de choix en touches : cases à cocher ou boutons radio.
 * @param {{ nom: string, legende: string, choix: { valeur: string, texte: string }[], plusieurs: boolean }} g
 * @returns {HTMLFieldSetElement}
 */
function choix({ nom, legende, choix: liste, plusieurs }) {
    const groupe = /** @type {HTMLFieldSetElement} */ (el('fieldset', 'choix'));
    const titre = el('legend', 'champ__libelle', legende);
    titre.append(el('span', 'champ__facultatif', ' (facultatif)'));
    const touches = el('div', 'choix__touches');
    for (const { valeur, texte } of liste) {
        const label = el('label', 'choix__touche');
        const entree = document.createElement('input');
        Object.assign(entree, { type: plusieurs ? 'checkbox' : 'radio', name: nom, value: valeur, className: 'choix__case' });
        label.append(entree, el('span', 'choix__texte', texte));
        touches.append(label);
    }
    groupe.append(titre, touches);
    return groupe;
}

/** Champ piège : invisible pour les gens, rempli par les robots. @returns {HTMLElement} */
function piege() {
    const bloc = el('div', 'formulaire__piege');
    bloc.setAttribute('aria-hidden', 'true');
    const entree = document.createElement('input');
    Object.assign(entree, { type: 'text', name: '_honey', tabIndex: -1, autocomplete: 'off' });
    bloc.append(entree);
    return bloc;
}

/** @returns {HTMLElement} « Ou directement : e-mail, téléphone » */
function direct() {
    const ligne = el('p', 'formulaire__direct', 'Ou directement :');
    const mail = document.createElement('a');
    mail.href = `mailto:${EMAIL}`;
    mail.textContent = EMAIL;
    const tel = document.createElement('a');
    tel.href = TELEPHONE.href;
    tel.textContent = TELEPHONE.texte;
    ligne.append(mail, tel);
    return ligne;
}

/**
 * @returns {{ formulaire: HTMLFormElement, bloc: HTMLElement }}
 *   bloc : le formulaire et ses messages, à poser dans la carte
 */
export function fabriquerFormulaire() {
    const bloc = el('div', 'formulaire');
    const formulaire = /** @type {HTMLFormElement} */ (el('form', 'formulaire__champs'));
    formulaire.action = '/send-message.php';
    formulaire.method = 'post';
    formulaire.noValidate = true;
    const envoyer = /** @type {HTMLButtonElement} */ (el('button', 'formulaire__envoyer', 'Envoyer'));
    envoyer.type = 'submit';
    const alerte = el('div', 'formulaire__alerte');
    alerte.setAttribute('role', 'alert');
    alerte.hidden = true;
    formulaire.append(
        champ({ nom: 'Nom', libelle: 'Nom', auto: 'name', requis: true }),
        champ({ nom: 'Email', libelle: 'E-mail', type: 'email', auto: 'email', requis: true }),
        champ({ nom: 'Entreprise', libelle: 'Entreprise', auto: 'organization' }),
        choix({ nom: 'Projet[]', legende: 'Votre projet', choix: PROJETS, plusieurs: true }),
        choix({ nom: 'Budget', legende: 'Budget en CHF', choix: BUDGETS, plusieurs: false }),
        champ({ nom: 'Message', libelle: 'Votre message', requis: true, multiligne: true }),
        piege(),
        alerte,
        envoyer,
    );
    const fait = el('div', 'formulaire__fait');
    fait.setAttribute('role', 'status');
    fait.hidden = true;
    bloc.append(formulaire, fait, direct());
    return { formulaire, bloc };
}
