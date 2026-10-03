// @ts-check
/**
 * WAB OS — chargement à la demande
 * Les fenêtres, la palette et le terminal ne pèsent rien tant qu'on
 * ne les ouvre pas : leur feuille de style n'est demandée qu'à la
 * première ouverture, et la fenêtre attend qu'elle soit là pour
 * s'afficher (jamais de fenêtre nue).
 */

/** @type {Map<string, Promise<void>>} */
const styles = new Map();

/**
 * @param {string} name  nom de la feuille dans css/, sans extension
 * @param {number} version  numéro ?v= de la feuille
 * @returns {Promise<void>}
 */
export function loadStyle(name, version) {
    const href = new URL(`../../css/${name}.css?v=${version}`, import.meta.url).href;
    const known = styles.get(href);
    if (known) return known;

    const pending = new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.addEventListener('load', () => resolve(undefined), { once: true });
        link.addEventListener('error', () => {
            styles.delete(href);
            link.remove();
            reject(new Error(`Feuille introuvable : ${name}`));
        }, { once: true });
        document.head.append(link);
    });
    styles.set(href, pending);
    return pending;
}

/**
 * Signale une erreur sans bruit dans la console du visiteur : le
 * navigateur la remonte aux outils de suivi s'il y en a, et la page
 * garde une trace lisible en inspectant la racine.
 * @param {string} where
 * @param {unknown} error
 */
export function report(where, error) {
    document.documentElement.dataset.osError = where;
    if (typeof window.reportError === 'function') window.reportError(error);
}
